// --- ФАЙЛ: editing-script.js (ПОЛНАЯ ЗАМЕНА) ---

document.addEventListener('DOMContentLoaded', function() {
    
    // Находим все элементы, необходимые для модального окна
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    const modalOverlay = document.querySelector('.modal-overlay');
    const modalCloseBtn = document.querySelector('.modal-close');
    const modalTitle = document.getElementById('modal-title');
    const modalVideoContainer = document.querySelector('.modal-video-container');
    const modalFeatures = document.getElementById('modal-features'); // Блок для "Особенностей"
    const modalTechFeatures = document.getElementById('modal-tech-features'); // Блок для "Тех. особенностей"
    const detailsContentContainer = document.getElementById('details-content-container');
    const detailsTrigger = document.getElementById('details-trigger');

    // Функция для преобразования текста с разделителем "||" в параграфы
    const processParagraphs = (text, container) => {
        if (!container) return;
        container.innerHTML = '';
        if (!text) return;
        text.split('||').forEach(pText => {
            const p = document.createElement('p');
            p.textContent = pText.trim();
            container.appendChild(p);
        });
    };
    
    // Функция для отображения технических деталей (теги и подробности)
    const renderDetailsContent = (detailsString) => {
        if (!detailsContentContainer) return;
        detailsContentContainer.innerHTML = '';
        if (!detailsString) return;

        const summaryContainer = document.createElement('div');
        summaryContainer.className = 'equipment-tags-summary';
        const breakdownContainer = document.createElement('div');
        breakdownContainer.className = 'detailed-info-container';

        const parts = detailsString.split(';').map(s => s.trim());
        const summaryItems = (parts[0].split(':')[1] || '').split(',');
        summaryItems.forEach(equip => {
            if (equip.trim()) {
                const tag = document.createElement('span');
                tag.className = 'equipment-tag';
                tag.textContent = equip.trim();
                summaryContainer.appendChild(tag);
            }
        });
        
        parts.slice(1).forEach(catStr => {
            const [catName, items] = catStr.split(':');
            if (catName && items) {
                const catDiv = document.createElement('div');
                catDiv.className = 'detail-category';
                catDiv.innerHTML = `<h4>${catName.trim()}</h4><p>${items.trim()}</p>`;
                breakdownContainer.appendChild(catDiv);
            }
        });
        detailsContentContainer.appendChild(summaryContainer);
        detailsContentContainer.appendChild(breakdownContainer);
    };
    
    // Функция для переключения видимости подробных технических деталей
    const toggleDetails = () => detailsContentContainer.classList.toggle('is-open');

    // Функция открытия модального окна
 const openModal = (item) => {
    modalTitle.textContent = item.dataset.title || 'Название проекта';
    modalVideoContainer.innerHTML = item.dataset.videoEmbed || '';
    
    // Всегда обрабатываем "Особенности"
    processParagraphs(item.dataset.task, modalFeatures);

    // --- НАЧАЛО ИЗМЕНЕНИЙ ---
    
    // Находим обертку блока "Технические особенности"
    const techFeaturesWrapper = document.getElementById('tech-features-wrapper');
    // Получаем данные для блока
    const techFeaturesData = item.dataset.process;

    // Проверяем, есть ли в data-process какой-либо текст
    if (techFeaturesData && techFeaturesData.trim() !== '') {
        // Если данные есть, показываем блок и заполняем его
        techFeaturesWrapper.style.display = 'block';
        processParagraphs(techFeaturesData, modalTechFeatures);
    } else {
        // Если данных нет, полностью скрываем блок
        techFeaturesWrapper.style.display = 'none';
    }
    
    // --- КОНЕЦ ИЗМЕНЕНИЙ ---

    renderDetailsContent(item.dataset.details);
    
    const cursor = document.querySelector('.custom-cursor');
    const iframe = modalVideoContainer.querySelector('iframe');
    if (iframe && cursor && window.innerWidth > 768) {
        iframe.addEventListener('mouseenter', () => cursor.classList.add('hidden'));
        iframe.addEventListener('mouseleave', () => cursor.classList.remove('hidden'));
    }
    
    modalOverlay.classList.add('active');
    document.documentElement.classList.add('body-no-scroll');
};

    // Функция закрытия модального окна
    const closeModal = () => {
        modalOverlay.classList.remove('active');
        document.documentElement.classList.remove('body-no-scroll');
        modalVideoContainer.innerHTML = ''; // Очищаем видео, чтобы остановить воспроизведение
        detailsContentContainer.classList.remove('is-open');
        const cursor = document.querySelector('.custom-cursor');
        if (cursor) cursor.classList.remove('hidden');
    };

    // Назначаем обработчики событий
    portfolioItems.forEach(item => {
        item.addEventListener('click', () => openModal(item));
    });

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
    if (modalOverlay) modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) closeModal(); });
    if (detailsTrigger) detailsTrigger.addEventListener('click', toggleDetails);
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
            closeModal();
        }
    });

});