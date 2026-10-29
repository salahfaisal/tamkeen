
import crypto from "node:crypto";
import {query,ready,respond,requireOrigin,session,createSession,clearSession,event,passwordHash,randomSalt,safe,token,encrypt,decrypt,base32,otpValid,recoveryHash,failure,resetFailures,rateLimitError,parseBody,safeKey,safeText} from "../lib/tamkeen-admin-core.mjs";
const deny=(res)=>respond(res,401,{ok:false,error:"Unauthorized"});
const fail=(res,msg="تعذر تنفيذ العملية")=>respond(res,400,{ok:false,error:msg});
async function saveContent(key,text,mode,version) {
  return query("INSERT INTO tamkeen_content_items(content_key,published_text,draft_text,version) VALUES($1,CASE WHEN $2='publish' THEN $3 ELSE NULL END,CASE WHEN $2='draft' THEN $3 ELSE NULL END,CASE WHEN $2='publish' THEN 1 ELSE 0 END) ON CONFLICT(content_key) DO UPDATE SET published_text=CASE WHEN $2='publish' THEN EXCLUDED.published_text ELSE tamkeen_content_items.published_text END,draft_text=CASE WHEN $2='draft' THEN EXCLUDED.draft_text ELSE NULL END,version=CASE WHEN $2='publish' THEN tamkeen_content_items.version+1 ELSE tamkeen_content_items.version END,updated_at=now() WHERE tamkeen_content_items.version=$4 RETURNING content_key,published_text,draft_text,version",[key,mode,text,version]);
}
export default async function handler(req,res) {
  if(!ready())return respond(res,503,{ok:false,error:"لم يتم تهيئة خدمات الإدارة بعد."});
  const action=String(req.query?.action||"");
  if(req.method!=="GET" && req.method!=="POST")return respond(res,405,{ok:false});
  if(req.method==="POST"&&!requireOrigin(req))return respond(res,403,{ok:false,error:"Origin check failed"});
  try {
    if(req.method==="GET"&&action==="session"){
      const owner=await session(req);return respond(res,200,{ok:true,authenticated:!!owner,email:owner?.email||null});
    }
    if(req.method==="POST"&&action==="bootstrap"){
      if(!process.env.ADMIN_BOOTSTRAP_TOKEN)return respond(res,503,{ok:false,error:"Owner activation must be configured in Vercel"});
      const b=parseBody(req),expected=process.env.ADMIN_BOOTSTRAP_TOKEN;
      if(typeof b.token!=="string"||!safe(b.token,expected))return deny(res);
      if(String(b.email||"").trim().toLowerCase()!==process.env.ADMIN_OWNER_EMAIL.trim().toLowerCase())return deny(res);
      if(typeof b.password!=="string"||b.password.length<14||b.password.length>128)return fail(res,"استخدم كلمة مرور من 14 حرفًا على الأقل.");
      const existing=await query("SELECT 1 FROM tamkeen_admin_accounts LIMIT 1");
      if(existing.rowCount)return respond(res,409,{ok:false,error:"تم إنشاء حساب المدير مسبقًا."});
      const salt=randomSalt();
      const r=await query("INSERT INTO tamkeen_admin_accounts(email,password_salt,password_hash) VALUES($1,$2,$3) ON CONFLICT DO NOTHING RETURNING id",[b.email.trim().toLowerCase(),salt,passwordHash(b.password,salt)]);
      if(!r.rowCount)return respond(res,409,{ok:false});
      await event("owner_created",r.rows[0].id);
      return respond(res,201,{ok:true,message:"تم إنشاء الحساب. سجّل الدخول لتفعيل المصادقة الثنائية."});
    }
    if(req.method==="POST"&&action==="login") {
      const b=parseBody(req),email=String(b.email||"").trim().toLowerCase();
      const r=await query("SELECT * FROM tamkeen_admin_accounts WHERE email=$1",[email]);
      const a=r.rows[0];if(!a)return deny(res);
      if(a.locked_until&&new Date(a.locked_until)>new Date())return rateLimitError(res);
      const actual=passwordHash(String(b.password||""),a.password_salt);
      if(!safe(actual,a.password_hash)){await failure(a.id);await event("login_failed",a.id);return deny(res);}
      await resetFailures(a.id);
      await clearSession(req,res,"preauth");
      await createSession(res,a.id,"preauth");
      return respond(res,200,{ok:true,next:a.totp_enabled?"verify":"setup"});
    }
    if(req.method==="GET"&&action==="setup") {
      const pre=await session(req,"preauth");if(!pre)return deny(res);
      if(pre.totp_enabled)return fail(res,"تم تفعيل المصادقة مسبقًا.");
      let r=await query("SELECT totp_pending FROM tamkeen_admin_accounts WHERE id=$1",[pre.id]);
      let key=r.rows[0]?.totp_pending;
      if(!key){key=encrypt(base32(crypto.randomBytes(20)));await query("UPDATE tamkeen_admin_accounts SET totp_pending=$1 WHERE id=$2",[key,pre.id]);}
      const secret=decrypt(key);
      const uri="otpauth://totp/"+encodeURIComponent("Tamkeen Admin:"+pre.email)+"?secret="+secret+"&issuer="+encodeURIComponent("Tamkeen Admin")+"&algorithm=SHA1&digits=6&period=30";
      return respond(res,200,{ok:true,secret,uri});
    }
    if(req.method==="POST"&&action==="rotate-setup"){
      const pre=await session(req,"preauth");if(!pre)return deny(res);
      const nextSecret=encrypt(base32(crypto.randomBytes(20)));
      const changed=await query("UPDATE tamkeen_admin_accounts SET totp_pending=$1,updated_at=now() WHERE id=$2 AND totp_enabled=false AND (locked_until IS NULL OR locked_until<=now()) RETURNING id",[nextSecret,pre.id]);
      if(!changed.rowCount)return fail(res,"لا يمكن إنشاء مفتاح جديد؛ تأكد من حالة حسابك.");
      await event("totp_pending_rotated",pre.id);
      return respond(res,200,{ok:true,message:"تم إلغاء المفتاح السابق وإنشاء مفتاح مصادقة جديد."});
    }
    if(req.method==="POST"&&action==="setup-verify"){
      const pre=await session(req,"preauth");if(!pre)return deny(res);
      const r=await query("SELECT totp_pending,totp_enabled,locked_until FROM tamkeen_admin_accounts WHERE id=$1",[pre.id]);
      const a=r.rows[0];if(!a||a.totp_enabled||!a.totp_pending)return fail(res);
      if(a.locked_until&&new Date(a.locked_until)>new Date())return rateLimitError(res);
      const b=parseBody(req);
      if(!otpValid(decrypt(a.totp_pending),b.code)){await failure(pre.id);return deny(res);}
      const codes=Array.from({length:10},()=>crypto.randomBytes(9).toString("hex").toUpperCase());
      await query("UPDATE tamkeen_admin_accounts SET totp_secret=totp_pending,totp_pending=NULL,totp_enabled=true,recovery_hashes=$1,failed_attempts=0,locked_until=NULL WHERE id=$2",[codes.map(recoveryHash),pre.id]);
      await clearSession(req,res,"preauth");
      await createSession(res,pre.id,"full");
      await event("totp_enabled",pre.id);
      return respond(res,200,{ok:true,recoveryCodes:codes});
    }
    if(req.method==="POST"&&action==="verify") {
      const pre=await session(req,"preauth");if(!pre)return deny(res);
      const r=await query("SELECT totp_secret,totp_enabled,recovery_hashes,locked_until FROM tamkeen_admin_accounts WHERE id=$1",[pre.id]);
      const a=r.rows[0];if(!a?.totp_enabled||!a.totp_secret)return deny(res);
      if(a.locked_until&&new Date(a.locked_until)>new Date())return rateLimitError(res);
      const b=parseBody(req),code=String(b.code||"").trim();
      const totpOk=otpValid(decrypt(a.totp_secret),code);
      const hashed=recoveryHash(code),recoveryOk=(a.recovery_hashes||[]).some(h=>safe(h,hashed));
      if(!totpOk&&!recoveryOk){await failure(pre.id);await event("totp_failed",pre.id);return deny(res);}
      if(recoveryOk)await query("UPDATE tamkeen_admin_accounts SET recovery_hashes=array_remove(recovery_hashes,$1) WHERE id=$2",[hashed,pre.id]);
      await resetFailures(pre.id);
      await clearSession(req,res,"preauth");
      await createSession(res,pre.id,"full");
      await event(recoveryOk?"recovery_used":"login_success",pre.id);
      return respond(res,200,{ok:true});
    }
    if(req.method==="POST"&&action==="logout") {
      await clearSession(req,res,"full");await clearSession(req,res,"preauth");
      return respond(res,200,{ok:true});
    }
    const owner=await session(req);
    if(!owner)return deny(res);
    if(req.method==="GET"&&action==="content"){
      const key=safeKey(req.query?.key);
      const r=await query("SELECT content_key,published_text,draft_text,version FROM tamkeen_content_items WHERE content_key=$1",[key]);
      return respond(res,200,{ok:true,item:r.rows[0]||{content_key:key,published_text:null,draft_text:null,version:0}});
    }
    if(req.method==="GET"&&action==="history") {
      const key=safeKey(req.query?.key);
      const r=await query("SELECT id,action,old_text,new_text,version,created_at FROM tamkeen_content_history WHERE content_key=$1 ORDER BY id DESC LIMIT 30",[key]);
      return respond(res,200,{ok:true,history:r.rows});
    }
    if(req.method==="POST"&&action==="save"){
      const b=parseBody(req),key=safeKey(b.key),value=safeText(b.text),mode=b.mode;
      if(!["draft","publish"].includes(mode)||!Number.isInteger(b.expectedVersion)||b.expectedVersion<0)return fail(res);
      const found=await saveContent(key,value,mode,b.expectedVersion);
      if(!found.rowCount)return respond(res,409,{ok:false,error:"تغير المحتوى منذ فتح المحرر. أعد تحميله."});
      await event("content_"+mode,owner.id,key);
      return respond(res,200,{ok:true,item:found.rows[0]});
    }
    if(req.method==="POST"&&action==="restore"){
      const b=parseBody(req),key=safeKey(b.key),id=Number(b.historyId),version=b.expectedVersion;
      if(!Number.isSafeInteger(id)||id<1||!Number.isInteger(version)||version<0)return fail(res);
      const previous=await query("SELECT new_text FROM tamkeen_content_history WHERE content_key=$1 AND id=$2",[key,id]);
      if(!previous.rowCount||previous.rows[0].new_text===null)return fail(res,"الإصدار غير متاح.");
      const saved=await saveContent(key,previous.rows[0].new_text,"publish",version);
      if(!saved.rowCount)return respond(res,409,{ok:false,error:"حدث تعارض في الإصدار."});
      await event("content_restore",owner.id,key+"#"+id);
      return respond(res,200,{ok:true,item:saved.rows[0]});
    }
    return respond(res,404,{ok:false,error:"Unknown route"});
  } catch(err) {
    if(String(err.message).startsWith("Invalid")||err.message==="JSON body required")return fail(res,"المدخلات غير صحيحة.");
    console.error("tamkeen admin error",err.message);
    return respond(res,503,{ok:false,error:"تعذّر إتمام الطلب. حاول لاحقًا."});
  }
}
