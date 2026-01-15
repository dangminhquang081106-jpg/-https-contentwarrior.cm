(function(){
  // Simple confetti burst animation - lightweight and self-contained
  const colors = ['#39AFFF','#6FD6FF','#105F94','#003f8a','#1d86af'];
  let canvas, ctx, W, H, DPR, particles = [], raf, running = false;

  function setupCanvas(){
    if(canvas) return;
    canvas = document.createElement('canvas');
    canvas.id = 'confetti-canvas';
    canvas.style.position = 'fixed';
    canvas.style.left = '0';
    canvas.style.top = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '9999';
    document.body.appendChild(canvas);
    ctx = canvas.getContext('2d');
    DPR = window.devicePixelRatio || 1;
    resize();
    window.addEventListener('resize', resize);
  }

  function resize(){
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = Math.floor(W * DPR);
    canvas.height = Math.floor(H * DPR);
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    if(ctx) ctx.setTransform(DPR,0,0,DPR,0,0);
  }

  function rand(min, max){ return Math.random() * (max - min) + min }

  function spawnBurst(x, y, count){
    for(let i=0;i<count;i++){
      particles.push({
        x: x + rand(-8,8),
        y: y + rand(-8,8),
        vx: rand(-6,6),
        vy: rand(-9,-3),
        size: rand(6,12),
        rot: rand(0,360),
        vr: rand(-10,10),
        color: colors[Math.floor(Math.random()*colors.length)],
        life: rand(900,1600),
        born: Date.now()
      });
    }
  }

  function update(dt){
    const now = Date.now();
    for(let i=particles.length-1;i>=0;i--){
      const p = particles[i];
      const age = now - p.born;
      if(age > p.life){ particles.splice(i,1); continue }
      p.vy += 0.35 * (dt/16); // gravity
      p.x += p.vx * (dt/16);
      p.y += p.vy * (dt/16);
      p.vx *= 0.995;
      p.vy *= 0.995;
      p.rot += p.vr * (dt/16);
    }
  }

  function draw(){
    ctx.clearRect(0,0,W,H);
    particles.forEach(p=>{
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot * Math.PI / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size*0.6);
      ctx.restore();
    });
  }

  let last = performance.now();
  function loop(t){
    const dt = t - last; last = t;
    update(dt);
    draw();
    if(running) raf = requestAnimationFrame(loop);
  }

  function startConfetti({duration=4000, bursts=5, perBurst=20} = {}){
    setupCanvas();
    if(running) return;
    running = true;
    last = performance.now();
    raf = requestAnimationFrame(loop);
    // spawn bursts evenly over duration
    const interval = Math.max(120, duration / Math.max(1,bursts));
    let spawned = 0;
    const cx = window.innerWidth * 0.5;
    const cy = window.innerHeight * 0.18;
    const id = setInterval(()=>{
      spawnBurst(cx + rand(-120,120), cy + rand(-20,60), perBurst);
      spawned++;
      if(spawned >= bursts){ clearInterval(id); }
    }, interval);
    // stop after duration + extra
    setTimeout(()=>{
      // allow particles to finish
      setTimeout(()=> stopConfetti(), 1500);
    }, duration);
  }

  function stopConfetti(){
    running = false;
    if(raf) cancelAnimationFrame(raf);
    // fade out by clearing after short delay
    setTimeout(()=>{
      if(canvas && canvas.parentNode) canvas.parentNode.removeChild(canvas);
      canvas = null; ctx = null; particles = [];
    }, 400);
  }

  // auto-run on DOMContentLoaded for this page
  document.addEventListener('DOMContentLoaded', ()=>{
    // only run on thank-you page (simple heuristic)
    try{
      if(location.pathname && location.pathname.toLowerCase().includes('thankyou')){
        startConfetti({duration:4500, bursts:6, perBurst:22});
      }
    }catch(e){}
  });

  window.Confetti = { start: startConfetti, stop: stopConfetti };
})();
