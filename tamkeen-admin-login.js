
(function(){
"use strict";
const root=document.getElementById("app"),msg=document.getElementById("msg"),status=document.getElementById("status");
const api="/api/admin?action=";
async function request(action,data){
 const resp=await fetch(api+action,{method:data?"POST":"GET",headers:data?{"Content-Type":"application/json"}:{},body:data?JSON.stringify(data):undefined,credentials:"same-origin",cache:"no-store"});
 let body={};try{body=await resp.json();}catch{}
 if(!resp.ok||!body.ok)throw new Error(body.error||"تعذر الاتصال بالخادم");
 return body;
}
function input(type,label,placeholder){
 const wrapper=document.createElement("label");wrapper.textContent=label;
 const field=document.createElement("input");field.type=type;field.required=true;field.placeholder=placeholder||"";
 field.autocomplete=type==="password"?"current-password":type==="email"?"username":"one-time-code";
 wrapper.append(field);return {wrapper,field};
}
function button(label,action,variant=""){
 const b=document.createElement("button");b.type="button";b.textContent=label;
 if(variant)b.className=variant;b.addEventListener("click",action);return b;
}
function form(title,items,label,action){
 root.replaceChildren();msg.textContent="";
 const heading=document.createElement("h2");heading.textContent=title;
 const f=document.createElement("form");items.forEach(i=>f.append(i.wrapper));
 const submit=document.createElement("button");submit.type="submit";submit.textContent=label;f.append(submit);
 f.addEventListener("submit",async ev=>{
  ev.preventDefault();msg.textContent="";submit.disabled=true;
  try{await action(items.map(i=>i.field.value));}catch(e){msg.textContent=e.message;}finally{submit.disabled=false;}
 });
 root.append(heading,f);items[0]?.field.focus();
}
function login(){
 status.textContent="";
 const e=input("email","البريد الإلكتروني","example@email.com"),p=input("password","كلمة المرور","كلمة مرور حساب المدير");
 form("تسجيل دخول المدير",[e,p],"التالي",async ([email,password])=>{
  const r=await request("login",{email,password});
  if(r.next==="setup")await setup();else verify();
 });
}
function verify(){
 const c=input("text","رمز Google Authenticator أو رمز الاسترداد","000000");
 c.field.inputMode="numeric";
 form("التحقق بخطوتين",[c],"دخول آمن",async ([code])=>{
  await request("verify",{code});location.assign("/?tamkeenEditor=1#hero");
 });
}
async function setup(){
 const r=await request("setup");
 const c=input("text","رمز المصادقة المكون من 6 أرقام","000000");
 form("إعداد المصادقة الثنائية",[c],"تفعيل",async ([code])=>{
  const result=await request("setup-verify",{code});
  root.replaceChildren();
  const note=document.createElement("p");note.textContent="هذه رموز الاسترداد الخاصة بك، احفظها بعيدًا عن أي شخص. تظهر مرة واحدة فقط.";
  const codes=document.createElement("pre");codes.id="codes";codes.textContent=result.recoveryCodes.join("\n");
  const link=document.createElement("a");link.href="/?tamkeenEditor=1#hero";link.textContent="الانتقال إلى تحرير الموقع";
  root.append(note,codes,link);status.textContent="تم التفعيل بنجاح.";
 });
 const text=document.createElement("p");text.textContent="أضف المفتاح في تطبيق المصادقة، ولا ترسله لأي شخص.";
 const key=document.createElement("pre");key.id="codes";key.textContent=r.secret;
 const rotate=button("إنشاء مفتاح مصادقة جديد",async()=>{
  if(!confirm("سيتم إبطال المفتاح السابق. متابعة؟"))return;
  try{await request("rotate-setup",{});await setup();}catch(err){msg.textContent=err.message;}
 },"secondary");
 root.prepend(text,key,rotate);
}
async function showDevices(){
 const box=document.getElementById("devices");
 if(!box)return;
 try{
  const result=await request("devices");
  box.replaceChildren();
  const title=document.createElement("h3");title.textContent="الأجهزة والجلسات النشطة";box.append(title);
  if(!result.devices.length){const p=document.createElement("p");p.textContent="لا توجد جلسات نشطة.";box.append(p);}
  for(const device of result.devices){
   const row=document.createElement("div");row.className="device-row";
   const info=document.createElement("span");
   info.textContent=device.device+(device.current?" (هذا الجهاز)":"")+" — "+new Date(device.last_seen_at).toLocaleString("ar");
   const end=button("تسجيل خروج",async()=>{
    if(!confirm("هل تريد إنهاء هذه الجلسة؟"))return;
    try{const r=await request("revoke-device",{id:device.id});if(r.loggedOut)login();else await showDevices();}
    catch(e){msg.textContent=e.message;}
   },"secondary");
   row.append(info,end);box.append(row);
  }
  box.append(button("تسجيل الخروج من جميع الأجهزة",async()=>{
   if(!confirm("سيتم تسجيل الخروج من جميع الأجهزة، بما فيها جهازك الحالي. متابعة؟"))return;
   try{await request("revoke-all",{});login();}catch(e){msg.textContent=e.message;}
  },"secondary"));
 }catch(e){const p=document.createElement("p");p.textContent=e.message;box.replaceChildren(p);}
}
function dashboard(email){
 root.replaceChildren();status.textContent="";msg.textContent="";
 const h=document.createElement("h2");h.textContent="مرحبًا، مدير تمكين";
 const p=document.createElement("p");p.textContent="تم التحقق من حسابك: "+email;
 const link=document.createElement("a");link.href="/?tamkeenEditor=1#hero";link.textContent="✏️ فتح المنصة وتفعيل التحرير";
 link.className="admin-primary-link";
 const devices=document.createElement("div");devices.id="devices";
 const logout=button("تسجيل الخروج من هذا المتصفح",async()=>{
  try{await request("logout",{});login();}catch(e){msg.textContent=e.message;}
 },"secondary");
 root.append(h,p,link,devices,logout);
 showDevices();
}
async function boot(){
 try{
  const session=await request("session");
  if(session.authenticated)dashboard(session.email||"");else login();
 }catch(e){status.textContent="تعذر التحقق من الجلسة: "+e.message;login();}
}
boot();
})();