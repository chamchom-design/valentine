/* Minimal, dependency-free playful logic */
const yes = document.getElementById('yesBtn');
const no = document.getElementById('noBtn');
const area = document.getElementById('buttonArea');
const fair = document.getElementById('fairMode');
const celebration = document.getElementById('celebration');

// keep track so the 'no' doesn't teleport off-screen
function placeNoRandomly() {
  const rect = area.getBoundingClientRect();
  const yesRect = yes.getBoundingClientRect();
  const btnW = Math.max(80, no.offsetWidth);
  const btnH = Math.max(40, no.offsetHeight);

  // available bounding box inside the area (coordinates relative to area)
  const padding = 8;
  const minX = padding;
  const maxX = rect.width - btnW - padding;
  const minY = padding;
  const maxY = rect.height - btnH - padding;

  // attempt positions until not overlapping yes
  for (let i = 0; i < 30; i++) {
    const x = Math.random() * (maxX - minX) + minX;
    const y = Math.random() * (maxY - minY) + minY;
    const absX = rect.left + x;
    const absY = rect.top + y;
    const overlap = !(absX + btnW < yesRect.left || absX > yesRect.right || absY + btnH < yesRect.top || absY > yesRect.bottom);
    if (!overlap) {
      // place using absolute coords inside the area container
      no.style.left = x + 'px';
      no.style.top = y + 'px';
      return;
    }
  }
  // fallback: place to the opposite side
  no.style.left = Math.max(12, rect.width - btnW - 12) + 'px';
  no.style.top = '12px';
}

let movedOnce = false;
function tryAvoid(e){
  if (fair && fair.checked) return;

  // on first interaction, switch the No button from in-flow -> absolute so it can move freely
  if (!movedOnce) {
    const areaRect = area.getBoundingClientRect();
    const cur = no.getBoundingClientRect();
    const offsetX = cur.left - areaRect.left;
    const offsetY = cur.top - areaRect.top;

    // make it absolute but keep it visually in the same place
    no.style.position = 'absolute';
    no.style.left = Math.round(offsetX) + 'px';
    no.style.top = Math.round(offsetY) + 'px';
    no.style.transform = 'none';
    // give the browser a moment to apply the absolute positioning
    no.offsetHeight; // force reflow
    movedOnce = true;
  }

  // then pick a new spot
  placeNoRandomly();
}

// move on hover / pointermove / focus / touchstart
no.addEventListener('pointerenter', tryAvoid);
no.addEventListener('focus', tryAvoid, {passive:true});
no.addEventListener('touchstart', (e)=>{ e.preventDefault(); tryAvoid(e); }, {passive:false});

// if user tries to click quickly, cancel the click and move
no.addEventListener('click', (ev)=>{
  if (fair && fair.checked) return; // allow click in fair mode (if checkbox present)
  ev.preventDefault();
  tryAvoid(ev);
});

// Keyboard support: if user presses N, move the button; Y triggers Yes
document.addEventListener('keydown', (ev)=>{
  if (ev.key.toLowerCase() === 'y') yes.click();
  if (ev.key.toLowerCase() === 'n') {
    if (!fair || !fair.checked) tryAvoid(ev);
  }
});

// YES — celebrate
yes.addEventListener('click', async ()=>{
  // open video first (user gesture allows autoplay), then overlay celebration/message on top
  if (window.__openValentineVideo) window.__openValentineVideo();
  celebrate();
  showMessage({overModal: true});
  await playChime();
});

function showMessage(opts = {}){
  const card = document.querySelector('.card');
  // small card bounce (still useful when modal isn't open)
  card.animate([{transform:'translateY(0)'},{transform:'translateY(-6px)'},{transform:'translateY(0)'}],{duration:420,iterations:1});

  // only add the persistent in-card message when NOT over the video/modal
  if (!opts.overModal) {
    const dlg = document.createElement('div');
    dlg.className = 'result';
    dlg.innerHTML = `<h2>YAY — you said yes! 🥰</h2>`;
    dlg.style.marginTop = '18px';
    dlg.style.color = '#222';
    dlg.style.fontWeight = '600';
    card.appendChild(dlg);
  }

  // if the video/modal is open, show a floating message above the modal as well
  if (opts.overModal) {
    const existing = document.querySelector('.modal-message');
    if (existing) return;
    const m = document.createElement('div');
    m.className = 'modal-message';
    m.setAttribute('role','status');
    m.setAttribute('aria-live','polite');
    m.textContent = 'YAY — you said yes! 🥰';
    document.body.appendChild(m);
    // auto-remove after a short time
    setTimeout(()=>{ m.animate([{opacity:1},{opacity:0}],{duration:400,delay:2600,fill:'forwards'}).onfinish = ()=>m.remove(); }, 1200);
  }
}

// tiny chime using WebAudio (no files)
async function playChime(){
  try{
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(660, ctx.currentTime);
    g.gain.setValueAtTime(0, ctx.currentTime);
    g.gain.linearRampToValueAtTime(0.09, ctx.currentTime + 0.01);
    o.connect(g); g.connect(ctx.destination); o.start();
    o.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.28);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.9);
    await new Promise(r=>setTimeout(r,900));
    o.stop();
  }catch(_){}
}

// celebration: spawn hearts that float up
function celebrate(){
  celebration.innerHTML = '';
  celebration.setAttribute('aria-hidden','false');
  for (let i=0;i<18;i++){
    const el = document.createElement('div');
    el.className = 'heart';
    const x = Math.random()*100;
    const y = 80 + Math.random()*40;
    el.style.left = x + 'vw';
    el.style.top = y + 'vh';
    celebration.appendChild(el);

    const dx = (Math.random()-.5)*120;
    const dy = -180 - Math.random()*200;
    const rot = (Math.random()-.5)*80;
    const dur = 1600 + Math.random()*900;

    el.animate([
      {transform:`translate(-50%,-50%) translate(0,0) rotate(0deg) scale(.8)`, opacity:0},
      {transform:`translate(-50%,-50%) translate(${dx}px,${dy}px) rotate(${rot}deg) scale(1)`, opacity:1},
      {transform:`translate(-50%,-50%) translate(${dx*1.2}px,${dy*1.4}px) rotate(${rot*1.4}deg) scale(.6)`, opacity:0}
    ], {duration:dur, easing:'cubic-bezier(.2,.8,.2,1)'});
  }
  // clear after animation
  setTimeout(()=>{ celebration.innerHTML=''; celebration.setAttribute('aria-hidden','true'); }, 2600);
}

// NOTE: do NOT move the No button on load — it should start in-flow next to Yes
window.addEventListener('load', ()=>{
  // video modal setup (optional elements may be absent in older builds)
  const videoModal = document.getElementById('videoModal');
  const celebrationVideo = document.getElementById('celebrationVideo');
  const closeVideoBtn = document.getElementById('closeVideo');

  function openVideo(){
    if (!videoModal || !celebrationVideo) return;
    videoModal.setAttribute('aria-hidden','false');
    videoModal.style.display = 'grid';
    celebrationVideo.currentTime = 0;
    celebrationVideo.play().catch(()=>{/* play may be prevented */});
    celebrationVideo.focus();
    // allow celebration to render above the video
    celebration.setAttribute('aria-hidden','false');
  }
  function closeVideo(){
    if (!videoModal || !celebrationVideo) return;

    // pause and hide
    celebrationVideo.pause();
    videoModal.setAttribute('aria-hidden','true');
    videoModal.style.display = 'none';

    // clear celebration visuals and any floating message
    celebration.innerHTML = '';
    celebration.setAttribute('aria-hidden','true');
    const m = document.querySelector('.modal-message'); if (m) m.remove();

    // remove any persistent in-card success message
    document.querySelectorAll('.card .result').forEach(n => n.remove());

    // reset the No button back to its original in-flow state
    no.style.position = '';
    no.style.left = '';
    no.style.top = '';
    no.style.transform = '';
    // ensure layout recalculates so the button returns beside Yes
    no.offsetHeight;
    movedOnce = false;

    // restore focus to the Yes button
    yes.focus();
  }

  if (closeVideoBtn) closeVideoBtn.addEventListener('click', closeVideo);
  if (celebrationVideo) {
    celebrationVideo.addEventListener('ended', closeVideo);
    celebrationVideo.addEventListener('keydown', (ev)=>{
      if (ev.key === 'Escape') closeVideo();
    });
  }
  if (videoModal) {
    videoModal.addEventListener('pointerdown', (ev)=>{
      if (ev.target === videoModal) closeVideo();
    });
  }

  // expose openVideo to the yes handler
  window.__openValentineVideo = openVideo;
});

// reposition on resize so it stays visible
window.addEventListener('resize', ()=>{
  if (movedOnce) placeNoRandomly();
});