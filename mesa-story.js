/* One persistent product scene travels through the scrolling narrative. */
(() => {
  const root = document.querySelector('.mesa-journey');
  if (!root) return;
  const viewport = root.querySelector('.journey-viewport');
  const objects = [...root.querySelectorAll('.journey-object')];
  const chapters = [...root.querySelectorAll('.journey-chapter')];
  const markers = [...root.querySelectorAll('.journey-nav a')];
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const clamp = n => Math.max(0, Math.min(1, n));
  const mix = (a, b, t) => a + (b - a) * t;
  const smooth = t => t * t * (3 - 2 * t);
  let pending = false;
  let chapterStarts = [];
  function measure() {
    root.classList.toggle('has-motion', !motion.matches && innerHeight >= 480);
    chapterStarts = chapters.map(chapter => chapter.offsetTop);
  }
  // x/y are viewport percentages; size is a fraction of the image's hero size.
  const pose = (x, y, size, spin = 0, tilt = 0, opacity = 1) => ({ x, y, size, spin, tilt, opacity });
  function frame(item, chapter, mobile) {
    const centerY = mobile ? 65 : 53;
    if (chapter === 0) return pose(50, centerY, item < 2 ? 1 : .15, 0, -12, item < 2 ? 1 : 0);
    if (chapter === 1) {
      if (item === 0) return pose(70, mobile ? 42 : 22, .82, -28, 22);
      if (item === 1) return pose(62, mobile ? 74 : 70, .85, 8, -12);
      const angle = (item - 2) / 6 * Math.PI * 2;
      return pose(62 + Math.cos(angle) * (mobile ? 23 : 22), centerY + Math.sin(angle) * 25, .38, (item - 2) * 35 - 80, 24);
    }
    if (chapter === 8) {
      const positions = mobile
        ? [[28,55],[72,55],[16,73],[42,73],[72,73],[89,86],[25,86],[54,86]]
        : [[22,54],[51,57],[80,51],[17,82],[74,82],[92,78],[38,84],[56,85]];
      return pose(...positions[item], item < 2 ? .62 : .43, 0, 0);
    }
    const featured = chapter; // chapter 2 -> hoodie, ... chapter 7 -> welcome card
    const right = chapter % 2 === 0;
    if (item === featured) return pose(mobile ? 50 : right ? 70 : 30, mobile ? 66 : 53, mobile ? .95 : 1.12, chapter % 2 ? -8 : 9, chapter % 2 ? 16 : -16);
    if (item < 2) return pose(item ? 51 : 48, item ? 104 : -14, .5, item ? 18 : -24, 15, .18);
    const angle = (item - 2) / 6 * Math.PI * 2 + chapter * .6;
    return pose(50 + Math.cos(angle) * 54, 52 + Math.sin(angle) * 55, .26, chapter * 42 + item * 25, -25, .16);
  }
  function draw() {
    pending = false;
    const enabled = !motion.matches && innerHeight >= 480;
    root.classList.toggle('has-motion', enabled);
    if (!enabled) { window.MesaDiary?.update(-1, innerWidth <= 760); return; }
    const mobile = innerWidth <= 760;
    const height = viewport.clientHeight;
    // The notebook gets extra reading time; later chapters keep their own anchors.
    const distance = Math.max(0, -root.getBoundingClientRect().top);
    let chapter = 0;
    chapterStarts.forEach((start, index) => { if (distance >= start) chapter = index; });
    const local = (distance - chapterStarts[chapter]) / height;
    const progress = Math.min(8, chapter + clamp(chapter === 3 ? local - 1.4 : local));
    const diaryLocal = (distance - chapterStarts[3]) / height;
    const diaryOpacity = window.MesaDiary?.update(diaryLocal, mobile) || 0;
    const current = Math.floor(progress), next = Math.min(8, current + 1);
    // Hold each object while its copy passes, then fly into the next chapter.
    const fraction = progress - current;
    const t = smooth(clamp((fraction - .28) / .62));
    objects.forEach((object, i) => {
      // The lid clears the box before any of its contents start to lift.
      const localT = current === 0
        ? smooth(clamp((fraction - (i === 0 ? .12 : i === 1 ? .25 : .39 + (i - 2) * .025)) / (i < 2 ? .45 : .32)))
        : t;
      const a = frame(i, current, mobile), b = frame(i, next, mobile);
      const values = {};
      for (const key of Object.keys(a)) values[key] = mix(a[key], b[key], localT);
      const flying = Math.sin(localT * Math.PI);
      values.y -= flying * (i < 2 ? 4 : 9);
      // Objects rotate along their travel path, then face the reader at rest.
      values.spin += flying * (i % 2 ? 34 : -34);
      object.style.transform = `translate(-50%, -50%) translate3d(${values.x * innerWidth / 100}px, ${values.y * height / 100}px, 0) rotate(${values.spin}deg) rotateY(${values.tilt}deg) scale(${values.size})`;
      object.style.opacity = values.opacity * (i === 3 || i === 5 ? 1 - diaryOpacity : 1);
      object.style.zIndex = i === (t < .5 ? current : next) ? 12 : i === 0 ? 10 : i + 1;
    });
    root.style.setProperty('--journey-progress', progress / 8);
    root.style.setProperty('--journey-glow-x', `${mix(40, 65, (Math.sin(progress) + 1) / 2)}%`);
    const active = Math.min(8, Math.round(progress));
    markers.forEach((link, i) => i === active ? link.setAttribute('aria-current', 'step') : link.removeAttribute('aria-current'));
    root.querySelector('.journey-counter').textContent = `${String(active + 1).padStart(2, '0')} / 09`;
  }
  function schedule() {
    if (!pending) { pending = true; requestAnimationFrame(draw); }
  }
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', () => { measure(); schedule(); });
  motion.addEventListener('change', () => { draw(); measure(); schedule(); });
  // Native anchors keep keyboard navigation and history usable.
  markers.forEach((link, i) => link.addEventListener('click', event => {
    if (!root.classList.contains('has-motion')) return;
    event.preventDefault();
    scrollTo({ top: scrollY + root.getBoundingClientRect().top + chapterStarts[i], behavior: 'smooth' });
  }));
  root.classList.toggle('has-motion', !motion.matches && innerHeight >= 480);
  measure();
  draw();
  addEventListener('load', () => { measure(); schedule(); });
})();
