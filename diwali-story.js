/* One reversible, scroll-driven Diwali unboxing. No animation loop when idle. */
(() => {
  const root = document.querySelector('.diwali-journey');
  if (!root) return;
  const stage = root.querySelector('.diwali-stage');
  const objects = [...root.querySelectorAll('.diwali-object')];
  const chapters = [...root.querySelectorAll('.diwali-chapter')];
  const links = [...root.querySelectorAll('.diwali-nav a')];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const clamp = n => Math.max(0, Math.min(1, n));
  const ease = n => n * n * (3 - 2 * n);
  let pending = false;
  let starts = [];
  const p = (x, y, s, r = 0, a = 1) => ({x,y,s,r,a});
  function pose(i, c, mobile) {
    const x = mobile ? 50 : 70, y = mobile ? 69 : 53;
    const hidden = p(x,y,.2,0,0);
    if (c === 0) return i === 0 ? p(x,y+3,1) : i === 1 ? p(x,y,1) : hidden;
    if (c === 1) return [p(x,y+19,.75,5),p(x+9,y-25,.68,-17),p(x-13,y-2,.52,-12),p(x+13,y+1,.48,9),p(x,y+9,.33,-8),hidden][i];
    if (c === 2) return i === 2 ? p(x,y,1.05,-5) : i < 2 ? p(x + (i ? 20 : -17),y + (i ? -35 : 33),.55,i ? -25 : 12,.12) : hidden;
    if (c === 3) return i === 3 ? p(x,y,.97,5) : hidden;
    if (c === 4) return i === 4 ? p(x,y,.9,-5) : hidden;
    return i === 5 ? p(x,y,1.1,-3) : hidden;
  }
  function measure() {
    root.classList.toggle('has-motion', !reduced.matches && innerHeight >= 550);
    starts = chapters.map(ch => ch.offsetTop);
  }
  function draw() {
    pending = false;
    if (!root.classList.contains('has-motion')) return;
    const height = stage.clientHeight, mobile = innerWidth <= 760;
    const distance = Math.max(0, -root.getBoundingClientRect().top);
    let chapter = 0;
    starts.forEach((v,i) => { if (distance >= v) chapter = i; });
    const local = clamp((distance - starts[chapter]) / height);
    const t = chapter === 5 ? 0 : ease(clamp((local - .3) / .65));
    objects.forEach((el,i) => {
      const a = pose(i,chapter,mobile), b = pose(i,Math.min(5,chapter+1),mobile);
      const timing = chapter === 0 ? ease(clamp((local - (i === 1 ? .15 : .36)) / .6)) : t;
      const v = {};
      Object.keys(a).forEach(k => v[k] = a[k] + (b[k]-a[k]) * timing);
      v.y -= Math.sin(timing*Math.PI) * (i === 1 ? 8 : 3);
      el.style.transform = `translate(-50%,-50%) translate3d(${v.x * stage.clientWidth/100}px,${v.y*height/100}px,0) rotate(${v.r}deg) scale(${v.s})`;
      el.style.opacity = v.a;
    });
    const progress = chapter + t;
    root.style.setProperty('--lit', clamp(1-Math.abs(progress-2)));
    root.style.setProperty('--greeting', clamp((progress-3.6)*2.5));
    root.style.setProperty('--progress',progress/5);
    const active = Math.round(progress);
    links.forEach((link,i) => i === active ? link.setAttribute('aria-current','step') : link.removeAttribute('aria-current'));
    root.querySelector('.diwali-counter').textContent = `0${active+1} / 06`;
  }
  function schedule() { if (!pending) { pending=true; requestAnimationFrame(draw); } }
  function refresh() { measure(); schedule(); }
  links.forEach((link,i) => link.addEventListener('click',event => {
    if (!root.classList.contains('has-motion')) return;
    event.preventDefault();
    scrollTo({top:scrollY+root.getBoundingClientRect().top+starts[i],behavior:'smooth'});
  }));
  addEventListener('scroll',schedule,{passive:true});
  addEventListener('resize',refresh);
  addEventListener('load',refresh);
  reduced.addEventListener('change',refresh);
  measure(); draw();
})();
