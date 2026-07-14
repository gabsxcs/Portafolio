(function(){
  const canvas = document.getElementById('network-canvas');
  const ctx = canvas.getContext('2d');
  const hero = document.querySelector('.hero');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let w, h, dpr;
  let nodes = [];
  let mouse = { x: null, y: null };

  const COLOR_LINE = '179,35,75';
  const COLOR_NODE = '244,233,224';
  const COLOR_COMMIT = '179,35,75';

  function resize(){
    w = hero.clientWidth;
    h = hero.clientHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    initNodes();
  }

  function initNodes(){
    const count = Math.max(24, Math.floor((w * h) / 42000));
    nodes = [];
    for(let i = 0; i < count; i++){
      const isCommit = Math.random() < 0.16;
      nodes.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        r: isCommit ? (2.2 + Math.random() * 1.4) : (1 + Math.random() * 1.2),
        commit: isCommit,
        pulse: Math.random() * Math.PI * 2
      });
    }
  }

  function step(){
    ctx.clearRect(0, 0, w, h);

    for(const n of nodes){
      n.x += n.vx;
      n.y += n.vy;
      n.pulse += 0.02;

      if(n.x < -20) n.x = w + 20;
      if(n.x > w + 20) n.x = -20;
      if(n.y < -20) n.y = h + 20;
      if(n.y > h + 20) n.y = -20;

      if(mouse.x !== null){
        const dx = n.x - mouse.x;
        const dy = n.y - mouse.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        const radius = 160;
        if(dist < radius){
          const force = (radius - dist) / radius;
          n.x += (dx / (dist || 1)) * force * 0.6;
          n.y += (dy / (dist || 1)) * force * 0.6;
        }
      }
    }

    const maxDist = 130;
    for(let i = 0; i < nodes.length; i++){
      for(let j = i + 1; j < nodes.length; j++){
        const a = nodes[i], b = nodes[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if(dist < maxDist){
          const alpha = (1 - dist / maxDist) * 0.35;
          ctx.strokeStyle = `rgba(${COLOR_LINE},${alpha})`;
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    for(const n of nodes){
      if(n.commit){
        const glow = 0.5 + Math.sin(n.pulse) * 0.3;
        ctx.fillStyle = `rgba(${COLOR_COMMIT},${glow})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r + 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = n.commit ? `rgba(${COLOR_COMMIT},0.9)` : `rgba(${COLOR_NODE},0.45)`;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fill();
    }

    if(!reduceMotion){
      requestAnimationFrame(step);
    }
  }

  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  hero.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });

  window.addEventListener('resize', resize);
  resize();

  if(reduceMotion){
    step(); 
  } else {
    step();
  }

  const revealElements = document.querySelectorAll('.reveal');
  
  const revealOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px" 
  };

  const revealOnScroll = new IntersectionObserver(function(entries, observer) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); 
      }
    });
  }, revealOptions);

  revealElements.forEach(el => {
    revealOnScroll.observe(el);
  });

})();