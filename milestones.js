(()=>{
"use strict";

const TARGET=28;
const MILESTONES={
  7:{icon:"🎯",title:"QUARTER COMPLETE!",subtitle:"7 / 28 INSPECTIONS",color:"#2196f3"},
  14:{icon:"🔥",title:"HALFWAY THERE!",subtitle:"14 / 28 INSPECTIONS",color:"#ff9800"},
  21:{icon:"⚡",title:"FINAL STRETCH!",subtitle:"21 / 28 INSPECTIONS",color:"#8b5cf6"},
  28:{icon:"🏆",title:"DAILY TARGET COMPLETE!",subtitle:"28 / 28 INSPECTIONS",color:"#22c55e"}
};

let lastTotal=0;
let terminalBody;
let originalHTML="";
let styleInjected=false;

function injectStyles(){
 if(styleInjected)return;
 styleInjected=true;
 const style=document.createElement("style");
 style.textContent=`
  .progressbar{position:relative;overflow:hidden;}
  .fill{position:relative;transition:width .6s cubic-bezier(.22,1,.36,1),background-color .55s ease!important;overflow:hidden;}
  .fill::after{content:"";position:absolute;top:0;left:-45%;width:35%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.7),transparent);animation:eodShine 2.4s linear infinite;}
  .fill.milestone-pulse{animation:eodPulse .75s ease 2;}
  @keyframes eodShine{to{left:115%;}}
  @keyframes eodPulse{50%{transform:scaleY(1.55);filter:brightness(1.2);}}
  .eod-milestone{min-height:168px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;border-radius:10px;color:#fff;animation:eodMilestoneIn .35s ease-out;box-shadow:inset 0 0 0 2px rgba(255,255,255,.2);}
  .eod-milestone-icon{font-size:3.6rem;line-height:1;margin-bottom:8px;animation:eodIconBounce .8s ease-in-out infinite alternate;}
  .eod-milestone-title{font-size:1.45rem;font-weight:900;letter-spacing:.7px;}
  .eod-milestone-subtitle{margin-top:6px;font-size:.9rem;font-weight:800;letter-spacing:.8px;opacity:.95;}
  @keyframes eodMilestoneIn{from{opacity:0;transform:scale(.88)}to{opacity:1;transform:scale(1)}}
  @keyframes eodIconBounce{from{transform:translateY(0) scale(1)}to{transform:translateY(-7px) scale(1.08)}}
 `;
 document.head.appendChild(style);
}

function getColor(n){
 if(n>=28)return MILESTONES[28].color;
 if(n>=21)return MILESTONES[21].color;
 if(n>=14)return MILESTONES[14].color;
 if(n>=7)return MILESTONES[7].color;
 return "#ffc107";
}

function update(n){
 injectStyles();
 const fill=document.getElementById("fill");
 if(fill){
  fill.style.backgroundColor=getColor(n);
  fill.classList.remove("milestone-pulse");
  void fill.offsetWidth;
  if(MILESTONES[n])fill.classList.add("milestone-pulse");
 }

 if(MILESTONES[n]&&n!==lastTotal)show(MILESTONES[n]);
 lastTotal=n;
}

function show(m){
 const terminalCard=document.getElementById("terminal")?.closest(".card");
 if(!terminalCard)return;
 terminalBody=terminalCard.querySelector(".card-body");
 if(!terminalBody)return;
 originalHTML=terminalBody.innerHTML;
 terminalBody.innerHTML=`<div class="eod-milestone" style="background:linear-gradient(135deg,${m.color},#001845)"><div class="eod-milestone-icon">${m.icon}</div><div class="eod-milestone-title">${m.title}</div><div class="eod-milestone-subtitle">${m.subtitle}</div></div>`;
 setTimeout(()=>{
  if(terminalBody){
   terminalBody.innerHTML=originalHTML;
   restoreTerminalState();
  }
 },2800);
}

function restoreTerminalState(){
 const terminal=document.getElementById("terminal");
 if(!terminal)return;
 const saved=localStorage.getItem("eodInspectionReport_v9");
 if(saved){
  try{const parsed=JSON.parse(saved);terminal.value=parsed.terminal||"HARRISBURG";}catch(e){}
 }
 const date=document.getElementById("reportDate");
 if(date){const d=new Date();date.textContent=(d.getMonth()+1)+"/"+d.getDate()+"/"+String(d.getFullYear()).slice(-2);}
 const count=document.getElementById("count");
 const current=Number(count?.textContent||0);
 if(count)count.textContent=current;
 const fill=document.getElementById("fill");
 if(fill){fill.style.width=Math.min(100,current/TARGET*100)+"%";fill.style.backgroundColor=getColor(current);}
 const complete=document.getElementById("completeMessage");
 if(complete)complete.classList.toggle("show",current>=TARGET);
}

window.EODMilestones={update,getColor,setLastTotal:n=>{lastTotal=n;}};
})();