// --- ФАЙЛ: production-script.js ---

document.addEventListener('DOMContentLoaded', function() {
    
   const loadPortfolio = async () => {
        const portfolioContainer = document.getElementById('portfolio-container');
        if (!portfolioContainer) return;

        try {
            // Загружаем контент
            const response = await fetch('services.html'); 
            const text = await response.text();
            
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'text/html');
            
            const portfolioItems = doc.querySelectorAll('.portfolio-item');
            
            if (portfolioItems.length > 0) {
                portfolioItems.forEach(item => {
                    // Клонируем и вставляем
                    portfolioContainer.appendChild(item.cloneNode(true));
                });
                
                // Перезапускаем логику модалок
                reinitializePortfolioLogic();

 // --- ЗАПУСК АНИМАЦИИ (SCROLL REVEAL) ДЛЯ НОВЫХ КАРТОЧЕК ---
                if (typeof ScrollReveal !== 'undefined') {
                    const isMobile = window.innerWidth <= 768;
                    
                    ScrollReveal().reveal('.portfolio-item', {
                        interval: 200,
                        origin: 'bottom',
                        distance: '60px',
                        duration: 1200,
                        delay: 200,
                        
                        // Элемент не исчезнет, пока не уйдет на 500px ВВЕРХ за экран
                        viewOffset: { top: -500, bottom: 0 }, 
                        
                        viewFactor: 0.0,
                        reset: isMobile ? false : true 
                    });
                }                // -----------------------------------------------------------

            } else {
                portfolioContainer.innerHTML = '<p style="text-align:center; opacity:0.5;">Проекты загружаются...</p>';
            }
        } catch (error) {
            console.error('Ошибка при загрузке портфолио:', error);
            if (portfolioContainer) {
                portfolioContainer.innerHTML = '<p>Не удалось загрузить проекты.</p>';
            }
        }
    };

    const reinitializePortfolioLogic = () => {
        const portfolioItemsNew = document.querySelectorAll('.portfolio-item');
        const modalOverlay = document.querySelector('.modal-overlay');
        const modalCloseBtn = document.querySelector('.modal-close');
        const modalTitle = document.getElementById('modal-title');
        const modalVideoContainer = document.querySelector('.modal-video-container');
        const modalTask = document.getElementById('modal-task');
        const modalProcess = document.getElementById('modal-process');
        const detailsContentContainer = document.getElementById('details-content-container');
        const detailsTrigger = document.getElementById('details-trigger');

        portfolioItemsNew.forEach(item => {
            if (item.logicAttached) return; 

            // Восстанавливаем теги (год, категория) если их нет
            const year = item.dataset.year;
            const title = item.dataset.title;
            const category = item.dataset.category;
            const itemInfo = item.querySelector('.item-info');

            if (year && !item.querySelector('.project-year')) {
                const yearTag = document.createElement('span');
                yearTag.className = 'project-year';
                yearTag.textContent = year;
                item.appendChild(yearTag);
            }
            if (category && !item.querySelector('.project-category')) {
                const categoryTag = document.createElement('span');
                categoryTag.className = 'project-category';
                categoryTag.textContent = category;
                item.appendChild(categoryTag);
            }
            if (title && itemInfo && !itemInfo.querySelector('h4')) {
                const titleElement = document.createElement('h4');
                titleElement.textContent = title;
                itemInfo.appendChild(titleElement);
            }
            
            item.addEventListener('click', () => openModal(item));
            item.logicAttached = true;
        });

        // Функция обработки текста (параграфы)
        const processParagraphs = (text, container) => {
            container.innerHTML = '';
            if (!text) return;
            text.split('||').forEach(pText => {
                const p = document.createElement('p');
                p.textContent = pText.trim();
                container.appendChild(p);
            });
        };
        
        // Функция рендера деталей
        const renderDetailsContent = (detailsString) => {
            detailsContentContainer.innerHTML = '';
            if (!detailsString) return;
            
            // Создаем контейнеры
            const summaryContainer = document.createElement('div');
            summaryContainer.className = 'equipment-tags-summary';
            const breakdownContainer = document.createElement('div');
            breakdownContainer.className = 'detailed-info-container';

            const parts = detailsString.split(';').map(s => s.trim());
            
            // 1. Summary (теги)
            const summaryItems = (parts[0].split(':')[1] || '').split(',');
            summaryItems.forEach(equip => {
                if(equip.trim()){
                    const tag = document.createElement('span');
                    tag.className = 'equipment-tag';
                    tag.textContent = equip.trim();
                    summaryContainer.appendChild(tag);
                }
            });
            
            // 2. Детальный список
            parts.slice(1).forEach(catStr => {
                const [catName, items] = catStr.split(':');
                if(catName && items) {
                    const catDiv = document.createElement('div');
                    catDiv.className = 'detail-category';
                    catDiv.innerHTML = `<h4>${catName.trim()}</h4><p>${items.trim()}</p>`;
                    breakdownContainer.appendChild(catDiv);
                }
            });
            
            // 3. Стрелка
            const arrow = document.createElement('span');
            arrow.className = 'details-arrow';
            arrow.innerHTML = '›';
            const oldArrow = detailsTrigger.querySelector('.details-arrow');
            if(oldArrow) oldArrow.replaceWith(arrow);

            detailsContentContainer.appendChild(summaryContainer);
            detailsContentContainer.appendChild(breakdownContainer);
        };
        
        const toggleDetails = () => detailsContentContainer.classList.toggle('is-open');

        const openModal = (item) => {
            modalTitle.textContent = item.dataset.title;
            modalVideoContainer.innerHTML = item.dataset.videoEmbed || '';
            processParagraphs(item.dataset.task, modalTask);
            processParagraphs(item.dataset.process, modalProcess);
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

        const closeModal = () => {
            modalOverlay.classList.remove('active');
            document.documentElement.classList.remove('body-no-scroll');
            modalVideoContainer.innerHTML = '';
            detailsContentContainer.classList.remove('is-open');
            const cursor = document.querySelector('.custom-cursor');
            if(cursor) cursor.classList.remove('hidden');
        };

        // Привязка событий модального окна (удаляем старые, если были, чтобы не дублировать)
        modalCloseBtn.replaceWith(modalCloseBtn.cloneNode(true));
        const newModalCloseBtn = document.querySelector('.modal-close');
        newModalCloseBtn.addEventListener('click', closeModal);

        modalOverlay.onclick = (e) => { if (e.target === modalOverlay) closeModal(); };
        detailsTrigger.onclick = toggleDetails; // Используем onclick для простоты замены
        
        if (!document.escListenerAttached) {
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && modalOverlay.classList.contains('active')) closeModal();
            });
            document.escListenerAttached = true;
        }
    };

    loadPortfolio();
});