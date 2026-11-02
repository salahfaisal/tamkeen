import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import pg from "pg";

test("isolated PostgreSQL: draft, publish, audit, version conflict and restore",async t=>{
 const url=process.env.TAMKEEN_TEST_DATABASE_URL;
 if(!url){t.skip("Runs only on CI dedicated test database");return;}
 const endpoint=new URL(url);
 assert.equal(endpoint.hostname,"127.0.0.1");
 assert.equal(endpoint.pathname,"/tamkeen_test");
 const client=new pg.Client({connectionString:url});
 await client.connect();
 try {
  const schema=await readFile(new URL("../db/tamkeen_admin_migration.sql",import.meta.url),"utf8");
  await client.query(schema);
  const key="qa.integration.content";
  let r=await client.query("INSERT INTO tamkeen_content_items(content_key,draft_text) VALUES($1,$2) RETURNING *",[key,"private A"]);
  assert.equal(r.rows[0].published_text,null);
  r=await client.query("SELECT COUNT(*)::int AS n FROM tamkeen_content_items WHERE content_key=$1 AND published_text IS NOT NULL",[key]);
  assert.equal(r.rows[0].n,0);
  r=await client.query("UPDATE tamkeen_content_items SET published_text=$2,draft_text=NULL,version=version+1 WHERE content_key=$1 AND version=0 RETURNING *",[key,"public A"]);
  assert.equal(r.rows[0].version,1);
  r=await client.query("UPDATE tamkeen_content_items SET draft_text=$2 WHERE content_key=$1 AND version=1 RETURNING *",[key,"private B"]);
  assert.equal(r.rows[0].published_text,"public A");
  r=await client.query("SELECT action,new_text FROM tamkeen_content_history WHERE content_key=$1 ORDER BY id DESC LIMIT 1",[key]);
  assert.equal(r.rows[0].action,"draft");
  assert.equal(r.rows[0].new_text,"private B");
  r=await client.query("UPDATE tamkeen_content_items SET published_text=$2,draft_text=NULL,version=version+1 WHERE content_key=$1 AND version=1 RETURNING *",[key,"public B"]);
  assert.equal(r.rows[0].version,2);
  r=await client.query("UPDATE tamkeen_content_items SET published_text=$2,version=version+1 WHERE content_key=$1 AND version=1 RETURNING *",[key,"stale"]);
  assert.equal(r.rowCount,0);
  r=await client.query("SELECT id,new_text FROM tamkeen_content_history WHERE content_key=$1 AND action='publish' AND new_text='public A' ORDER BY id LIMIT 1",[key]);
  assert.equal(r.rows.length,1);
  const previous=r.rows[0].new_text;
  r=await client.query("UPDATE tamkeen_content_items SET published_text=$2,version=version+1 WHERE content_key=$1 AND version=2 RETURNING *",[key,previous]);
  assert.equal(r.rows[0].version,3);
  assert.equal(r.rows[0].published_text,"public A");
 } finally {await client.end();}
});
