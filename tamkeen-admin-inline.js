
(function(){
"use strict";
const api="/api/admin?action=";
async function request(action,body) {
 const res=await fetch(api+action,{method:body?"POST":"GET",headers:body?{"Content-Type":"application/json"}:{},credentials:"same-origin",cache:"no-store",body:body?JSON.stringify(body):undefined});
 const data=await res.json();
 if(!res.ok||!data.ok)throw new Error(data.error||"تعذر الاتصال");
 return data;
}
async function start(){

 const wantsEditor=new URLSearchParams(window.location.search).get("tamkeenEditor")==="1";
 function diagnostic(message){
  if(!wantsEditor)return;
  const box=document.createElement("div");
  box.id="tamkeen-editor-status";
  box.setAttribute("role","status");
  box.style.cssText="position:fixed;bottom:16px;left:12px;right:12px;z-index:2147483001;max-width:440px;margin:auto;background:#fff;border:2px solid #79448f;color:#25172c;padding:16px;border-radius:14px;box-shadow:0 8px 24px #0005;direction:rtl;font:16px/1.7 system-ui";
  const text=document.createElement("p");text.textContent=message;box.append(text);
  const a=document.createElement("a");a.href="/admin.html";a.textContent="فتح تسجيل دخول المدير على نفس الرابط";
  a.style.cssText="display:inline-block;padding:8px 12px;background:#79448f;color:white;text-decoration:none;border-radius:8px";
  box.append(a);document.body.append(box);
 }
 const content=window.TamkeenContent;
 if(!content){diagnostic("تعذر تحميل محرك تحرير النصوص. تأكد من تحديث الصفحة.");return;}
 let auth;
 try{auth=await request("session");}
 catch{diagnostic("تعذر التحقق من جلسة المدير. انتقل إلى صفحة الدخول وحاول مرة أخرى.");return;}
 if(!auth.authenticated){diagnostic("جلسة المدير غير متاحة على عنوان هذه الصفحة. سجّل الدخول هنا أولًا، ثم افتح المنصة من رابط الإدارة.");return;}

 const css=document.createElement("style");
 css.textContent=".tamkeen-admin-toolbar{position:fixed;z-index:2147482000;bottom:20px;left:20px;background:#25172c;color:#fff;padding:12px;border-radius:14px;box-shadow:0 9px 30px #0004;display:flex;gap:9px;align-items:center;font-family:system-ui}.tamkeen-admin-toolbar button{background:#fff;color:#25172c;border:0;border-radius:9px;padding:9px 13px;font-weight:700;cursor:pointer}.tamkeen-admin-toolbar button.active{background:#e7c4ff}.tamkeen-edit-mode .tamkeen-edit-target{outline:2px dashed #a22bc7!important;outline-offset:3px;cursor:pointer!important}.admin-editor{position:fixed;z-index:2147483000;inset:0;background:#0008;display:grid;place-items:center;padding:16px;font-family:system-ui;direction:rtl}.admin-editor-panel{background:white;color:#22182a;width:min(660px,96vw);max-height:88vh;overflow:auto;border-radius:16px;padding:22px;box-shadow:0 15px 40px #0005}.admin-editor textarea{width:100%;min-height:150px;padding:12px;font:inherit;box-sizing:border-box;direction:rtl;border:1px solid #b9a5c3;border-radius:10px}.admin-editor-buttons{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}.admin-editor button{font:inherit;cursor:pointer;border:0;border-radius:9px;background:#704583;color:white;padding:9px 13px}.admin-editor button.secondary{background:#eee;color:#333}.admin-editor .message{min-height:24px;color:#663876;font-weight:700;margin-top:10px}.admin-editor .history{border-top:1px solid #ddd;margin-top:10px;display:grid;gap:7px}.admin-editor .history-row{display:flex;gap:7px;align-items:center;justify-content:space-between;padding:7px;background:#faf7fc;border-radius:7px}.admin-editor .history-row button{flex-shrink:0}";
 document.head.append(css);
 const bar=document.createElement("div");bar.className="tamkeen-admin-toolbar";
 bar.innerHTML="<strong>تمكين • المدير</strong><button type='button' id='tamkeenEditToggle'>✏️ تفعيل التحرير</button><a href='/admin.html' style='color:#fff'>الحساب</a>";
 document.body.append(bar);
 const toggle=bar.querySelector("#tamkeenEditToggle");let active=false;
 function mark(){
  document.body.classList.toggle("tamkeen-edit-mode",active);
  for(const el of content.targets())el.classList.toggle("tamkeen-edit-target",active);
  toggle.classList.toggle("active",active);
  toggle.textContent=active?"إنهاء التحرير":"✏️ تفعيل التحرير";
 }
 toggle.onclick=()=>{active=!active;mark();};
 new MutationObserver(()=>{if(active)for(const el of content.targets())el.classList.add("tamkeen-edit-target");}).observe(document.querySelector("main")||document.body,{childList:true,subtree:true});
 document.addEventListener("click",async ev=>{
  if(!active)return;
  const node=ev.target.closest(".tamkeen-edit-target");
  if(!node||!content.editable(node)||ev.target.closest(".admin-editor,.tamkeen-admin-toolbar"))return;
  ev.preventDefault();ev.stopPropagation();ev.stopImmediatePropagation();
  const key=content.keyOf(node);if(!key)return alert("تعذر تحديد مفتاح النص.");
  await edit(node,key);
 },true);
 async function edit(node,key){
  const panel=document.createElement("div");panel.className="admin-editor";
  panel.innerHTML="<div class='admin-editor-panel' role='dialog' aria-modal='true' aria-label='محرر المحتوى'><h2>تعديل النص</h2><p>حفظ مسودة أو نشر النص مباشرة.</p><textarea aria-label='النص المطلوب تعديله'></textarea><div class='admin-editor-buttons'><button type='button' data-act='draft'>حفظ مسودة</button><button type='button' data-act='publish'>حفظ ونشر</button><button type='button' data-act='history' class='secondary'>السجل والاستعادة</button><button type='button' data-act='cancel' class='secondary'>إغلاق</button></div><div class='message' role='status'></div><div class='history'></div></div>";
  document.body.append(panel);
  const field=panel.querySelector("textarea"),message=panel.querySelector(".message"),history=panel.querySelector(".history");
  let item;const published=content.values.has(key)?content.values.get(key):node.textContent;field.value=published;
  try{const data=await request("content&key="+encodeURIComponent(key));item=data.item;field.value=item.draft_text===null?published:item.draft_text;}catch(err){message.textContent=err.message;}
  const close=()=>panel.remove();panel.addEventListener("click",ev=>{if(ev.target===panel)close();});
  panel.querySelector("[data-act=cancel]").onclick=close;
  async function perform(mode){
   if(!item)return;
   try{
    const result=await request("save",{key,text:field.value,mode,expectedVersion:item.version});item=result.item;
    if(mode==="publish"){content.values.set(key,field.value);content.apply();message.textContent="✓ نُشر التغيير بنجاح.";}
    else message.textContent="✓ حُفظت المسودة دون تغيير النص المنشور.";
   }catch(err){message.textContent=err.message;}
  }
  panel.querySelector("[data-act=draft]").onclick=()=>perform("draft");
  panel.querySelector("[data-act=publish]").onclick=()=>perform("publish");
  panel.querySelector("[data-act=history]").onclick=async()=>{
   history.replaceChildren();
   try{
    const data=await request("history&key="+encodeURIComponent(key));
    for(const row of data.history){
     const r=document.createElement("div");r.className="history-row";
     const label=document.createElement("span");label.textContent=row.action+" • "+new Date(row.created_at).toLocaleString("ar")+" • "+String(row.new_text||"").slice(0,70);r.append(label);
     if(row.new_text!==null){
      const restore=document.createElement("button");restore.textContent="استعادة";
      restore.onclick=async()=>{
       if(!confirm("هل تريد نشر هذا الإصدار باعتباره إصدارًا جديدًا؟"))return;
       try{
        const result=await request("restore",{key,historyId:Number(row.id),expectedVersion:item.version});
        item=result.item;field.value=item.published_text;content.values.set(key,item.published_text);content.apply();message.textContent="✓ تمت الاستعادة والنشر.";
       }catch(err){message.textContent=err.message;}
      };r.append(restore);
     }
     history.append(r);
    }
   }catch(err){message.textContent=err.message;}
  };
 }
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start);else start();
})();
