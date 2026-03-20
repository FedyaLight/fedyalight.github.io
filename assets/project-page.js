document.addEventListener('DOMContentLoaded', () => {
    const projects = Array.isArray(window.projects) ? window.projects : [];

    const projectContent = document.getElementById('project-content');
    const notFoundSection = document.getElementById('project-not-found');
    const backLink = document.getElementById('project-back-link');

    const title = document.getElementById('project-title');
    const category = document.getElementById('project-category');
    const year = document.getElementById('project-year');
    const role = document.getElementById('project-role');

    const videoContainer = document.getElementById('project-video-container');
    const videoActions = document.getElementById('project-video-actions');

    const task = document.getElementById('project-task');
    const process = document.getElementById('project-process');

    const techSection = document.getElementById('project-tech');
    const detailsList = document.getElementById('project-details-list');

    const metaDescription = document.querySelector('meta[name="description"]');

    const escapeText = (value) => String(value || '').trim();

    const formatRole = (type) => {
        if (type === 'both') return 'Продакшн + Монтаж';
        if (type === 'production') return 'Продакшн';
        return 'Монтаж';
    };

    const renderParagraphs = (container, rawText) => {
        if (!container) return;
        container.innerHTML = '';

        const chunks = escapeText(rawText)
            .split('||')
            .map((part) => part.trim())
            .filter(Boolean);

        chunks.forEach((chunk) => {
            const p = document.createElement('p');
            p.textContent = chunk;
            container.appendChild(p);
        });
    };

    const createSafeEmbed = (embedHtml) => {
        const template = document.createElement('template');
        template.innerHTML = embedHtml || '';

        const sourceIframe = template.content.querySelector('iframe');
        if (!sourceIframe) return null;

        let parsedUrl;
        try {
            parsedUrl = new URL(sourceIframe.src, window.location.origin);
        } catch (error) {
            return null;
        }

        const allowedHosts = new Set([
            'www.youtube.com',
            'youtube.com',
            'dzen.ru',
            'www.dzen.ru'
        ]);

        if (!allowedHosts.has(parsedUrl.hostname)) {
            return null;
        }

        if (parsedUrl.hostname === 'dzen.ru' || parsedUrl.hostname === 'www.dzen.ru') {
            parsedUrl.searchParams.set('autoplay', '0');
            parsedUrl.searchParams.set('mute', '0');
        }

        const iframe = document.createElement('iframe');
        iframe.src = parsedUrl.toString();
        iframe.allow = sourceIframe.getAttribute('allow') || 'autoplay; fullscreen; accelerometer; gyroscope; picture-in-picture; encrypted-media';
        iframe.allowFullscreen = true;
        iframe.loading = 'lazy';
        iframe.referrerPolicy = sourceIframe.getAttribute('referrerpolicy') || 'strict-origin-when-cross-origin';
        iframe.title = sourceIframe.getAttribute('title') || 'Видео проекта';

        return iframe;
    };

    const createSafeOriginalLink = (rawUrl) => {
        if (!rawUrl) return null;

        let parsedUrl;
        try {
            parsedUrl = new URL(rawUrl, window.location.origin);
        } catch (error) {
            return null;
        }

        const allowedHosts = new Set([
            'www.youtube.com',
            'youtube.com',
            'youtu.be'
        ]);

        if (!allowedHosts.has(parsedUrl.hostname)) {
            return null;
        }

        const link = document.createElement('a');
        link.className = 'video-origin-link';
        link.href = parsedUrl.toString();
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.textContent = 'Смотреть оригинал';
        link.setAttribute('aria-label', 'Смотреть оригинал видео на YouTube (откроется в новой вкладке)');

        return link;
    };

    const renderDetails = (detailsString) => {
        if (!detailsList || !techSection) return;

        detailsList.innerHTML = '';

        const cleaned = escapeText(detailsString);
        if (!cleaned) {
            techSection.hidden = true;
            return;
        }

        const parts = cleaned
            .split(';')
            .map((part) => part.trim())
            .filter(Boolean);

        if (!parts.length) {
            techSection.hidden = true;
            return;
        }

        detailsList.hidden = false;
        techSection.hidden = false;

        parts.forEach((part) => {
            const row = document.createElement('div');
            row.className = 'detail-category';

            const separator = part.indexOf(':');
            if (separator > -1) {
                const label = part.slice(0, separator).trim();
                const content = part.slice(separator + 1).trim();

                const heading = document.createElement('h3');
                heading.textContent = label;

                const paragraph = document.createElement('p');
                paragraph.textContent = content;

                row.append(heading, paragraph);
            } else {
                const paragraph = document.createElement('p');
                paragraph.textContent = part;
                row.appendChild(paragraph);
            }

            detailsList.appendChild(row);
        });
    };

    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('id');
    const project = projects.find((item) => item.id === projectId);

    if (!project) {
        if (projectContent) projectContent.hidden = true;
        if (notFoundSection) notFoundSection.hidden = false;
        document.title = 'Проект не найден | Фёдор Жерлов';
        return;
    }

    const incomingFilter = urlParams.get('filter');
    const validFilters = new Set(['editing', 'production']);
    const fallbackFilter = project.type === 'production' ? 'production' : 'editing';
    const returnFilter = validFilters.has(incomingFilter) ? incomingFilter : fallbackFilter;

    if (backLink) {
        backLink.href = `/?filter=${returnFilter}#portfolio`;
    }

    const cleanedTitle = escapeText(project.title);

    if (title) title.textContent = cleanedTitle;
    if (category) category.textContent = escapeText(project.category);
    if (year) year.textContent = escapeText(project.year);
    if (role) {
        role.textContent = formatRole(project.type);
        role.className = `project-tag tag-${project.type}`;
    }

    if (videoContainer) {
        videoContainer.innerHTML = '';
        const safeIframe = createSafeEmbed(project.videoEmbed);
        if (safeIframe) {
            videoContainer.appendChild(safeIframe);
        }
    }

    if (videoActions) {
        videoActions.innerHTML = '';
        const safeOriginalLink = createSafeOriginalLink(project.originalUrl);
        if (safeOriginalLink) {
            videoActions.appendChild(safeOriginalLink);
        }
    }

    renderParagraphs(task, project.task);
    renderParagraphs(process, project.process);
    renderDetails(project.details);

    document.title = `${cleanedTitle} | Фёдор Жерлов`;
    if (metaDescription) {
        metaDescription.setAttribute('content', `${cleanedTitle}. Кейс Фёдора Жерлова: ${escapeText(project.category)}.`);
    }
});
