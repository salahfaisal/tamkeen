(function(){
"use strict";
// Lightweight reader: visitor pages do not install an observer until
// published overrides actually exist.
const values=new Map();
const selector="main h1,main h2,main h3,main h4,main p,main summary,main .section-kicker,main .mini-badge,main .hero-pills span,.announcement-message";
function editable(el){
 if(!el||!el.matches(selector))return false;
 if(el.closest("form,.admin-editor,.tamkeen-admin-toolbar,[data-tamkeen-noedit],script,style"))return false;
 if(el.querySelector("a,button,input,textarea,select,img,svg,video,iframe,canvas"))return false;
 return Boolean(el.textContent.trim());
}
function keyOf(el){
 if(el.dataset.tamkeenKey)return el.dataset.tamkeenKey;
 const root=el.closest("section[id]")||el.closest("main")||document.body;
 const bits=[];let node=el;
 while(node&&node!==root&&bits.length<14){
  const parent=node.parentElement;if(!parent)break;
  const siblings=Array.from(parent.children).filter(x=>x.tagName===node.tagName);
  bits.unshift(node.tagName.toLowerCase()+String(siblings.indexOf(node)+1));node=parent;
 }
 const key="dom."+(root.id||root.tagName.toLowerCase())+"."+bits.join(".");
 return key.length<=200?key:null;
}
function targets(){return Array.from(document.querySelectorAll(selector)).filter(editable);}
function findTarget(origin){
 let node=origin;
 // Walk up only the few ancestors of the tapped element, not all page text.
 while(node && node!==document.body){
  if(node.matches?.(selector)&&editable(node))return node;
  node=node.parentElement;
 }
 return null;
}
let frame=0,observer=null,timer=0;
function apply(){
 if(!values.size||frame)return;
 frame=requestAnimationFrame(()=>{
  frame=0;
  const hits=targets();
  for(const el of hits){
   const key=keyOf(el);
   if(key&&values.has(key)&&el.textContent!==values.get(key)){
    el.textContent=values.get(key);
    el.style.whiteSpace="pre-line";
   }
  }
 });
}
function watch(){
 if(observer||!values.size)return;
 const scope=document.querySelector("main")||document.body;
 observer=new MutationObserver(()=>{
  if(timer)clearTimeout(timer);
  timer=setTimeout(()=>{timer=0;apply();},400);
 });
 observer.observe(scope,{childList:true,subtree:true});
}
async function load(){
 try{
  const res=await fetch("/api/content",{cache:"no-store",credentials:"same-origin"});
  if(!res.ok)return;
  const data=await res.json();
  if(!data.ok)return;
  values.clear();
  for(const [key,value] of Object.entries(data.items||{})){
   if(typeof value==="string")values.set(key,value);
  }
  if(values.size){apply();watch();}
  else if(observer){observer.disconnect();observer=null;}
 }catch{ /* original page remains fully usable when content API is offline */ }
}
window.TamkeenContent={values,editable,keyOf,targets,findTarget,apply,load};
load();
})();
