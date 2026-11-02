
import {query,respond,ready} from "../lib/tamkeen-admin-core.mjs";
export default async function handler(req,res) {
  if(req.method!=="GET")return respond(res,405,{ok:false});
  if(!ready())return respond(res,503,{ok:false,error:"Content service not configured"});
  try {
    const r=await query("SELECT content_key,published_text FROM tamkeen_content_items WHERE published_text IS NOT NULL ORDER BY content_key LIMIT 3000");
    const items=Object.fromEntries(r.rows.map(x=>[x.content_key,x.published_text]));
    return respond(res,200,{ok:true,items});
  }catch(err){console.error("content read failed",err.message);return respond(res,503,{ok:false,error:"Content temporarily unavailable"});}
}
