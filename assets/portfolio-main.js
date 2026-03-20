document.addEventListener('DOMContentLoaded', () => {
    const projects = Array.isArray(window.projects) ? window.projects : [];
    const portfolioContainer = document.getElementById('unified-portfolio-grid');
    const filterButtons = Array.from(document.querySelectorAll('.filter-btn'));

    const aboutModal = document.querySelector('.about-modal');
    const aboutModalContent = aboutModal?.querySelector('.modal-content');
    const aboutCloseBtn = aboutModal?.querySelector('.about-close');
    const aboutTrigger = document.querySelector('.about-trigger');

    if (!portfolioContainer) return;

    const validFilters = new Set(filterButtons.map((btn) => btn.dataset.filter));
    const urlParams = new URLSearchParams(window.location.search);
    const initialFilter = urlParams.get('filter');
    let activeFilter = validFilters.has(initialFilter) ? initialFilter : 'editing';

    let activeModal = null;
    let lastFocusedElement = null;

    const escapeText = (value) => String(value || '').trim();

    const formatRole = (type) => {
        if (type === 'both') return 'Продакшн + Монтаж';
        if (type === 'production') return 'Продакшн';
        return 'Монтаж';
    };

    const buildProjectHref = (projectId, filter) => {
        const params = new URLSearchParams();
        params.set('id', projectId);
        params.set('filter', filter);
        return `/project/?${params.toString()}`;
    };

    const openModal = (modalElement, focusElement, restoreTarget) => {
        if (!modalElement) return;

        lastFocusedElement = restoreTarget || document.activeElement;
        activeModal = modalElement;

        modalElement.classList.add('active');
        modalElement.setAttribute('aria-hidden', 'false');
        document.body.classList.add('body-no-scroll');
        document.documentElement.classList.add('body-no-scroll');

        window.requestAnimationFrame(() => {
            focusElement?.focus({ preventScroll: true });
        });
    };

    const closeModal = (modalElement, restoreFocus = true) => {
        if (!modalElement) return;

        modalElement.classList.remove('active');
        modalElement.setAttribute('aria-hidden', 'true');

        if (activeModal === modalElement) {
            activeModal = null;
        }

        if (!document.querySelector('.modal-overlay.active')) {
            document.body.classList.remove('body-no-scroll');
            document.documentElement.classList.remove('body-no-scroll');
        }

        if (restoreFocus && lastFocusedElement instanceof HTMLElement) {
            lastFocusedElement.focus({ preventScroll: true });
        }
    };

    const closeActiveModal = () => {
        if (activeModal) {
            closeModal(activeModal);
        }
    };

    const updateFilterButtonCounts = () => {
        filterButtons.forEach((btn) => {
            if (!btn.dataset.baseLabel) {
                btn.dataset.baseLabel = btn.textContent.trim();
            }

            const btnFilter = btn.dataset.filter;
            const count = projects.filter((project) => project.type === btnFilter || project.type === 'both').length;
            btn.textContent = `${btn.dataset.baseLabel} (${count})`;
        });
    };

    const createProjectCard = (project, index, currentFilter) => {
        const card = document.createElement('a');
        card.className = `portfolio-item glass-panel is-entering ${project.type}`;
        card.href = buildProjectHref(project.id, currentFilter);
        card.setAttribute('aria-label', `Открыть проект: ${escapeText(project.title)}`);

        const visual = document.createElement('div');
        visual.className = 'item-visual';

        const image = document.createElement('img');
        image.src = project.image;
        if (project.imageSmall) {
            image.srcset = `${project.imageSmall} 720w, ${project.image} 1280w`;
            image.sizes = '(max-width: 560px) 94vw, (max-width: 860px) 88vw, (max-width: 1200px) 46vw, 360px';
        }
        image.alt = escapeText(project.title);
        image.width = 1280;
        image.height = 720;
        image.loading = index === 0 ? 'eager' : 'lazy';
        image.decoding = 'async';
        if (index === 0) {
            image.fetchPriority = 'high';
        }

        const overlay = document.createElement('div');
        overlay.className = 'item-overlay';

        const overlayText = document.createElement('span');
        overlayText.className = 'view-project';
        overlayText.textContent = 'Открыть проект';

        overlay.appendChild(overlayText);
        visual.append(image, overlay);

        const content = document.createElement('div');
        content.className = 'item-content';

        const meta = document.createElement('div');
        meta.className = 'item-meta';

        const year = document.createElement('span');
        year.className = 'project-year';
        year.textContent = escapeText(project.year);

        const tag = document.createElement('span');
        tag.className = `project-tag tag-${project.type}`;
        tag.textContent = formatRole(project.type);

        const heading = document.createElement('h4');
        heading.textContent = escapeText(project.title);

        const category = document.createElement('p');
        category.className = 'project-category';
        category.textContent = escapeText(project.category);

        meta.append(year, tag);
        content.append(meta, heading, category);
        card.append(visual, content);

        return card;
    };

    const renderProjects = (filter) => {
        portfolioContainer.innerHTML = '';

        const filteredProjects = projects.filter((project) => project.type === filter || project.type === 'both');

        if (!filteredProjects.length) {
            const empty = document.createElement('p');
            empty.className = 'section-subtitle';
            empty.textContent = 'Пока нет проектов в этой категории.';
            portfolioContainer.appendChild(empty);
            return;
        }

        filteredProjects.forEach((project, index) => {
            const card = createProjectCard(project, index, filter);
            portfolioContainer.appendChild(card);
        });
    };

    const syncFilterButtons = (selectedFilter) => {
        filterButtons.forEach((btn) => {
            const isActive = btn.dataset.filter === selectedFilter;
            btn.classList.toggle('active', isActive);
            btn.setAttribute('aria-pressed', String(isActive));
        });
    };

    const setFilter = (nextFilter) => {
        if (!validFilters.has(nextFilter)) return;

        activeFilter = nextFilter;
        syncFilterButtons(activeFilter);
        renderProjects(activeFilter);

        const nextParams = new URLSearchParams(window.location.search);
        nextParams.set('filter', activeFilter);
        const nextUrl = `${window.location.pathname}?${nextParams.toString()}${window.location.hash}`;
        window.history.replaceState({}, '', nextUrl);
    };

    filterButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
            const next = btn.dataset.filter;
            setFilter(next);
        });
    });

    aboutCloseBtn?.addEventListener('click', () => closeModal(aboutModal));

    aboutModal?.addEventListener('click', (event) => {
        if (event.target === aboutModal) {
            closeModal(aboutModal);
        }
    });

    aboutTrigger?.addEventListener('click', (event) => {
        event.preventDefault();
        openModal(aboutModal, aboutModalContent, aboutTrigger);
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeActiveModal();
        }

        if (event.key !== 'Tab' || !activeModal) return;

        const focusable = activeModal.querySelectorAll(
            'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );

        if (!focusable.length) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    });

    updateFilterButtonCounts();
    setFilter(activeFilter);
});
