document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const siteHeader = document.querySelector('.site-header');
    const navToggle = document.querySelector('[data-nav-toggle]');
    const nav = document.querySelector('[data-nav]');
    const navLinks = nav ? Array.from(nav.querySelectorAll('a')) : [];
    const revealNodes = Array.from(document.querySelectorAll('[data-reveal]'));
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const syncHeaderState = () => {
        if (!siteHeader) return;
        siteHeader.classList.toggle('is-scrolled', window.scrollY > 10);
    };

    const closeNav = () => {
        if (!nav || !navToggle) return;
        nav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
    };

    if (nav && navToggle) {
        navToggle.addEventListener('click', () => {
            const isOpen = nav.classList.toggle('is-open');
            navToggle.setAttribute('aria-expanded', String(isOpen));
        });

        navLinks.forEach((link) => {
            link.addEventListener('click', () => closeNav());
        });

        document.addEventListener('click', (event) => {
            if (!nav.classList.contains('is-open')) return;
            if (nav.contains(event.target) || navToggle.contains(event.target)) return;
            closeNav();
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 860) {
                closeNav();
            }
        });
    }

    window.addEventListener('scroll', syncHeaderState, { passive: true });
    syncHeaderState();

    if (!revealNodes.length) {
        // no-op
    } else if (reducedMotion || !('IntersectionObserver' in window)) {
        revealNodes.forEach((node) => node.classList.add('reveal-in'));
    } else {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('reveal-in');
                observer.unobserve(entry.target);
            });
        }, {
            threshold: 0.2,
            rootMargin: '0px 0px -8% 0px'
        });

        revealNodes.forEach((node) => revealObserver.observe(node));
    }

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeNav();
        }
    });

    requestAnimationFrame(() => {
        window.setTimeout(() => body.classList.remove('is-loading'), 80);
    });
});
