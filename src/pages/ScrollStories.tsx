import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SampleImage } from '../components/SampleImage'
import './scroll-stories.css'
gsap.registerPlugin(ScrollTrigger)
const tech = [
  ['Capture', 'Start with the same view.', 'The envisioned device brings lighting and imaging together. A repeatable angle is the starting point for a useful image history.'],
  ['Compare', 'Put change in context.', 'Images taken over time would be brought together for AI-supported comparison. This animation illustrates that workflow; it does not analyze an image.'],
  ['Follow', 'Bring the history with you.', 'The companion-app concept organizes earlier and later images, giving you a visual reference for a conversation with your dental professional.'],
]
const problem = [
  ['Worldwide', '3.7 billion', 'People affected by oral diseases worldwide, according to WHO’s March 2025 fact sheet. This spans many conditions and is not a measure of what GlowMouth can detect.'],
  ['Gum disease', '1 billion+', 'Estimated cases of severe periodontal disease worldwide. Gum disease affects the tissues that surround and support the teeth.'],
  ['Tooth loss', '23%', 'Estimated global prevalence of complete tooth loss among adults aged 60 or older. These figures describe different populations and should not be added together.'],
]
export function ScrollStory({kind,motion}:{kind:'technology'|'problem';motion:boolean}) {
 const root=useRef<HTMLElement>(null)
 const [active,setActive]=useState(0)
 const [enhanced,setEnhanced]=useState(false)
 const chapters=kind==='technology'?tech:problem
 useEffect(()=>{
  if(!motion){setEnhanced(false);return}
  const mm=gsap.matchMedia()
  mm.add('(min-width: 801px) and (min-height: 650px)',()=>{
   setEnhanced(true)
   const ctx=gsap.context(()=>{
    ScrollTrigger.create({trigger:root.current,start:'top 94px',end:'bottom bottom',invalidateOnRefresh:true,onUpdate:self=>{
     setActive(Math.min(2,Math.floor(self.progress*3)))
     root.current?.style.setProperty('--story-progress',String(self.progress))
     root.current?.style.setProperty('--turn',`${self.progress*65-25}deg`)
     root.current?.style.setProperty('--scan',`${(self.progress*3%1)*100}%`)
    }})
   },root)
   return()=>{ctx.revert();setEnhanced(false)}
  })
  return()=>mm.revert()
 },[motion])
 useEffect(()=>{ScrollTrigger.refresh()},[enhanced])
 function jump(i:number){
  if(!root.current)return
  if(enhanced){const r=root.current.getBoundingClientRect();const distance=r.height-(innerHeight-94);window.scrollTo({top:scrollY+r.top-94+distance*((i+.15)/3),behavior:motion?'smooth':'auto'})}
  else document.getElementById(`${kind}-chapter-${i}`)?.scrollIntoView({behavior:motion?'smooth':'auto'})
 }
 function visual(i:number){return kind==='technology'?<div className={`implementation-visual phase-${i}`} aria-hidden="true">
  <div className="optical-device"><div className="device-handle"/><div className="device-head"><i/><b/><span/></div><span className="device-label">Imaging concept</span></div>
  <div className="image-transfer"><i/><i/><i/><span>IMAGE → CONTEXT</span></div>
  <div className="history-device"><div className="app-top">GlowMouth <span>Visual history</span></div><div className="history-image"><SampleImage/><i className="story-scan"/></div><div className="second-image"><SampleImage variant="fluorescence"/></div><div className="history-records"><span>Earlier view <b>01</b></span><span>Next view <b>02</b></span><span>A reference for your visit <b>↗</b></span></div></div>
  <p className="scene-note">Concept workflow · Synthetic imagery · Not final hardware</p>
 </div>:<div className={`burden-visual phase-${i}`} aria-hidden="true"><div className="world-sphere"><div className="sphere-latitude"/><div className="sphere-longitude"/>{Array.from({length:100},(_,n)=><i key={n} className={n<23?'marked':''}/>)}</div><div className="burden-number">{chapters[i][1]}</div><span>{i===0?'A global burden':i===1?'Severe periodontal disease':'Complete tooth loss · Age 60+'}</span></div>}
 return <section id={`${kind}-scroll-story`} ref={root} className={`scroll-story ${kind}-story ${enhanced?'is-enhanced':''}`} aria-label={kind==='technology'?'How the product concept would work':'Oral health in perspective'}>
  <div className="story-sticky"><div className="story-heading"><p>{kind==='technology'?'From device to daily context':'The scale of the problem'}</p><span>{enhanced?'Scroll to move through the story ↓':'Explore the story ↓'}</span></div>
   {enhanced?<><div className="story-composition">{visual(active)}<div className="story-caption">{kind==='problem'&&<strong className="sr-only">{chapters[active][1]}</strong>}<span>0{active+1} / {chapters[active][0]}</span><h2>{kind==='technology'?chapters[active][1]:active===0?'Oral health touches billions.':active===1?'It goes beyond cavities.':'The impact lasts.'}</h2><p>{chapters[active][2]}</p>{kind==='problem'&&<a href="https://www.who.int/news-room/fact-sheets/detail/oral-health" target="_blank" rel="noreferrer">WHO · March 2025 ↗</a>}</div></div><nav className="story-stops" aria-label={`${kind} story chapters`}>{chapters.map(([label],i)=><button key={label} onClick={()=>jump(i)} aria-current={active===i?'step':undefined}><i/><span>0{i+1} {label}</span></button>)}<div className="story-track"><i/></div></nav></>:<div className="story-static">{chapters.map(([label,title,copy],i)=><article id={`${kind}-chapter-${i}`} key={label}>{visual(i)}<div><span>0{i+1} / {label}</span><h2>{title}</h2><p>{copy}</p></div></article>)}{kind==='problem'&&<a href="https://www.who.int/news-room/fact-sheets/detail/oral-health" target="_blank" rel="noreferrer">Source: WHO oral health fact sheet · March 2025 ↗</a>}</div>}
  </div>
 </section>
}
const aboutStops=[['team','The team'],['purpose','Our purpose'],['recognition','Recognition'],['blue-ocean','Blue Ocean'],['deca-slc','DECA SLC'],['deca-icdc','DECA ICDC'],['vcu','VCU funding'],['podcast','Coming next']]
export function AboutProgress(){
 const root=useRef<HTMLElement>(null)
 const [active,setActive]=useState(0)
 useEffect(()=>{
  const ctx=gsap.context(()=>{
   ScrollTrigger.create({trigger:'.founder-gallery',start:()=>`top ${innerWidth>800?215:175}px`,endTrigger:'.podcast-announcement',end:()=>`top ${innerWidth>800?215:175}px`,onUpdate:self=>root.current?.style.setProperty('--about-progress',String(self.progress))})
   aboutStops.forEach(([id],i)=>ScrollTrigger.create({trigger:`#${id}`,start:()=>`top ${innerWidth>800?215:175}px`,onEnter:()=>setActive(i),onLeaveBack:()=>setActive(Math.max(0,i-1))}))
  })
  document.fonts.ready.then(()=>ScrollTrigger.refresh())
  return()=>ctx.revert()
 },[])
 return <nav ref={root} className="about-progress" aria-label="About page progress"><span className="about-progress-title">Our story <b>{aboutStops[active][1]}</b></span><div className="about-progress-stops"><div className="about-progress-line"><i/></div>{aboutStops.map(([id,label],i)=><a href={`#${id}`} key={id} aria-label={label} aria-current={active===i?'step':undefined} className={i<=active?'reached':''}><i/><span>{label}</span></a>)}</div></nav>
}
