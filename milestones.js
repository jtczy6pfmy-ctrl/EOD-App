(()=>{
"use strict";

const MILESTONES={
 7:{icon:"🎯",title:"25% COMPLETE!",subtitle:"7 / 28 INSPECTIONS",color:"#2196f3"},
 14:{icon:"🔥",title:"50% COMPLETE!",subtitle:"14 / 28 INSPECTIONS",color:"#8b5cf6"},
 21:{icon:"⚡",title:"75% COMPLETE!",subtitle:"21 / 28 INSPECTIONS",color:"#f97316"},
 28:{icon:"🏆",title:"DAILY TARGET COMPLETE!",subtitle:"28 / 28 INSPECTIONS",color:"#22c55e"}
};

let lastTotal=null;
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

function highestReached(total){
 return [...Object.keys(MILESTONES).map(Number)]
  .filter(mark=>total>=mark)
  .pop()||0;
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
  if(savedTerminalNodes)body.replaceChildren(...savedTerminalNodes);
  savedTerminalNodes=null;
  showing=false;
 },2800);
}

function update(n,initial=false){
 injectStyles();
 const total=Number(n)||0;
 const fill=document.getElementById("fill");
 if(fill){
  fill.style.backgroundColor=getColor(total);
  fill.classList.remove("milestone-pulse");
  void fill.offsetWidth;
  if(MILESTONES[total])fill.classList.add("milestone-pulse");
 }

 if(initial){
  const reached=highestReached(total);
  if(reached)showInTerminal(MILESTONES[reached]);
 }else if(MILESTONES[total]&&total!==lastTotal){
  showInTerminal(MILESTONES[total]);
 }

 lastTotal=total;
}

function watchCount(){
 const count=document.getElementById("count");
 if(!count){requestAnimationFrame(watchCount);return;}

 const initialTotal=Number.parseInt(count.textContent,10)||0;
 update(initialTotal,true);

 new MutationObserver(()=>{
  update(Number.parseInt(count.textContent,10)||0,false);
 }).observe(count,{childList:true,characterData:true,subtree:true});
}

if(document.readyState==="loading"){
 document.addEventListener("DOMContentLoaded",watchCount,{once:true});
}else{
 watchCount();
}

window.EODMilestones={update,getColor};
})();
