import test from "node:test";
import assert from "node:assert/strict";

test("Public requests cannot use private admin endpoints",async()=>{
 process.env.DATABASE_URL=process.env.TAMKEEN_TEST_DATABASE_URL||"postgresql://localhost/tamkeen_test";
 process.env.ADMIN_OWNER_EMAIL="owner@example.test";
 process.env.ADMIN_SECRET_KEY="test-only";
 const {default:handler}=await import("../api/admin.mjs");
 async function call(action,method="GET",origin="https://tamkeen.test"){
  const req={method,query:{action,key:"qa.sample"},body:{key:"qa.sample",text:"should never publish",mode:"publish",expectedVersion:0},
   headers:{origin,host:"tamkeen.test","content-type":"application/json",cookie:""}};
  let status=200,body;
  const res={setHeader(){},getHeader(){return null},status(n){status=n;return this},json(value){body=value;return value}};
  await handler(req,res);return {status,body};
 }
 assert.equal((await call("session")).body.authenticated,false);
 for(const name of ["save","restore","content","history","devices","revoke-all"]){
  const method=["save","restore","revoke-all"].includes(name)?"POST":"GET";
  assert.equal((await call(name,method)).status,401,name);
 }
 assert.equal((await call("save","POST","https://external.example")).status,403);
 assert.equal((await call("bootstrap","POST")).status,401);
});
