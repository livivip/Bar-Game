const ITEMS={
 coin:{e:"🪙",r:"Opening night, 1927. Two founders and a hunter shook hands, and I paid for the first round. I rolled away under a seat with no back.",c:"A bar token from opening night, 1927. The founders made a deal with a monster hunter: he would protect the bar, and the monsters inside it."},
 ticket:{e:"🎟️",r:"When the sirens wailed, the doors stayed open for anyone who needed them. Look in the frame where the music went quiet.",c:"A shelter pass from the war. The bar sheltered its neighbors, then reopened in 1945, a little different but still wearing its 1920s bones."},
 charm:{e:"🧿",r:"A guardian never leaves his post. I was handed from father to son, and I was left where the regulars sat.",c:"A charm passed from the first monster hunter to his son, who took over as guardian of the bar when his father died of old age."},
 teddy:{e:"🧸",r:"I was a small one's first friend, and I still keep watch beside a light that stays on.",c:"A teddy bear from around the year 2000. Your first toy. You were born the child of the monster hunter and vamp1."},
 shell:{e:"🐚",r:"I come from the sea, and no sea is near. Find me where someone fell, the only thing here that does not belong.",c:"A shell dropped by a selkie. The night one killed a human, the bar was shut down for good."},
 letter:{e:"✉️",r:"Words left for you, hidden behind a face that never speaks. Read me last.",c:"A letter to you, with the address of the bar. This page was never ripped out. It was hidden."}
};
const TOTAL=Object.keys(ITEMS).length;
const $=s=>document.querySelector(s);
let found={},placed={},sel=null,tt;
function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(tt);tt=setTimeout(()=>t.classList.remove('show'),2200)}
function invHTML(draggable){return Object.keys(found).filter(k=>!placed[k]).map(k=>`<div class="it${sel===k?' sel':''}" data-id="${k}" ${draggable?'draggable="true"':''} title="${k}">${ITEMS[k].e}</div>`).join('')||'<span style="font-size:.9rem">Nothing yet. Click glowing objects in the room.</span>'}
function render(){
 $('#invMenu').innerHTML=invHTML(false);
 $('#tray').innerHTML=invHTML(true);
 const n=Object.keys(placed).length;
 $('#prog').textContent=n+' of '+TOTAL+' pages filled';
 $('#end').hidden=n<TOTAL;
 document.querySelectorAll('.pick').forEach(p=>p.style.display=found[p.dataset.id]?'none':'');
 $('#slots').innerHTML=Object.keys(ITEMS).map(k=>`<div class="slot${placed[k]?' done':''}" data-id="${k}" tabindex="0"><div class="sil">${ITEMS[k].e}</div><div><p class="riddle">${ITEMS[k].r}</p><p class="cap">${ITEMS[k].c}</p></div></div>`).join('');
}
function tryPlace(id,slot){
 if(!id||!found[id]||placed[id])return;
 if(slot.dataset.id===id){placed[id]=1;sel=null;render();if(Object.keys(placed).length===TOTAL)toast('The scrapbook is complete.');}
 else{slot.classList.add('no');setTimeout(()=>slot.classList.remove('no'),350);toast("That doesn't fit here.")}
}
// room
document.querySelectorAll('.pick').forEach(p=>p.addEventListener('click',e=>{if($('#stage').classList.contains('zoom'))return;found[p.dataset.id]=1;render();toast('Picked up: '+ITEMS[p.dataset.id].e)}));
document.querySelectorAll('.hot').forEach(h=>h.addEventListener('click',()=>{if(!$('#stage').classList.contains('zoom'))toast(h.dataset.msg)}));
// zoom
const stage=$('#stage'),mag=$('#mag'),svg=stage.querySelector('svg');
mag.onclick=()=>{const on=mag.getAttribute('aria-pressed')!=='true';mag.setAttribute('aria-pressed',on);stage.classList.toggle('zoom',on);if(!on)svg.style.transformOrigin=''};
stage.addEventListener('mousemove',e=>{if(!stage.classList.contains('zoom'))return;const r=stage.getBoundingClientRect();svg.style.transformOrigin=((e.clientX-r.left)/r.width*100)+'% '+((e.clientY-r.top)/r.height*100)+'%'});
stage.addEventListener('click',e=>{if(stage.classList.contains('zoom')){mag.click()}},true);
// menu
$('#menuBtn').onclick=()=>{const o=$('#drop').classList.toggle('open');$('#menuBtn').setAttribute('aria-expanded',o)};
$('#themeBtn').onclick=()=>{const d=document.documentElement,dark=getComputedStyle(d).getPropertyValue('--bg').trim()==='#2b2038';d.dataset.theme=dark?'light':'dark'};
$('#restart').onclick=()=>{found={};placed={};sel=null;render();toast('Game restarted')};
// book
$('#bookBtn').onclick=()=>$('#modal').classList.add('open');
$('#closeBook').onclick=()=>$('#modal').classList.remove('open');
$('#modal').addEventListener('click',e=>{if(e.target.id==='modal')$('#modal').classList.remove('open')});
document.addEventListener('keydown',e=>{if(e.key==='Escape')$('#modal').classList.remove('open')});
// drag + tap
const slots=$('#slots'),tray=$('#tray');
tray.addEventListener('dragstart',e=>{const it=e.target.closest('.it');if(it)e.dataTransfer.setData('text/plain',it.dataset.id)});
tray.addEventListener('click',e=>{const it=e.target.closest('.it');if(it){sel=sel===it.dataset.id?null:it.dataset.id;render()}});
slots.addEventListener('dragover',e=>{const s=e.target.closest('.slot');if(s){e.preventDefault();s.classList.add('over')}});
slots.addEventListener('dragleave',e=>{const s=e.target.closest('.slot');if(s)s.classList.remove('over')});
slots.addEventListener('drop',e=>{e.preventDefault();const s=e.target.closest('.slot');if(s){s.classList.remove('over');tryPlace(e.dataTransfer.getData('text/plain'),s)}});
slots.addEventListener('click',e=>{const s=e.target.closest('.slot');if(s&&sel)tryPlace(sel,s)});
render();
