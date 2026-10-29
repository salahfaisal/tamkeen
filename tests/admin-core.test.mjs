import test from "node:test";
import assert from "node:assert/strict";
import {otpValid,base32,unbase32,passwordHash,randomSalt,safe,encrypt,decrypt,safeKey,safeText,requireOrigin,ready,deviceLabel} from "../lib/tamkeen-admin-core.mjs";

test("RFC6238 TOTP SHA1 vectors at six digits",()=>{
  const source=Buffer.from("12345678901234567890");
  const secret=base32(source);
  assert.deepEqual(unbase32(secret),source);
  const prev=Date.now;
  try {
    Date.now=()=>59_000;
    assert.equal(otpValid(secret,"287082"),true);
    assert.equal(otpValid(secret,"111111"),false);
    Date.now=()=>1111111109_000;
    assert.equal(otpValid(secret,"081804"),true);
  }finally{Date.now=prev;}
});
test("password hashes are salted and compared in constant-time",()=>{
  const password="strong owner password (testing only)";
  const salt=randomSalt();
  assert.equal(safe(passwordHash(password,salt),passwordHash(password,salt)),true);
  assert.equal(safe(passwordHash(password,salt),passwordHash("different",salt)),false);
});
test("TOTP secrets encrypted at rest",()=>{
  process.env.ADMIN_SECRET_KEY="unit-test-only-key-that-is-more-than-32-characters";
  const source="JBSWY3DPEHPK3PXP";
  assert.equal(decrypt(encrypt(source)),source);
});
test("owner actions reject cross-origin",()=>{
  assert.equal(requireOrigin({headers:{origin:"https://tamkeen-mauve.vercel.app",host:"tamkeen-mauve.vercel.app"}}),true);
  assert.equal(requireOrigin({headers:{origin:"https://evil.example",host:"tamkeen-mauve.vercel.app"}}),false);
  assert.equal(requireOrigin({headers:{host:"tamkeen-mauve.vercel.app"}}),false);
});
test("content keys and text are validated",()=>{
  assert.equal(safeKey("hero.title"),"hero.title");
  assert.throws(()=>safeKey("something<script>"));
  assert.throws(()=>safeText("x".repeat(5001)));
});
test("not configured without owner email and DB",()=>{
  const old=process.env.ADMIN_OWNER_EMAIL;
  delete process.env.ADMIN_OWNER_EMAIL;
  assert.equal(ready(),false);
  if(old!==undefined)process.env.ADMIN_OWNER_EMAIL=old;
});

test("device labels for independent browsers",()=>{
  assert.equal(deviceLabel("Mozilla/5.0 (Linux; Android 13) AppleWebKit Chrome/120.0"),"Android — Chrome");
  assert.equal(deviceLabel("Mozilla/5.0 (Windows NT 10.0; Win64; x64) Edg/140"),"Windows — Edge");
  assert.equal(deviceLabel("Mozilla/5.0 (iPhone; CPU iPhone OS 18) Safari/605"),"iPhone / iPad — Safari");
});
test("permanent admin route is configured and bootstrap no longer advertised",async()=>{
  const fs=await import("node:fs");
  const config=JSON.parse(fs.readFileSync(new URL("../vercel.json",import.meta.url),"utf8"));
  assert.ok(config.rewrites.some(r=>r.source==="/admin"&&r.destination==="/admin.html"));
  const code=fs.readFileSync(new URL("../api/admin.mjs",import.meta.url),"utf8");
  assert.equal(code.includes('action==="bootstrap"'),false);
  const ui=fs.readFileSync(new URL("../tamkeen-admin-login.js",import.meta.url),"utf8");
  assert.ok(ui.includes('location.assign("/?tamkeenEditor=1#hero")'));
});

test("visitor page does not eagerly load admin toolbar",async()=>{
 const fs=await import("node:fs");
 const html=fs.readFileSync(new URL("../index.html",import.meta.url),"utf8");
 assert.equal(html.includes('<script src="/tamkeen-admin-inline.js" defer>'),false);
 assert.ok(html.includes('get("tamkeenEditor")==="1"'));
});
test("public content reader does not install a full-page observer when no edits exist",async()=>{
 const fs=await import("node:fs");
 const vm=await import("node:vm");
 const code=fs.readFileSync(new URL("../tamkeen-content.js",import.meta.url),"utf8");
 let observes=0,raf=0;
 const sandbox={
  Map,URLSearchParams,clearTimeout,setTimeout,
  document:{body:{},querySelector:()=>null,querySelectorAll:()=>[]},
  MutationObserver:class{observe(){observes++;}disconnect(){}},
  requestAnimationFrame:()=>{raf++;},
  fetch:async()=>({ok:true,json:async()=>({ok:true,items:{}})}),
  window:{}
 };
 vm.runInNewContext(code,sandbox);
 await new Promise(resolve=>setTimeout(resolve,20));
 assert.equal(observes,0);
 assert.equal(raf,0);
 assert.ok(sandbox.window.TamkeenContent);
});
test("public content reader observes only when published edits exist",async()=>{
 const fs=await import("node:fs");
 const vm=await import("node:vm");
 const code=fs.readFileSync(new URL("../tamkeen-content.js",import.meta.url),"utf8");
 let observes=0;
 const sandbox={
  Map,clearTimeout,setTimeout,
  document:{body:{},querySelector:()=>null,querySelectorAll:()=>[]},
  MutationObserver:class{observe(){observes++;}disconnect(){}},
  requestAnimationFrame:fn=>{fn();},
  fetch:async()=>({ok:true,json:async()=>({ok:true,items:{"dom.hero.h11":"A new title"}})}),
  window:{}
 };
 vm.runInNewContext(code,sandbox);
 await new Promise(resolve=>setTimeout(resolve,20));
 assert.equal(observes,1);
});
