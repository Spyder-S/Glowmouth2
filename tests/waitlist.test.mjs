import test from 'node:test'
import assert from 'node:assert/strict'
import handler from '../api/waitlist.js'
test('signup saves before email, reports delivery, and preserves duplicate outcome',async()=>{
 const original=global.fetch
 Object.assign(process.env,{SUPABASE_URL:'https://test.supabase.co',SUPABASE_SERVICE_ROLE_KEY:'test-key',EMAILJS_SERVICE_ID:'test',EMAILJS_TEMPLATE_ID:'test',EMAILJS_PUBLIC_KEY:'test',EMAILJS_PRIVATE_KEY:'test'})
 let calls=[], duplicate=false,emailFail=false
 global.fetch=async(input)=>{
  const url=String(input instanceof Request?input.url:input);calls.push(url)
  if(url.includes('supabase.co'))return duplicate?new Response(JSON.stringify({code:'23505',message:'duplicate'}),{status:409,headers:{'Content-Type':'application/json'}}):new Response(null,{status:201})
  return new Response(emailFail?'unavailable':'OK',{status:emailFail?503:200})
 }
 async function signup(){let result;const res={setHeader(){},status(n){this.code=n;return this},json(body){result={code:this.code,...body}}};await handler({method:'POST',headers:{},socket:{remoteAddress:Math.random().toString()},body:{email:'test@example.com',first_name:'Test',source:'website'}},res);return result}
 try{
  assert.deepEqual(await signup(),{code:200,status:'created',email_sent:true})
  assert.ok(calls[0].includes('supabase.co'));assert.ok(calls[1].includes('emailjs.com'))
  calls=[];duplicate=true;assert.deepEqual(await signup(),{code:409,status:'duplicate'});assert.equal(calls.length,1)
  duplicate=false;emailFail=true;assert.deepEqual(await signup(),{code:200,status:'created',email_sent:false})
 }finally{global.fetch=original}
})
