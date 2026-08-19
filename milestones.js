(()=>{
"use strict";

const MILESTONES={
  7:{icon:"🎯",title:"QUARTER COMPLETE!",subtitle:"7 / 28 INSPECTIONS",color:"#2196f3"},
  14:{icon:"🔥",title:"HALFWAY THERE!",subtitle:"14 / 28 INSPECTIONS",color:"#ff9800"},
  21:{icon:"⚡",title:"FINAL STRETCH!",subtitle:"21 / 28 INSPECTIONS",color:"#8b5cf6"},
  28:{icon:"🏆",title:"DAILY TARGET COMPLETE!",subtitle:"28 / 28 INSPECTIONS",color:"#22c55e"}
};

let lastTotal=0;
let showing=false;
let styleInjected=false;
let savedTerminalNodes=null;

function injectStyles(){
 if(styleInjected)return;
 styleInjected=true;
 const style=document.createElement("style");
 style.textContent=`
  .fill{transition:width .6s cubic-bezier(.22,1,.36,1),background-color .55s ease!important;}
  .fill.milestone-pulse{animation:eodPulse .75s ease 2;}
  .eod-milestone{min-height:168px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;border-radius:10px;color:#fff;animation:eodMilestoneIn .35s ease-out;box-shadow:inset 0 0 0 2px rgba(255,255,255,.2);}
  .eod-milestone-icon{font-size:3.6rem;line-height:1;margin-bottom:8px;animation:eodIconBounce .8s ease-in-out infinite alternate;}
  .eod-milestone-title{font-size:1.45rem;font-weight:900;letter-spacing:.7px;}
  .eod-milestone-subtitle{margin-top:6px;font-size:.9rem;font-weight:800;letter-spacing:.8px;opacity:.95;}
  @keyframes eodPulse{50%{transform:scaleY(1.55);filter:brightness(1.2);}}
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

function showInTerminal(m){
 if(showing)return;
 const terminalCard=document.getElementById("terminal")?.closest(".card");
 const body=terminalCard?.querySelector(".card-body");
 if(!body)return;
 showing=true;
 savedTerminalNodes=Array.from(body.childNodes);
 const panel=document.createElement("div");
 panel.className="eod-milestone";
 panel.style.background=`linear-gradient(135deg,${m.color},#001845)`;
 panel.innerHTML=`<div class="eod-milestone-icon">${m.icon}</div><div class="eod-milestone-title">${m.title}</div><div class="eod-milestone-subtitle">${m.subtitle}</div>`;
 body.replaceChildren(panel);
 setTimeout(()=>{
  if(body&&savedTerminalNodes)body.replaceChildren(...savedTerminalNodes);
  savedTerminalNodes=null;
  showing=false;
 },2800);
}

function update(n){
 injectStyles();
 const total=Number(n)||0;
 const fill=document.getElementById("fill");
 if(fill){
  fill.style.backgroundColor=getColor(total);
  fill.classList.remove("milestone-pulse");
  void fill.offsetWidth;
  if(MILESTONES[total])fill.classList.add("milestone-pulse");
 }
 if(MILESTONES[total]&&total!==lastTotal)showInTerminal(MILESTONES[total]);
 lastTotal=total;
}

function resetChassisAfterSuccessfulAdd(){
 const button=document.getElementById("addInspection");
 if(!button)return;
 button.addEventListener("click",()=>{
  const before=Number.parseInt(document.getElementById("count")?.textContent,10)||0;
  setTimeout(()=>{
   const after=Number.parseInt(document.getElementById("count")?.textContent,10)||0;
   if(after<=before)return;
   const prefix=document.getElementById("prefix");
   const type=document.getElementById("type");
   const condition=document.getElementById("condition");
   const number=document.getElementById("number");
   const note=document.getElementById("equipmentNote");
   if(prefix)prefix.value="NSPZ";
   if(type)type.value="5652";
   if(condition)condition.value="Defect";
   if(number)number.value="";
   if(note)note.value="";
  },0);
 });
}

function watchCount(){
 const count=document.getElementById("count");
 if(!count){requestAnimationFrame(watchCount);return;}
 lastTotal=Number.parseInt(count.textContent,10)||0;
 update(lastTotal);
 new MutationObserver(()=>{
  update(Number.parseInt(count.textContent,10)||0);
 }).observe(count,{childList:true,characterData:true,subtree:true});
 resetChassisAfterSuccessfulAdd();
}

if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",watchCount,{once:true});
else watchCount();

window.EODMilestones={update,getColor,setLastTotal:n=>{lastTotal=Number(n)||0;}};
})();