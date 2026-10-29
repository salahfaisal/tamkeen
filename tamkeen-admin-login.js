
(function(){
"use strict";
const root=document.getElementById("app"),msg=document.getElementById("msg"),status=document.getElementById("status"),api="/api/admin?action=";
async function request(action,data){
 const response=await fetch(api+action,{method:data?"POST":"GET",headers:data?{"Content-Type":"application/json"}:{},body:data?JSON.stringify(data):undefined,credentials:"same-origin",cache:"no-store"});
 let json={};try{json=await response.json();}catch{}
 if(!response.ok||!json.ok)throw new Error(json.error||"تعذر إتمام العملية");return json;
}
function input(type,name,placeholder){
 const label=document.createElement("label");label.textContent=name;
 const el=document.createElement("input");el.type=type;el.placeholder=placeholder||"";el.required=true;
 if(type==="password")el.autocomplete="current-password";label.append(el);return {label,el};
}
function form(title,fields,buttonText,handler){
 root.replaceChildren();const heading=document.createElement("h2");heading.textContent=title;
 const f=document.createElement("form");fields.forEach(x=>f.append(x.label));
 const btn=document.createElement("button");btn.textContent=buttonText;f.append(btn);
 f.onsubmit=async ev=>{ev.preventDefault();msg.textContent="";btn.disabled=true;try{await handler(fields.map(i=>i.el.value));}catch(err){msg.textContent=err.message;}finally{btn.disabled=false;}};
 root.append(heading,f);
}
function login(){
 const e=input("email","البريد الإلكتروني","email@example.com"),p=input("password","كلمة المرور","14 حرفًا على الأقل");
 form("تسجيل الدخول",[e,p],"التالي",async ([email,password])=>{
 const res=await request("login",{email,password});if(res.next==="setup")await setup();else verification();
 });
}
async function setup(){
 const data=await request("setup");
 const description=document.createElement("p");description.textContent="أضف المفتاح التالي يدويًا في تطبيق مصادقة على هاتفك. لا تشاركه مع أي شخص.";
 const secret=document.createElement("pre");secret.id="codes";secret.textContent=data.secret;
 const deep=document.createElement("p");const url=document.createElement("a");url.href=data.uri;url.textContent="فتح تطبيق المصادقة (إن كان مدعومًا)";deep.append(url);
 const code=input("text","رمز المصادقة من 6 أرقام","000000");
 form("تفعيل المصادقة الثنائية",[code],"تفعيل والتحقق",async ([value])=>{
  const result=await request("setup-verify",{code:value});root.replaceChildren();
  const text=document.createElement("p");text.textContent="احتفظ برموز الاسترداد في مكان آمن. تظهر مرة واحدة فقط.";
  const pre=document.createElement("pre");pre.id="codes";pre.textContent=result.recoveryCodes.join("\n");
  const done=document.createElement("a");done.href="/#hero";done.textContent="الذهاب إلى المنصة وتفعيل وضع التحرير";
  root.append(text,pre,done);status.textContent="اكتمل التفعيل.";
 });
 root.prepend(description,secret,deep);
}
function verification(){
 const c=input("text","رمز التحقق أو رمز الاسترداد","000000");
 form("التحقق الثنائي",[c],"دخول",async ([code])=>{await request("verify",{code});window.location.replace("/#hero");});
}
function bootstrap(){
 const t=input("password","رمز التفعيل الذي أضفته في إعدادات Vercel","رمز التفعيل");
 const e=input("email","بريد المالك","البريد المصرح");
 const p=input("password","كلمة مرور جديدة قوية","14 حرفًا فأكثر");
 form("تفعيل حساب المالك لأول مرة",[t,e,p],"إنشاء الحساب",async ([token,email,password])=>{
  await request("bootstrap",{token,email,password});msg.textContent="أُنشئ الحساب. سجّل الدخول لتفعيل المصادقة الثنائية.";login();
 });
}
async function boot(){
 status.textContent="";
 try{const state=await request("session");
  if(state.authenticated){
   root.innerHTML="<p>تم تسجيل الدخول بصلاحية المدير.</p><p><a href='/#hero'>فتح المنصة وتفعيل التحرير</a></p><button type='button' id='logout'>تسجيل الخروج</button>";
   root.querySelector("#logout").onclick=async()=>{try{await request("logout",{});login();}catch(e){msg.textContent=e.message;}};
  }else login();
 }catch(err){status.textContent=err.message;login();}
 const toggle=document.createElement("button");toggle.textContent="تفعيل حساب المالك لأول مرة";toggle.type="button";toggle.style.marginTop="12px";
 toggle.onclick=bootstrap;
 root.append(toggle);
}
boot();
})();
