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
let styleInjected=false;
let showing=false;

function injectStyles(){
 if(styleInjected)return;
 styleInjected=true;
 const style=document.createElement("style");
 style.textContent=`
  .progressbar{position:relative;overflow:hidden;}
  .fill{position:relative;transition:width .6s cubic-bezier(.22,1,.36,1),background-color .55s ease!important;overflow:hidden;}
  .fill::after{content:"";position:absolute;top:0;left:-45%;width:35%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.7),transparent);animation:eodShine 2.4s linear infinite;}
  .fill.milestone-pulse{animation:eodPulse .75s ease 2;}
  .eod-milestone-toast{position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);z-index:9999;width:min(360px,calc(100vw - 32px));padding:24px 18px;text-align:center;border-radius:12px;color:#fff;box-shadow:0 18px 50px rgba(0,0,0,.35);animation:eodMilestoneIn .35s ease-out;}
  .eod-milestone-icon{font-size:3.6rem;line-height:1;margin-bottom:8px;animation:eodIconBounce .8s ease-in-out infinite alternate;}
  .eod-milestone-title{font-size:1.35rem;font-weight:900;letter-spacing:.7px;}
  .eod-milestone-subtitle{margin-top:6px;font-size:.9rem;font-weight:800;letter-spacing:.8px;opacity:.95;}
  @keyframes eodShine{to{left:115%;}}
  @keyframes eodPulse{50%{transform:scaleY(1.55);filter:brightness(1.2);}}
  @keyframes eodMilestoneIn{from{opacity:0;transform:translate(-50%,-50%) scale(.88)}to{opacity:1;transform:translate(-50%,-50%) scale(1)}}
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

function show(m){
 if(showing)return;
 showing=true;
 const toast=document.createElement("div");
 toast.className="eod-milestone-toast";
 toast.style.background=`linear-gradient(135deg,${m.color},#001845)`;
 toast.innerHTML=`<div class="eod-milestone-icon">${m.icon}</div><div class="eod-milestone-title">${m.title}</div><div class="eod-milestone-subtitle">${m.subtitle}</div>`;
 document.body.appendChild(toast);
 setTimeout(()=>{
  toast.remove();
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
 if(MILESTONES[total]&&total!==lastTotal)show(MILESTONES[total]);
 lastTotal=total;
}

window.EODMilestones={update,getColor,setLastTotal:n=>{lastTotal=Number(n)||0;}};
})();