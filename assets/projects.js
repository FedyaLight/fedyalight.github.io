const projects = [
    {
        id: "aviation-lies",
        type: "both",
        year: "2025",
        title: "Самая Дорогая Ложь В Авиации",
        category: "Видео-эссе",
        image: "assets/project1.webp",
        videoEmbed: '<iframe width="480" height="270" src="https://dzen.ru/embed/oJkaGNFUJAAA?from_block=partner&from=zen&mute=0&autoplay=0&tv=0" allow="autoplay; fullscreen; accelerometer; gyroscope; picture-in-picture; encrypted-media" frameborder="0" scrolling="no" allowfullscreen></iframe>',
        task: "Трансформировать сухие технические отчеты, судебные протоколы с большим количеством исторического контекста в увлекательную историю и напряженный триллер, сохраняя максимальное удержание внимания зрителя.",
        process: "Проект реализован в формате минималистичной, но высокоэффективной «говорящей головы».|| Съемка проводилась в одной локации с использованием двухкамерного сетапа для создания монтажной динамики внутри длинных повествовательных блоков. || Отсутствие смены локаций компенсировалось плотной интеграцией архивных материалов и визуализаций, создавая эффект полного погружения в хронологию событий.",
        details: "Основное: Sony FX3, Tamron 28-75 f2.8, Zoom M3 Mictrack; Камера: Sony FX3, FX30; Оптика: Tamron 28-75 f2.8, Sigma 18-50mm f/2.8 DC DN; Свет: Colbor CL100X, CL60, CL60M. Weeylite s05; Звук: Zoom M3 Mictrack; Софт: DaVinci Resolve Studio, Unreal Engine 5"
    },
    {
        id: "aigel-clip",
        type: "both",
        year: "2025",
        title: "Студенческий музыкальный клип «Аигел»",
        category: "Музыкальное видео",
        image: "assets/project2.webp",
        videoEmbed: '<iframe width="480" height="270" src="https://dzen.ru/embed/oJkb1et4IAAA?from_block=partner&from=zen&mute=0&autoplay=0&tv=0" allow="autoplay; fullscreen; accelerometer; gyroscope; picture-in-picture; encrypted-media" data-qMBLjHVaE="embed-iframe" frameborder="0" scrolling="no" allowfullscreen></iframe>',
        task: "Визуализация сложных эмоциональных состояний и абстрактных концепций через выразительный видеоряд, вдохновленный музыкальным произведением.|| Максимальная творческая реализация и высокое художественное качество в условиях экстремально сжатых сроков и минимальных ресурсов.",
        process: "Проект реализован в формате «быстрого прототипирования» визуальной концепции, демонстрируя полный цикл производства от идеи до публикации всего за 3 дня. Создан вместе с одногрупниками, которые не являются актерами. || - Стратегическое решение: Фокус на создании эмоционально-интригующих арт-кадров, но минимизирующих потребность в сложном линейном сюжете. || - Съемка с использованием всего одной камеры и естественного / доступного освещения. Использование городской среды и ночных локаций.",
        details: "Основное: Sony FX30, Sigma 18-50mm f/2.8; Камеры: Sony FX30, JVC MG145; Оптика: Sigma 18-50mm f/2.8 DC DN; Стабилизация: Sony Gyrodata; Софт: DaVinci Resolve Studio"
    },
    {
        id: "cayman-stories",
        type: "both",
        year: "2024",
        title: "CAYMAN: Истории в Петербурге",
        category: "Имиджевое видео",
        image: "assets/project3.webp",
        videoEmbed: '<iframe width="480" height="270" src="https://dzen.ru/embed/oJltJ1-AIAAA?from_block=partner&from=zen&mute=0&autoplay=0&tv=0" allow="autoplay; fullscreen; accelerometer; gyroscope; picture-in-picture; encrypted-media" data-testid="embed-iframe" frameborder="0" scrolling="no" allowfullscreen></iframe>',
        task: "Создание эмоционально-вовлекающего имиджевого контента для социальных сетей клиента. || Создание ролика, который вызывает вдохновение, чувство принадлежности и желание «жить в этом городе/стиле».",
        process: "Проект реализован по методологии прототипирования для социальных сетей, демонстрируя полный цикл производства всего за 4 дня.||Особое внимание уделялось оптимизации для социальных сетей: Фокус на быстром, высококонтрастном монтаже.",
        details: "Основное: Sony FX30, Sirui Sniper set, Weeylite s05; Камера: Sony FX30; Оптика: Sirui Sniper 16mm, 23mm, 56mm f/1.2; Стабилизация: Zhiyun Crane 2S; Свет: Weeylite s05 3 шт.; Звук:Shure SM7B; Софт: DaVinci Resolve Studio"
    },
    {
        id: "berezin-secrets",
        type: "both",
        year: "2024",
        title: "Дмитрий Березин: Городские Секреты",
        category: "Имиджевое видео",
        image: "assets/project4.webp",
        videoEmbed: '<iframe width="480" height="270" src="https://dzen.ru/embed/oJlvp1-AIAAA?from_block=partner&from=zen&mute=0&autoplay=0&tv=0" allow="autoplay; fullscreen; accelerometer; gyroscope; picture-in-picture; encrypted-media" data-testid="embed-iframe" frameborder="0" scrolling="no" allowfullscreen></iframe>',
        task: "Связать бренд клиента с богатой историей и душой города. Проект подчеркивает глубокое понимание городской среды и ее культурной ценности.",
        process: "Проект был реализован за 2 дня: 1 день заняла репортажная съемка, 2 дня – монтаж. Изначально материал снимался без четкой концепции, но я предложил и воплотил уникальную идею имиджевого видео.",
        details: "Основное: Sony FX30, Sirui Sniper 23mm f/1.2, Zhiyun Crane 2S; Камера: Sony FX30; Оптика: Sirui Sniper 23mm f/1.2; Стабилизация: Zhiyun Crane 2S; Звук:Shure SM7B; Софт: DaVinci Resolve Studio"
    },
    {
        id: "pyro-concert",
        type: "both",
        year: "2023",
        title: "Репортаж с концерта Pyrokinesis",
        category: "Событийная съемка",
        image: "assets/pyro.webp",
        videoEmbed: '<iframe width="480" height="270" src="https://dzen.ru/embed/oJkZyfOQIAAA?from_block=partner&from=zen&mute=0&autoplay=0&tv=0" allow="autoplay; fullscreen; accelerometer; gyroscope; picture-in-picture; encrypted-media" data-testid="embed-iframe" frameborder="0" scrolling="no" allowfullscreen></iframe>',
        task: "Создание видеорепортажа, построенного по принципам сторителлинга. Требовалось раскрыть событие как целостную историю через линии: Артист, зрители, выступление.",
        process: "Материал был изначально структурирован на логические блоки. При монтаже блоки были выстроены не в хронологическом порядке, а в последовательности, создающей драматургическую структуру.",
        details: "Основное: Sony A7C, Tamron 28-75 f/2.8, Zoom H1n; Камера: Sony A7C; Оптика: Tamron 28-75 f/2.8; Свет: Weeylite s05; Звук: Boya BY-M1, Boya BY-MM1, Zoom H1n; Софт: DaVinci Resolve Studio"
    },
    {
        id: "shadow-forums",
        type: "editing",
        year: "2024",
        title: "История теневых форумов России. Коррупция, уби**тва, отмыв",
        category: "Видео-эссе",
        image: "assets/shmalz.webp",
        videoEmbed: '<iframe width="560" height="315" src="https://www.youtube.com/embed/jwNqhg0IMUU?si=jPg68OKHuy3x__Lq" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
        task: "Проект реализован в формате «говорящей головы». С использованием большого количества графики, вставок кадров хроники.",
        process: "Сложный монтаж с большим объемом ресерча и визуализации данных.",
        details: "Основное: DaVinci Resolve Studio"
    },
    {
        id: "dyla-roomtour",
        type: "editing",
        year: "2023",
        title: "Я ПЕРЕЕХАЛА! Рум тур КВАРТИРЫ! Реакция Инстасамки, Бустера и Дины Саевой",
        category: "Лайф-стайл",
        image: "assets/dyla.webp",
        videoEmbed: '<iframe width="560" height="315" src="https://www.youtube.com/embed/A54CQFEjlKA?si=oXSnYUV9yShBKqRM" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
        task: "Создание увлекательного видео с использованием большого количества мемов. Сортировка и структурирование огромного объема материала.",
        process: "Динамичный монтаж в стиле популярных блогеров, работа со звуком и графическими вставками.",
        details: "Основное: Adobe Premiere Pro, Adobe Audition, Adobe Photoshop"
    },
    {
        id: "doshik-brands",
        type: "editing",
        year: "2023",
        title: "ЧТО ЕСЛИ БЫ БРЕНДЫ БЫЛИ ЛЮДЬМИ?!",
        category: "Лайф-стайл",
        image: "assets/doshik.webp",
        videoEmbed: '<iframe width="560" height="315" src="https://www.youtube.com/embed/ACLe_0ZkVmc?si=yZgRoisst8GYhDAO" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
        task: "Создание увлекательного видео с использованием мемов. Отсмотр и вырезание моментов, отходящих от основной повествовательной линии.",
        process: "Плотный монтаж, акцент на юморе и динамике.",
        details: "Основное: Adobe Premiere Pro, Adobe Audition, Adobe Photoshop"
    }
];

window.projects = projects;
