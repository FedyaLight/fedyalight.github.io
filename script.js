document.addEventListener('DOMContentLoaded', function () {

    // --- 1. CUSTOM CURSOR LOGIC ---
    // --- 1. CUSTOM CURSOR LOGIC REMOVED ---

    // --- 2. MOBILE MENU LOGIC ---
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links a');

    if (burger && nav) {
        const navSlide = () => {
            nav.classList.toggle('nav-active');
            navLinks.forEach((link, index) => {
                if (nav.classList.contains('nav-active')) {
                    link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
                } else { link.style.animation = ''; }
            });
            burger.classList.toggle('toggle');
        };
        burger.addEventListener('click', navSlide);
        navLinks.forEach(link => {
            link.addEventListener('click', () => { if (nav.classList.contains('nav-active')) { navSlide(); } });
        });
    }

    // --- 3. GLOBAL ESC CLOSE ---
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
            document.body.classList.remove('body-no-scroll');
            document.documentElement.classList.remove('body-no-scroll');
        }
    });

    // --- 4. ON LOAD ACTIONS ---
    // Moved here for faster perceived loading (don't wait for all iframes/heavy assets)
    setTimeout(() => {
        document.body.classList.remove('is-loading');
    }, 150);
});