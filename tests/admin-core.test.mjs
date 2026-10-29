import test from "node:test";
import assert from "node:assert/strict";
import {otpValid,base32,unbase32,passwordHash,randomSalt,safe,encrypt,decrypt,safeKey,safeText,requireOrigin,ready} from "../lib/tamkeen-admin-core.mjs";

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
