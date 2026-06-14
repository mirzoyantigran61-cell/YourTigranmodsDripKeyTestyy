// ========================================
// AI PRESENTATION ORCHESTRATOR
// Мозг системы — управляет всеми модулями
// ========================================

class AIPresentationOrchestrator {
    constructor() {
        this.researchEngine = new ResearchEngine();
        this.structureEngine = new StructureEngine();
        this.designEngine = new DesignEngine();
        this.imageEngine = new ImageEngine();
        this.contentEngine = new ContentEngine();
        this.qualityChecker = new QualityChecker();
        this.currentProject = null;
    }

    /**
     * ГЛАВНЫЙ МЕТОД — входная точка
     */
    async createPresentation(userInput, options = {}) {
        console.log('🚀 ORCHESTRATOR: Starting full pipeline...');
        this.notify('Анализирую запрос...', 5);

        // 1. ПОНИМАНИЕ ЗАПРОСА
        const context = this.understandRequest(userInput, options);
        this.notify('Исследую тему...', 15);

        // 2. ИССЛЕДОВАНИЕ
        const research = await this.researchEngine.deepResearch(context);
        this.notify('Создаю структуру...', 35);

        // 3. СТРУКТУРА И НАРРАТИВ
        const structure = await this.structureEngine.buildStructure(context, research);
        this.notify('Разрабатываю дизайн...', 50);

        // 4. ДИЗАЙН-СИСТЕМА
        const designSystem = this.designEngine.createDesignSystem(context);

        // 5. ПОИСК ИЗОБРАЖЕНИЙ
        const images = await this.imageEngine.collectImages(context, research, options.userImages || []);
        this.notify('Генерирую контент...', 65);

        // 6. ГЕНЕРАЦИЯ КОНТЕНТА ДЛЯ КАЖДОГО СЛАЙДА
        const slides = await this.contentEngine.generateAllSlides(structure, research, designSystem, images, context);

        // 7. КОНТРОЛЬ КАЧЕСТВА
        this.notify('Проверяю качество...', 85);
        const checkedSlides = this.qualityChecker.validateAll(slides, designSystem);

        // 8. СБОРКА ПРОЕКТА
        this.notify('Собираю презентацию...', 95);

        this.currentProject = {
            title: context.topic,
            subtitle: this.generateSubtitle(context, research),
            slides: checkedSlides,
            designSystem,
            research,
            images,
            context
        };

        this.notify('Готово!', 100);
        return this.currentProject;
    }

    /**
     * Понимание запроса пользователя
     */
    understandRequest(input, options) {
        const lower = input.toLowerCase();
        
        return {
            rawInput: input,
            topic: this.extractTopic(input),
            language: this.detectLanguage(input),
            style: options.style || this.detectStyle(input),
            audience: options.audience || this.detectAudience(input),
            purpose: options.purpose || this.detectPurpose(input),
            slideCount: options.slideCount || this.extractSlideCount(input),
            hasUserImages: (options.userImages || []).length > 0
        };
    }

    extractTopic(input) {
        return input
            .replace(/создай|сделай|напиши|построй|create|make|generate|build/gi, '')
            .replace(/презентаци[юя]|презу|presentation|slide deck/gi, '')
            .replace(/про|о|на тему|по теме|about|on|regarding/gi, '')
            .replace(/красивую|профессиональную|beautiful|professional/gi, '')
            .replace(/\d+\s*(?:слайд|slide|слайдов|slides)/gi, '')
            .trim() || 'Презентация';
    }

    detectLanguage(text) {
        if (/[ա-ֆ]/.test(text)) return 'hy';
        if (/[а-яё]/.test(text)) return 'ru';
        return 'en';
    }

    detectStyle(text) {
        const l = text.toLowerCase();
        if (/киберпанк|cyberpunk|neon|неон/.test(l)) return 'cyberpunk';
        if (/игр|game|gaming/.test(l)) return 'gaming';
        if (/бизнес|business|corporate|компан/.test(l)) return 'corporate';
        if (/стартап|startup|pitch/.test(l)) return 'startup';
        if (/учеб|школ|education|school/.test(l)) return 'educational';
        return 'cyberpunk';
    }

    detectAudience(text) {
        const l = text.toLowerCase();
        if (/инвестор|investor|pitch/.test(l)) return 'Investors';
        if (/студент|ученик|student|school/.test(l)) return 'Students';
        if (/клиент|client|customer/.test(l)) return 'Clients';
        if (/команд|team|employee/.test(l)) return 'Team';
        return 'General';
    }

    detectPurpose(text) {
        const l = text.toLowerCase();
        if (/прода|sell|pitch|убедить/.test(l)) return 'Sell/Pitch';
        if (/обуч|educate|teach|научить/.test(l)) return 'Educate';
        if (/отчёт|report|анализ/.test(l)) return 'Report';
        if (/вдохнов|inspire|мотив/.test(l)) return 'Inspire';
        return 'Inform';
    }

    extractSlideCount(text) {
        const m = text.match(/(\d+)\s*(?:слайд|slide|слайдов|slides)/i);
        return m ? Math.min(Math.max(parseInt(m[1]), 5), 50) : 10;
    }

    generateSubtitle(context, research) {
        if (research?.wikipedia?.extract) {
            const firstSentence = research.wikipedia.extract.split('.')[0];
            return firstSentence.length > 100 ? firstSentence.substring(0, 97) + '...' : firstSentence;
        }
        return `${context.purpose} • ${context.audience} • ${new Date().getFullYear()}`;
    }

    notify(message, progress) {
        const statusEl = document.getElementById('presentationStatus');
        const progressBar = document.getElementById('presentationProgressBar');
        if (statusEl) statusEl.textContent = message;
        if (progressBar) progressBar.style.width = progress + '%';
        console.log(`📢 [${progress}%] ${message}`);
    }
}

const orchestrator = new AIPresentationOrchestrator();
console.log('✅ Orchestrator initialized');
