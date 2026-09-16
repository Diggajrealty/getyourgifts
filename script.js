document.addEventListener('DOMContentLoaded', () => {
    // 1. Scroll + hero animations (GSAP, with IntersectionObserver fallback)
    const fadeElements = document.querySelectorAll('.fade-in');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasGsap = window.gsap && window.ScrollTrigger && !reduceMotion;

    if (hasGsap) {
        gsap.registerPlugin(ScrollTrigger);

        // Hero entrance
        gsap.timeline({ defaults: { ease: 'power3.out' } })
            .from('.hero-bg-video', { scale: 1.22, duration: 2.4, ease: 'power2.out' })
            .from('.hero-eyebrow', { y: 18, opacity: 0, duration: 0.8 }, 0.25)
            .from('.hero-title .line > span', {
                yPercent: 110, opacity: 0, duration: 1.1, stagger: 0.12
            }, 0.35)
            .from('.hero-subtitle', { y: 22, opacity: 0, duration: 0.9 }, 0.75)
            .from('.hero-lead-form', { y: 28, opacity: 0, duration: 0.9 }, 0.9)
            .from('.hero-note, .hero-scroll', { opacity: 0, duration: 0.8, stagger: 0.1 }, 1.1);

        // Hero parallax: content drifts up and out, video sinks slower
        gsap.timeline({
            scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
        })
            .to('.hero-content', { y: -70, opacity: 0, ease: 'none' }, 0)
            .to('.hero-bg-video', { y: 90, ease: 'none' }, 0);

        // Section reveals — reuse the existing .visible CSS transition
        ScrollTrigger.batch(fadeElements, {
            start: 'top 85%',
            once: true,
            onEnter: batch => batch.forEach((el, i) => setTimeout(() => el.classList.add('visible'), i * 90))
        });

        // Section headers: eyebrow, title, hairline and lede arrive in order
        gsap.utils.toArray('.section-head').forEach(head => {
            gsap.from(head.children, {
                y: 26, opacity: 0, duration: 0.9, ease: 'power3.out', stagger: 0.12,
                scrollTrigger: { trigger: head, start: 'top 88%', once: true }
            });
        });

        // Grid children stagger along their own row
        const grids = [
            ['.trust-item', 0.07],
            ['.service-card', 0.1],
            ['.product-card', 0.08],
            ['.feature-card', 0.09],
            ['.google-review-card', 0.08],
            ['.accordion-item', 0.05]
        ];

        grids.forEach(([selector, step]) => {
            const items = gsap.utils.toArray(selector);
            if (!items.length) return;
            gsap.from(items, {
                y: 34, opacity: 0, duration: 0.85, ease: 'power3.out', stagger: step,
                scrollTrigger: { trigger: items[0].parentElement, start: 'top 86%', once: true }
            });
        });

        // Full-bleed band: photo drifts against the scroll, copy rises into place
        if (document.querySelector('.cta-band')) {
            gsap.to('.cta-band-media img', {
                yPercent: 14, ease: 'none',
                scrollTrigger: { trigger: '.cta-band', start: 'top bottom', end: 'bottom top', scrub: true }
            });
            gsap.from('.cta-band-inner > *', {
                y: 30, opacity: 0, duration: 1, ease: 'power3.out', stagger: 0.12,
                scrollTrigger: { trigger: '.cta-band', start: 'top 70%', once: true }
            });
        }

        // About split: image and copy arrive from opposite sides
        if (document.querySelector('.about-split')) {
            gsap.from('.about-visual', {
                x: -40, opacity: 0, duration: 1.1, ease: 'power3.out',
                scrollTrigger: { trigger: '.about-split', start: 'top 78%', once: true }
            });
            gsap.from('.about-copy > *', {
                y: 28, opacity: 0, duration: 0.9, ease: 'power3.out', stagger: 0.1,
                scrollTrigger: { trigger: '.about-split', start: 'top 75%', once: true }
            });
            gsap.from('.about-stat', {
                scale: 0.85, opacity: 0, duration: 0.8, ease: 'back.out(1.6)', delay: 0.45,
                scrollTrigger: { trigger: '.about-split', start: 'top 78%', once: true }
            });
        }

        // Inquiry split
        gsap.utils.toArray('.inquiry-split').forEach(el => {
            gsap.from(el.children, {
                y: 32, opacity: 0, duration: 0.95, ease: 'power3.out', stagger: 0.14,
                scrollTrigger: { trigger: el, start: 'top 80%', once: true }
            });
        });

        // Product images settle from a slight zoom as their card arrives
        gsap.utils.toArray('.product-card .img-wrapper img').forEach(img => {
            gsap.from(img, {
                scale: 1.14, duration: 1.6, ease: 'power2.out',
                scrollTrigger: { trigger: img, start: 'top 92%', once: true }
            });
        });
    } else {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        fadeElements.forEach(el => observer.observe(el));
    }

    // 2. Category Filtering Logic
    const filterBtns = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            productCards.forEach(card => {
                const categories = card.getAttribute('data-category');
                
                if (filterValue === 'all' || (categories && categories.includes(filterValue))) {
                    card.style.display = 'block';
                    // Re-trigger fade-in animation for visual effect
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    card.style.display = 'none';
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                }
            });
        });
    });

    // 3. FAQ Accordion Logic
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            // Toggle active class on header
            header.classList.toggle('active');

            // Get the corresponding content body
            const content = header.nextElementSibling;

            // Toggle max-height for smooth opening/closing
            if (header.classList.contains('active')) {
                content.style.maxHeight = content.scrollHeight + "px";
            } else {
                content.style.maxHeight = 0;
            }
        });
    });

    // 4. Multi-Step Concierge Form Logic
    const conciergeForms = document.querySelectorAll('.multi-step-form');
    conciergeForms.forEach(conciergeForm => {
        const steps = Array.from(conciergeForm.querySelectorAll('.form-step'));
        const nextBtns = conciergeForm.querySelectorAll('.next-step');
        const prevBtns = conciergeForm.querySelectorAll('.prev-step');
        
        let currentStep = 0;

        // Validation per step
        const checkStepValidity = () => {
            const stepElement = steps[currentStep];
            const nextBtn = stepElement.querySelector('.next-step');
            if (!nextBtn) return;

            if (currentStep === 0) {
                // Check if occasion is selected
                const occasionChecked = stepElement.querySelector('input[name="occasion"]:checked');
                nextBtn.disabled = !occasionChecked;
            } else if (currentStep === 1) {
                // Check if both quantity and budget are selected
                const quantityChecked = stepElement.querySelector('input[name="quantity"]:checked');
                const budgetChecked = stepElement.querySelector('input[name="budget"]:checked');
                nextBtn.disabled = !(quantityChecked && budgetChecked);
            }
        };

        // Add event listeners to radio buttons to trigger validation
        const radioInputs = conciergeForm.querySelectorAll('input[type="radio"]');
        radioInputs.forEach(input => {
            input.addEventListener('change', checkStepValidity);
        });

        // Add event listeners to inputs in final step
        const textInputs = steps[2].querySelectorAll('input[required]');
        const submitBtn = steps[2].querySelector('.submit-btn');
        const checkFinalStep = () => {
            let allValid = true;
            textInputs.forEach(input => {
                if (!input.value.trim() || !input.checkValidity()) {
                    allValid = false;
                }
            });
            submitBtn.disabled = !allValid;
        };
        if (textInputs && submitBtn) {
            textInputs.forEach(input => {
                input.addEventListener('input', checkFinalStep);
            });
        }

        const showStep = (index) => {
            steps.forEach((step, i) => {
                step.classList.toggle('active', i === index);
            });
            checkStepValidity();
        };

        nextBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (currentStep < steps.length - 1) {
                    currentStep++;
                    showStep(currentStep);
                }
            });
        });

        prevBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (currentStep > 0) {
                    currentStep--;
                    showStep(currentStep);
                }
            });
        });

        conciergeForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Hide all steps
            steps.forEach(step => step.classList.remove('active'));
            // Show success message
            const successMsg = conciergeForm.querySelector('.form-success');
            if (successMsg) successMsg.classList.add('active');
        });
    });
});

/* ===== Exploded kit: cold-fog wireframe unpack ===== */
(function () {
  const sec = document.getElementById('kit-explode');
  const canvas = document.getElementById('kitCanvas');
  if (!sec || !canvas || matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const scene = document.getElementById('kitScene');
  const ticks = document.getElementById('kitTicks');
  const frame = sec.querySelector('.kit-frame');
  const hint  = document.getElementById('kitHint');
  const items = [...scene.querySelectorAll('.kit-item')];

  // scattered technical annotations, seeded so they don't jump on resize
  let seed = 20260903;
  const rnd = () => (seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;
  ticks.innerHTML = Array.from({ length: 26 }, () => {
    const n = 10 + Math.floor(rnd() * 30);
    return `<b style="left:${(4 + rnd() * 92).toFixed(1)}%;top:${(4 + rnd() * 92).toFixed(1)}%">${n}</b>`;
  }).join('');
  const tickEls = [...ticks.children];

  const START = 0.10, STEP = 0.090, DUR = 0.22;
  const ease = t => 1 - Math.pow(1 - t, 3);
  const clamp01 = v => (v < 0 ? 0 : v > 1 ? 1 : v);
  const OX = 50, OY = 42;                       // closed-box origin

  let ticking = false;
  function draw() {
    ticking = false;
    const r = sec.getBoundingClientRect();
    const p = clamp01(-r.top / (sec.offsetHeight - innerHeight));
    const cw = canvas.clientWidth, ch = canvas.clientHeight;

    // slow camera drift, like the reference's isometric settle
    scene.style.setProperty('--rx', (13 - 11 * ease(p)).toFixed(2) + 'deg');
    scene.style.setProperty('--ry', (-9 + 13 * ease(p)).toFixed(2) + 'deg');

    items.forEach((el, i) => {
      const t = ease(clamp01((p - (START + i * STEP)) / DUR));
      const cs = getComputedStyle(el);
      const fx = parseFloat(cs.getPropertyValue('--fx'));
      const fy = parseFloat(cs.getPropertyValue('--fy'));
      const box = i < 2;                        // lid + base = the closed box
      const x = (OX + (fx - OX) * t) / 100 * cw;
      const y = (OY + (fy - OY) * t) / 100 * ch;
      el.style.setProperty('--tx', (x - cw / 2).toFixed(1) + 'px');
      el.style.setProperty('--ty', (y - ch / 2).toFixed(1) + 'px');
      el.style.setProperty('--tz', ((1 - t) * -140 + i * 6).toFixed(1) + 'px');
      el.style.setProperty('--s', (box ? 1 : 0.62 + 0.38 * t).toFixed(3));
      el.style.setProperty('--r', ((1 - t) * (i % 2 ? 5 : -5)).toFixed(1) + 'deg');
      el.style.setProperty('--b', ((1 - t) * 7).toFixed(2) + 'px');   // emerge from fog
      el.style.setProperty('--o', box ? clamp01(p / 0.06) : t.toFixed(3));
      el.style.setProperty('--lo', t > 0.82 ? 1 : 0);
    });

    tickEls.forEach((b, i) => b.style.setProperty('--to', p > 0.1 + (i % 9) * 0.055 ? 1 : 0));
    if (frame) frame.style.setProperty('--frame', p > 0.04 ? 1 : 0);
    if (hint)  hint.style.setProperty('--hint', p > 0.08 ? 0 : 1);
  }

  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(draw); } };
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);
  draw();
})();

/* ===== Netlify Forms: AJAX submit (keeps in-page success UI) ===== */
document.addEventListener('submit', (e) => {
    const form = e.target.closest('form[data-netlify]');
    if (!form) return;
    e.preventDefault();
    fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(new FormData(form)).toString()
    }).catch(() => {});
}, true);
