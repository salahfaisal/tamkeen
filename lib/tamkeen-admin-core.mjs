
import crypto from "node:crypto";
import pg from "pg";

let pool;
export function db() {
  if (!process.env.DATABASE_URL) throw new Error("Database is not configured");
  if (!pool) pool = new pg.Pool({connectionString:process.env.DATABASE_URL, max:3, connectionTimeoutMillis:6000, idleTimeoutMillis:10000});
  return pool;
}
export const query = (statement,values=[])=>db().query(statement,values);
export const ready = ()=>Boolean(process.env.DATABASE_URL && process.env.ADMIN_SECRET_KEY && process.env.ADMIN_OWNER_EMAIL);
export function respond(res,status,body) {
  res.setHeader("Cache-Control","private, no-store, max-age=0");
  res.setHeader("X-Content-Type-Options","nosniff");
  res.setHeader("Content-Type","application/json; charset=utf-8");
  res.status(status).json(body);
}
export function requireOrigin(req) {
  const origin=req.headers.origin, host=req.headers["x-forwarded-host"]||req.headers.host;
  if (!origin || !host) return false;
  try { const parsed=new URL(origin); return parsed.protocol==="https:" && parsed.host===String(host).split(",")[0].trim(); }
  catch { return false; }
}
export function cookies(req) {
  return Object.fromEntries(String(req.headers.cookie||"").split(";").map(v=>v.trim().split(/=(.*)/s).slice(0,2)).filter(v=>v.length===2));
}
const hex=(v)=>crypto.createHash("sha256").update(String(v)).digest("hex");
export const token=()=>crypto.randomBytes(32).toString("base64url");
export function setCookie(res,name,value,age) {
  res.setHeader("Set-Cookie",name+"="+encodeURIComponent(value)+"; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age="+age);
}
export const safe=(a,b)=>{const x=Buffer.from(String(a)),y=Buffer.from(String(b));return x.length===y.length&&crypto.timingSafeEqual(x,y);};
export const passwordHash=(password,salt)=>crypto.scryptSync(password,salt,64,{N:16384,r:8,p:1}).toString("hex");
export const randomSalt=()=>crypto.randomBytes(24).toString("hex");
export async function session(req,level="full") {
  const kind=level==="preauth"?"__Host-tamkeen_pre":"__Host-tamkeen_admin";
  const tok=cookies(req)[kind]; if (!tok) return null;
  const r=await query("SELECT a.id,a.email,a.totp_enabled,s.assurance FROM tamkeen_admin_sessions s JOIN tamkeen_admin_accounts a ON a.id=s.account_id WHERE s.token_hash=$1 AND s.expires_at>now() AND s.assurance=$2",[hex(decodeURIComponent(tok)),level]);
  return r.rows[0]||null;
}
export async function createSession(res,accountId,level) {
  const t=token(), ttl=level==="preauth"?600:21600;
  await query("INSERT INTO tamkeen_admin_sessions(token_hash,account_id,assurance,expires_at) VALUES($1,$2,$3,now()+($4::integer * interval '1 second'))",[hex(t),accountId,level,ttl]);
  setCookie(res,level==="preauth"?"__Host-tamkeen_pre":"__Host-tamkeen_admin",t,ttl);
}
export async function clearSession(req,res,level) {
  const name=level==="preauth"?"__Host-tamkeen_pre":"__Host-tamkeen_admin";
  const tok=cookies(req)[name];
  if (tok) await query("DELETE FROM tamkeen_admin_sessions WHERE token_hash=$1",[hex(decodeURIComponent(tok))]);
  const prev=res.getHeader("Set-Cookie")||[];
  res.setHeader("Set-Cookie",[...([].concat(prev).filter(Boolean)),name+"=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0"]);
}
export async function event(name,accountId=null,detail=null) {
  try { await query("INSERT INTO tamkeen_admin_events(event_type,account_id,detail) VALUES($1,$2,$3)",[name,accountId,detail]); } catch {}
}
const secretKey=()=>crypto.createHash("sha256").update(process.env.ADMIN_SECRET_KEY).digest();
export function encrypt(value) {
  const iv=crypto.randomBytes(12),cipher=crypto.createCipheriv("aes-256-gcm",secretKey(),iv);
  const enc=Buffer.concat([cipher.update(String(value),"utf8"),cipher.final()]);
  return Buffer.concat([iv,cipher.getAuthTag(),enc]).toString("base64");
}
export function decrypt(value) {
  const data=Buffer.from(value,"base64"),dec=crypto.createDecipheriv("aes-256-gcm",secretKey(),data.subarray(0,12));
  dec.setAuthTag(data.subarray(12,28));
  return Buffer.concat([dec.update(data.subarray(28)),dec.final()]).toString("utf8");
}
const alphabet="ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
export function base32(bytes) {
  let acc=0,bits=0,out="";
  for(const b of bytes){acc=(acc<<8)|b;bits+=8;while(bits>=5){out+=alphabet[(acc>>>(bits-=5))&31];}}
  if(bits)out+=alphabet[(acc<<(5-bits))&31];
  return out;
}
export function unbase32(value) {
  let acc=0,bits=0,bytes=[];
  for(const c of value.toUpperCase().replace(/=+$/,"")) {
    const n=alphabet.indexOf(c);if(n<0)continue;
    acc=(acc<<5)|n;bits+=5;if(bits>=8){bits-=8;bytes.push((acc>>bits)&255);}
  }
  return Buffer.from(bytes);
}
export function otpValid(secret,code) {
  if(!/^\d{6}$/.test(String(code||"")))return false;
  const k=unbase32(secret),now=Math.floor(Date.now()/30000);
  for(let offset=-1;offset<=1;offset++){
    const buffer=Buffer.alloc(8);buffer.writeBigUInt64BE(BigInt(now+offset));
    const h=crypto.createHmac("sha1",k).update(buffer).digest();
    const p=h[h.length-1]&15;
    const value=((h[p]&127)<<24)|((h[p+1]&255)<<16)|((h[p+2]&255)<<8)|(h[p+3]&255);
    if(safe(String(value%1000000).padStart(6,"0"),code))return true;
  }
  return false;
}
export const recoveryHash=(value)=>crypto.createHmac("sha256",secretKey()).update(String(value).trim().toUpperCase()).digest("hex");
export function rateLimitError(res) {return respond(res,429,{ok:false,error:"تم إيقاف المحاولات مؤقتًا. حاول لاحقًا."});}
export async function failure(accountId) {
  await query("UPDATE tamkeen_admin_accounts SET failed_attempts=failed_attempts+1,locked_until=CASE WHEN failed_attempts+1>=5 THEN now()+interval '15 minutes' ELSE locked_until END WHERE id=$1",[accountId]);
}
export async function resetFailures(accountId) {
  await query("UPDATE tamkeen_admin_accounts SET failed_attempts=0,locked_until=NULL WHERE id=$1",[accountId]);
}
export function parseBody(req) {
  if (!String(req.headers["content-type"]||"").startsWith("application/json")) throw new Error("JSON body required");
  const b=req.body;return (b && typeof b==="object"&&!Array.isArray(b))?b:JSON.parse(String(b||"{}"));
}
export function safeText(v,max=5000) {if(typeof v!=="string"||v.length>max)throw new Error("Invalid text");return v;}
export function safeKey(v) {if(typeof v!=="string"||!/^[-a-zA-Z0-9_.:]{3,200}$/.test(v))throw new Error("Invalid key");return v;}
