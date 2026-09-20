document.addEventListener('DOMContentLoaded', () => {
    // 1. Scroll + hero animations (GSAP, with IntersectionObserver fallback)
    const fadeElements = document.querySelectorAll('.fade-in');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasGsap = window.gsap && window.ScrollTrigger && !reduceMotion;

    if (hasGsap) {
        gsap.registerPlugin(ScrollTrigger);

        // Hero entrance
        gsap.timeline({ defaults: { ease: 'power3.out' } })
            .from('.hero-cutout', { scale: 0.94, duration: 2.4, ease: 'power2.out' })
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
            .to('.hero-cutout', { y: 90, ease: 'none' }, 0);

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
        btn.setAttribute('aria-pressed', String(btn.classList.contains('active')));
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
            // Add active class to clicked button
            btn.classList.add('active');
            btn.setAttribute('aria-pressed', 'true');

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

/* The Art of Giving owns its animation independently of the Mesa journey. */
(() => {
    const section = document.querySelector('.gift-story');
    if (!section) return;
    const panel = section.querySelector('.gift-story-sticky');
    const chapters = [...section.querySelectorAll('.story-chapter')];
    const counter = section.querySelector('.story-count');
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    let queued = false;
    function draw() {
        queued = false;
        const enabled = innerWidth > 1000 && innerHeight >= 700 && !motion.matches;
        section.classList.toggle('gift-story-animated', enabled);
        if (!enabled) {
            chapters.forEach(chapter => chapter.classList.add('is-active'));
            section.style.removeProperty('--story-progress');
            section.style.removeProperty('--product-turn');
            section.style.removeProperty('--product-rise');
            return;
        }
        const distance = Math.max(1, section.offsetHeight - panel.clientHeight);
        const progress = Math.max(0, Math.min(1, -section.getBoundingClientRect().top / distance));
        section.style.setProperty('--story-progress', progress);
        section.style.setProperty('--product-turn', (-4 + progress * 8) + 'deg');
        section.style.setProperty('--product-rise', (12 - progress * 24) + 'px');
        const active = Math.min(2, Math.floor(progress * 3));
        chapters.forEach((chapter, index) => chapter.classList.toggle('is-active', index === active));
        counter.textContent = String(active + 1).padStart(2, '0') + ' / 03';
    }
    const schedule = () => {
        if (!queued) { queued = true; requestAnimationFrame(draw); }
    };
    addEventListener('scroll', schedule, { passive: true });
    addEventListener('resize', schedule);
    motion.addEventListener('change', schedule);
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
