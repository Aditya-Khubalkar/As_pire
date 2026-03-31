/* ═══════════════════════════════════════════════════════
   AS-pire · shared.js
   Firebase config + shared state helpers used by all pages
   ═══════════════════════════════════════════════════════ */

// ── FIREBASE CONFIG ──
window.FB_CONFIG = {
  apiKey:"AIzaSyDErNk02qqYnbVFskumgNGch47gJJCzMTA",
  authDomain:"aspire-2924d.firebaseapp.com",
  databaseURL:"https://aspire-2924d-default-rtdb.firebaseio.com",
  projectId:"aspire-2924d",
  storageBucket:"aspire-2924d.firebasestorage.app",
  messagingSenderId:"260852889050",
  appId:"1:260852889050:web:136fe46f8fd42db64b3ce3"
};

// ── DEFAULT STATE ──
window.defaultState = function(){
  return {
    names:{you:'A',friend:'S'},
    quote:'✦ Aspire to be unstoppable',
    nudge:{to:null,ts:0},
    reactions:{type:null,ts:0},
    streak:0,lastActive:'',
    fixedTasks:[],  // [{text:'...', for:'you'|'friend'}]
    calendar:{},    // { 'YYYY-MM-DD': { you:{taskId:{...}}, friend:{taskId:{...}} } }
    you:{daily:{},weekly:{},weeklyReset:null,lastDailyReset:''},
    friend:{daily:{},weekly:{},weeklyReset:null,lastDailyReset:''}
  };
};

// ── DATE HELPERS ──
window.todayStr = function(){
  return new Date().toISOString().slice(0,10); // "2025-02-28"
};
window.nextMidnight = function(){
  const d=new Date(); d.setHours(24,0,0,0); return d.getTime();
};

// ── DEEP SET / DELETE ──
window.setDeep = function(obj,path,val){
  const k=path.split('/'); let o=obj;
  for(let i=0;i<k.length-1;i++){if(!o[k[i]])o[k[i]]={};o=o[k[i]];}
  o[k[k.length-1]]=val;
};
window.delDeep = function(obj,path){
  const k=path.split('/'); let o=obj;
  for(let i=0;i<k.length-1;i++){o=o[k[i]]||{};}
  delete o[k[k.length-1]];
};

// ── FORMAT TIME ──
window.fmtMs = function(ms){
  if(ms<=0) return '0s';
  const s=Math.floor(ms/1000),h=Math.floor(s/3600),m=Math.floor((s%3600)/60),sec=s%60;
  if(h>0) return h+'h '+m+'m';
  if(m>0) return m+'m '+sec+'s';
  return sec+'s';
};

// ── ESC HTML ──
window.esc = function(s){ return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); };

// ── CONFETTI ──
window.shootConfetti = function(){
  const cols=['#d4a853','#f5d07a','#a48de0','#72c9a0','#e06b6b','#ffe9a0','#fff','#c4b5f4'];
  for(let i=0;i<65;i++) setTimeout(()=>{
    const el=document.createElement('div'); el.className='cf';
    const w=5+Math.random()*10, h=w*(0.3+Math.random()*1.5);
    el.style.cssText='left:'+(3+Math.random()*94)+'vw;top:'+(Math.random()*20)+'vh;width:'+w+'px;height:'+h+'px;background:'+cols[Math.floor(Math.random()*cols.length)]+';border-radius:'+(Math.random()>0.4?'50%':'2px')+';animation-duration:'+(1.1+Math.random()*1.6)+'s;transform:rotate('+(Math.random()*360)+'deg);';
    document.body.appendChild(el); setTimeout(()=>el.remove(),3500);
  },i*28);
};

// ── STAR CANVAS ──
window.initStars = function(){
  const c=document.getElementById('starCanvas');
  if(!c) return;
  const ctx=c.getContext('2d'); let W,H,stars=[];
  function resize(){W=c.width=innerWidth;H=c.height=innerHeight;stars=[];for(let i=0;i<140;i++)stars.push({x:Math.random()*W,y:Math.random()*H,r:Math.random()*1.3+0.2,baseO:Math.random()*0.55+0.1,speed:Math.random()*0.25+0.04,phase:Math.random()*Math.PI*2,freq:Math.random()*0.02+0.005});}
  let t=0;
  function draw(){ctx.clearRect(0,0,W,H);t+=0.016;stars.forEach(s=>{const o=s.baseO*(0.5+0.5*Math.sin(t*s.freq*60+s.phase));ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);ctx.fillStyle='rgba(240,215,150,'+o+')';ctx.fill();s.y-=s.speed*0.25;if(s.y<-2)s.y=H+2;});requestAnimationFrame(draw);}
  window.addEventListener('resize',resize);resize();draw();
};

// ── CURSOR SPARKS ──
window.initCursorSparks = function(){
  let last=0;
  document.addEventListener('mousemove',function(e){
    if(Date.now()-last<50)return;last=Date.now();
    const el=document.createElement('div');el.className='cursor-spark';
    el.style.left=e.clientX+'px';el.style.top=e.clientY+'px';
    el.style.width=el.style.height=(3+Math.random()*5)+'px';
    el.style.background=['#d4a853','#f5d07a','#a48de0','#72c9a0'][Math.floor(Math.random()*4)];
    el.style.animationDuration=(0.4+Math.random()*0.4)+'s';
    document.body.appendChild(el);setTimeout(()=>el.remove(),800);
  });
};

// ── FLOATING PARTICLES ──
window.initParticles = function(){
  const cols=['rgba(212,168,83,','rgba(164,141,224,','rgba(114,201,160,'];
  setInterval(()=>{
    const el=document.createElement('div');el.className='fp';const sz=1.5+Math.random()*4;
    el.style.cssText='width:'+sz+'px;height:'+sz+'px;left:'+(Math.random()*100)+'vw;bottom:-10px;background:'+cols[Math.floor(Math.random()*3)]+(0.15+Math.random()*0.4)+');animation-duration:'+(7+Math.random()*10)+'s;animation-delay:'+(Math.random()*2)+'s;';
    document.body.appendChild(el);setTimeout(()=>el.remove(),22000);
  },900);
};

// ── RIPPLE ──
window.addRipple = function(btn,e){
  const r=document.createElement('span'),rect=btn.getBoundingClientRect(),sz=Math.max(rect.width,rect.height)*2.5;
  r.className='ripple';r.style.cssText='width:'+sz+'px;height:'+sz+'px;left:'+(e.clientX-rect.left-sz/2)+'px;top:'+(e.clientY-rect.top-sz/2)+'px;';
  btn.appendChild(r);setTimeout(()=>r.remove(),700);
};
