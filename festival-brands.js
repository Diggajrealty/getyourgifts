/* Independent controls for the comparison section only. */
(() => {
  const section = document.querySelector('.festival-brands');
  if (!section) return;
  const button = section.querySelector('.fb-toggle');
  button.hidden = false;
  button.addEventListener('click', () => {
    const paused = section.classList.toggle('fb-paused');
    button.setAttribute('aria-pressed', String(paused));
    button.textContent = paused ? 'Resume animation' : 'Pause animation';
  });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      section.classList.toggle('fb-in-view', entries[0].isIntersecting);
    }).observe(section);
  } else section.classList.add('fb-in-view');
})();
