// Logic for unified portfolio
document.addEventListener('DOMContentLoaded', () => {
    const projects = window.projects || [];
    const portfolioContainer = document.getElementById('unified-portfolio-grid');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const filterControls = document.querySelector('.filter-controls');
    const modalOverlay = document.querySelector('.modal-overlay');
    const modalCloseBtn = document.querySelector('.modal-close');
    const detailsTrigger = document.getElementById('details-trigger');
    const detailsContent = document.getElementById('details-content-container');

    // Smooth scroll for contacts link
    const contactLink = document.querySelector('.nav-contact-link');
    if (contactLink) {
        contactLink.addEventListener('click', (e) => {
            e.preventDefault();
            const contactSection = document.querySelector('#contact');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // Filter indicator for "Liquid Effect"
    const filterIndicator = document.createElement('div');
    filterIndicator.className = 'filter-indicator';
    if (filterControls) filterControls.appendChild(filterIndicator);

    const updateFilterIndicator = () => {
        const activeBtn = Array.from(filterButtons).find(btn => btn.classList.contains('active'));
        if (activeBtn && filterIndicator) {
            filterIndicator.style.width = `${activeBtn.offsetWidth}px`;
            filterIndicator.style.left = `${activeBtn.offsetLeft}px`;
        }
    };
    window.addEventListener('resize', updateFilterIndicator);
    setTimeout(updateFilterIndicator, 100);

    // Check for URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    let activeFilter = urlParams.get('filter') || 'editing';

    // Update active button based on URL parameter
    if (activeFilter !== 'all') {
        filterButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === activeFilter);
        });
    }

    const renderProjects = (filter) => {
        portfolioContainer.innerHTML = '';
        const filtered = filter === 'all'
            ? projects
            : projects.filter(p => p.type === filter || p.type === 'both');

        filtered.forEach((project, index) => {
            const item = document.createElement('div');
            item.className = `portfolio-item glass-panel ${project.type}`;
            item.style.animationDelay = `${index * 0.1}s`;
            item.innerHTML = `
                <div class="item-visual">
                    <img src="${project.image}" alt="${project.title}" loading="lazy" decoding="async">
                    <div class="item-overlay">
                        <span class="view-project">Смотреть проект</span>
                    </div>
                </div>
                <div class="item-content">
                    <div class="item-meta">
                        <span class="project-year">${project.year}</span>
                        <span class="project-tag tag-${project.type}">${project.type === 'both' ? 'Продакшн + Монтаж' : (project.type === 'editing' ? 'Монтаж' : 'Продакшн')}</span>
                    </div>
                    <h4>${project.title}</h4>
                    <p class="project-category">${project.category}</p>
                </div>
            `;
            item.addEventListener('click', (e) => openModal(project, item));
            portfolioContainer.appendChild(item);
        });

        // CSS-based entry animation is now handled in style.css (.portfolio-item)
        // No longer relying on ScrollReveal for dynamic grid items to prevent invisibility bugs.
    };

    let lastActiveCard = null;

    const openModal = (project, cardElement) => {
        lastActiveCard = cardElement;
        const title = document.getElementById('modal-title');
        const video = document.querySelector('.modal-video-container');
        const task = document.getElementById('modal-features');
        const process = document.getElementById('modal-tech-features');

        title.textContent = project.title;
        video.innerHTML = project.videoEmbed;

        // Helper to format text
        const formatText = (text) => text.split('||').map(p => `<p>${p.trim()}</p>`).join('');

        task.innerHTML = formatText(project.task);
        process.innerHTML = formatText(project.process);

        renderDetails(project.details);

        // --- ANIMATION LOGIC ---
        const modalContent = document.querySelector('.modal-content');

        // 1. Prepare for animation (reset previous states)
        modalContent.style.transition = 'none';
        modalContent.style.opacity = '0';

        modalOverlay.classList.add('active');
        document.body.classList.add('body-no-scroll');
        document.documentElement.classList.add('body-no-scroll');

        // 2. Calculate positions
        const cardRect = cardElement.getBoundingClientRect();
        const startX = cardRect.left + cardRect.width / 2;
        const startY = cardRect.top + cardRect.height / 2;

        const endX = window.innerWidth / 2;
        const endY = window.innerHeight / 2;

        const moveX = startX - endX;
        const moveY = startY - endY;

        // Scale factor (approximate to match card size visually)
        const scaleFactor = Math.min(cardRect.width / modalContent.offsetWidth, cardRect.height / modalContent.offsetHeight);

        // 3. Apply initial state (at card position)
        modalContent.style.transform = `translate(${moveX}px, ${moveY}px) scale(${scaleFactor})`;

        // 4. Force reflow
        void modalContent.offsetWidth;

        // 5. Animate to final state
        requestAnimationFrame(() => {
            modalContent.style.transition = 'all 0.5s cubic-bezier(0.19, 1, 0.22, 1)'; // iOS-like easing
            modalContent.style.opacity = '1';
            modalContent.style.transform = 'translate(0, 0) scale(1)';
        });
    };

    const renderDetails = (detailsString) => {
        const summaryTags = document.getElementById('modal-summary-tags');
        summaryTags.innerHTML = '';
        detailsContent.innerHTML = '';

        const trigger = document.getElementById('details-trigger');
        if (!detailsString) {
            if (trigger) trigger.style.display = 'none';
            return;
        }

        const parts = detailsString.split(';').map(s => s.trim()).filter(s => s.length > 0);

        // --- 1. ALWAYS Render the Summary (First part) ---
        const summary = parts[0].split(':');
        const summaryTagsDiv = document.createElement('div');
        summaryTagsDiv.className = 'equipment-tags-summary';

        const tagsToRender = summary.length > 1 ? summary[1] : summary[0];
        tagsToRender.split(',').forEach(tag => {
            const span = document.createElement('span');
            span.className = 'equipment-tag';
            span.textContent = tag.trim();
            summaryTagsDiv.appendChild(span);
        });
        summaryTags.appendChild(summaryTagsDiv);

        // --- 2. Check if we have more parts for the Drawer ---
        if (parts.length > 1) {
            if (trigger) {
                trigger.style.display = 'flex';
                // Reset arrow/animation state
                trigger.classList.remove('is-open');
                detailsContent.classList.remove('is-open');
                summaryTags.classList.remove('hidden'); // Ensure tags are visible initially
                const arrow = trigger.querySelector('.details-arrow');
                if (arrow) {
                    arrow.style.animation = 'none';
                    setTimeout(() => arrow.style.animation = 'arrowPulse 2s ease infinite', 100);
                }
            }

            const detailsDiv = document.createElement('div');
            detailsDiv.className = 'detailed-info-container';
            parts.slice(1).forEach(part => {
                const splitIdx = part.indexOf(':');
                if (splitIdx !== -1) {
                    const label = part.substring(0, splitIdx);
                    const content = part.substring(splitIdx + 1);
                    const cat = document.createElement('div');
                    cat.className = 'detail-category';
                    cat.innerHTML = `<h4>${label.trim()}</h4><p>${content.trim()}</p>`;
                    detailsDiv.appendChild(cat);
                } else {
                    const cat = document.createElement('div');
                    cat.className = 'detail-category';
                    cat.innerHTML = `<p>${part.trim()}</p>`;
                    detailsDiv.appendChild(cat);
                }
            });
            detailsContent.appendChild(detailsDiv);
        } else {
            // No more info, hide the trigger
            if (trigger) trigger.style.display = 'none';
        }
    };

    const closeModal = () => {
        modalOverlay.classList.remove('active');
        document.body.classList.remove('body-no-scroll');
        document.documentElement.classList.remove('body-no-scroll');

        // Reset states
        const trigger = document.getElementById('details-trigger');
        const summaryTags = document.getElementById('modal-summary-tags');

        const modalContent = document.querySelector('.modal-content');

        // Reverse Animation logic
        if (lastActiveCard && modalContent) {
            const cardRect = lastActiveCard.getBoundingClientRect();
            const startX = cardRect.left + cardRect.width / 2;
            const startY = cardRect.top + cardRect.height / 2;
            const endX = window.innerWidth / 2;
            const endY = window.innerHeight / 2;

            const moveX = startX - endX;
            const moveY = startY - endY;
            const scaleFactor = Math.min(cardRect.width / modalContent.offsetWidth, cardRect.height / modalContent.offsetHeight);

            modalContent.style.transition = 'all 0.4s cubic-bezier(0.19, 1, 0.22, 1)';
            modalContent.style.transform = `translate(${moveX}px, ${moveY}px) scale(${scaleFactor})`;
            modalContent.style.opacity = '0';
        }

        // Wait for animation to finish before clearing/reseting
        setTimeout(() => {
            if (modalContent) {
                // Reset styles for next opening
                modalContent.style.transform = '';
                modalContent.style.opacity = '';
                modalContent.style.transition = '';
            }
            document.querySelector('.modal-video-container').innerHTML = '';
            detailsContent.classList.remove('is-open');
            if (trigger) trigger.classList.remove('is-open');
            if (summaryTags) summaryTags.classList.remove('hidden');
        }, 400);
    };

    // Filter Logic
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            updateFilterIndicator();
            activeFilter = btn.dataset.filter;
            renderProjects(activeFilter);
        });
    });

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
    if (modalOverlay) modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) closeModal(); });
    if (detailsTrigger) {
        detailsTrigger.addEventListener('click', () => {
            const summaryTags = document.getElementById('modal-summary-tags');
            detailsTrigger.classList.toggle('is-open');
            detailsContent.classList.toggle('is-open');
            if (summaryTags) summaryTags.classList.toggle('hidden');
        });
    }

    // Initial Render
    renderProjects(activeFilter);

    // About Me Modal Logic
    const aboutTrigger = document.querySelector('.about-trigger');
    const aboutModal = document.querySelector('.about-modal');
    const aboutClose = document.querySelector('.about-close');

    if (aboutTrigger && aboutModal) {
        aboutTrigger.addEventListener('click', (e) => {
            e.preventDefault();
            aboutModal.classList.add('active');
            document.body.classList.add('body-no-scroll');
            document.documentElement.classList.add('body-no-scroll');
        });
    }

    if (aboutClose) {
        aboutClose.addEventListener('click', () => {
            aboutModal.classList.remove('active');
            document.body.classList.remove('body-no-scroll');
            document.documentElement.classList.remove('body-no-scroll');
        });
    }

    // Global modal close logic for ESC and outside click
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-overlay')) {
            e.target.classList.remove('active');
            document.body.classList.remove('body-no-scroll');
            document.documentElement.classList.remove('body-no-scroll');
            if (e.target.classList.contains('project-modal')) {
                document.querySelector('.modal-video-container').innerHTML = '';
            }
        }
    });

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
            document.body.classList.remove('body-no-scroll');
            document.documentElement.classList.remove('body-no-scroll');
            document.querySelector('.modal-video-container').innerHTML = '';
        }
    });
});
