import { useEffect, useState } from 'react'
import './waitlist.css'
export function WaitlistPage(){
 const [available,setAvailable]=useState<boolean|null>(null)
 const [busy,setBusy]=useState(false)
 const [message,setMessage]=useState('')
 const [joined,setJoined]=useState(false)
 useEffect(()=>{
  const controller=new AbortController()
  fetch('/api/waitlist',{signal:controller.signal}).then(r=>r.json()).then(data=>setAvailable(data.ok===true)).catch(()=>{if(!controller.signal.aborted)setAvailable(false)})
  return()=>controller.abort()
 },[])
 async function submit(event:React.FormEvent<HTMLFormElement>){
  event.preventDefault();if(busy)return
  const form=event.currentTarget, data=new FormData(form)
  setBusy(true);setMessage('')
  try{
   const response=await fetch('/api/waitlist',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:data.get('email'),first_name:data.get('first_name'),source:'website',consent:data.get('consent')==='yes'}),signal:AbortSignal.timeout(20000)})
   const result=await response.json()
   if(response.status===409&&result.status==='duplicate'){setJoined(true);setMessage('You’re already on the list. We’ll share updates as GlowMouth develops.');return}
   if(!response.ok||result.status!=='created')throw new Error(result.code==='not_configured'?'Registration is not connected yet. Your information has not been saved.':result.error||'We couldn’t save your signup. Please try again.')
   setJoined(true);setMessage(result.email_sent?'You’re on the list. A confirmation email is on its way.':'You’re on the list. Your signup is saved, but we couldn’t send the confirmation email right now.')
   form.reset()
  }catch(e){setMessage(e instanceof Error&&e.name==='TimeoutError'?'The request timed out. Please retry; if your signup was saved, we’ll recognize it.':e instanceof Error?e.message:'Unable to connect. Please try again.')}
  finally{setBusy(false)}
 }
 return <main id="main" className="waitlist-page"><section className="waitlist-intro"><p className="page-kicker">Stay close to the work</p><h1>A closer look.<br/><em>As it takes shape.</em></h1><p>Join the GlowMouth waitlist for project updates and news about future early access.</p><div className="waitlist-details"><span>What you’ll hear about</span><p>Development milestones, team news, and early-access announcements when there’s something to share.</p><small>GlowMouth is in development. Joining does not reserve a device or guarantee access on a particular date.</small></div></section><section className="waitlist-form-area" aria-label="Join the GlowMouth waitlist"><h2>{joined?'You’re part of the story.':'Keep me in the loop.'}</h2>{joined?<div className="waitlist-success" role="status"><p>{message}</p><a className="cta" href="/technology">Explore the technology ↗</a></div>:<><p className="waitlist-summary">A name, an email, and a little curiosity.</p><form onSubmit={submit}><label htmlFor="waitlist-name">First name <span>Optional</span></label><input id="waitlist-name" name="first_name" autoComplete="given-name" maxLength={80}/><label htmlFor="waitlist-email">Email address</label><input id="waitlist-email" name="email" type="email" autoComplete="email" required maxLength={254} placeholder="you@example.com"/><label className="waitlist-consent"><input name="consent" type="checkbox" value="yes" required/><span>I’d like to receive GlowMouth project updates and early-access news by email.</span></label><p className="waitlist-privacy">We use your name and email to manage the waitlist and send updates. Signups are stored with Supabase; confirmation emails are sent through EmailJS. Don’t include health information. To stop updates, reply to an email asking to be removed.</p><button className="cta" disabled={busy||available!==true}>{busy?'Saving your signup…':available===null?'Checking registration…':available?'Join the waitlist ↗':'Registration not connected yet'}</button>{available===false&&<p className="waitlist-status" role="status">We’re finishing the signup connection. Please check back soon; this form is not collecting information yet.</p>}{message&&<p className="waitlist-status" role="alert">{message}</p>}</form></>}</section></main>
}
