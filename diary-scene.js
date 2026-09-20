/* A real SVG ink path also drives the position of the pen nib. */
window.MesaDiary = (() => {
  const scene = document.querySelector('.diary-scene');
  if (!scene) return null;
  const paths = [...scene.querySelectorAll('.diary-ink path')];
  const lengths = paths.map(path => path.getTotalLength());
  const total = lengths.reduce((sum, length) => sum + length, 0);
  paths.forEach((path, i) => {
    path.style.strokeDasharray = lengths[i];
    path.style.strokeDashoffset = lengths[i];
  });
  const pen = scene.querySelector('.diary-pen');
  const clamp = n => Math.max(0, Math.min(1, n));
  const smooth = n => { const t = clamp(n); return t * t * (3 - 2 * t); };
  function update(local, mobile) {
    const opacity = smooth(local / .12) * (1 - smooth((local - 1.52) / .22));
    const opening = smooth((local - .1) / .38);
    const writing = clamp((local - .5) / .88);
    scene.style.opacity = opacity;
    scene.style.visibility = opacity > 0 ? 'visible' : 'hidden';
    scene.style.setProperty('--diary-open', opening);
    scene.style.setProperty('--diary-angle', (-180 + opening * 180) + 'deg');
    scene.style.setProperty('--diary-shift', ((1 - opening) * -25) + '%');
    const distance = writing * total;
    let consumed = 0, tip = paths[0].getPointAtLength(0);
    paths.forEach((path, i) => {
      const drawn = Math.max(0, Math.min(lengths[i], distance - consumed));
      path.style.strokeDashoffset = lengths[i] - drawn;
      if (distance >= consumed) tip = path.getPointAtLength(drawn);
      consumed += lengths[i];
    });
    // SVG coordinates cover the full spread; the nib sits at the path endpoint.
    const settle = smooth((local - 1.39) / .12);
    pen.style.left = (tip.x / 1000 * 100 + settle * 4) + '%';
    pen.style.top = (tip.y / 667 * 100 - settle * 6) + '%';
    pen.style.opacity = smooth((local - .44) / .07);
    pen.style.transform = `translate(-50%, -100%) rotate(${28 + Math.sin(writing * 36) * 3 + settle * 12}deg)`;
    scene.querySelector('.diary-imprint').style.opacity = smooth((local - 1.3) / .12);
    return opacity;
  }
  return { update };
})();
