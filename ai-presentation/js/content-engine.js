// ========================================
// CONTENT ENGINE
// Генерирует уникальный контент для каждого слайда
// ========================================

class ContentEngine {
    constructor() {
        this.usedTitles = new Set();
        this.usedLayouts = [];
    }

    async generateAllSlides(structure, research, designSystem, images, context) {
        this.usedTitles.clear();
        this.usedLayouts = [];
        
        const allSlides = [];
        let slideIndex = 0;

        for (const section of structure.sections) {
            for (let i = 0; i < section.slides.length; i++) {
                const slideData = section.slides[i];
                
                // Генерируем уникальный заголовок
                const title = this.generateUniqueTitle(slideData, section, research, context);
                
                // Генерируем контент
                const content = this.generateContent(slideData, section, research, context, i);
                
                // Выбираем лэйаут (не повторяем последние 2)
                const layout = this.pickLayout(slideData, content, images, slideIndex);
                
                // Назначаем изображение
                const image = this.assignImage(slideData, images, slideIndex);
                
                allSlides.push({
                    id: slideIndex + 1,
                    section: section.section,
                    type: slideData.type || 'content',
                    title,
                    content,
                    layout,
                    image: image?.url || null,
                    imageData: image || null,
                    speakerNotes: this.generateSpeakerNotes(title, content, context),
                    index: slideIndex
                });
                
                slideIndex++;
            }
        }

        return allSlides;
    }

    generateUniqueTitle(slideData, section, research, context) {
        // Если это специальный слайд (hero, cta) — используем его заголовок
        if (['hero', 'cta', 'agenda', 'summary'].includes(slideData.type)) {
            return slideData.title;
        }

        const topic = context.topic;
        const sectionName = section.section;
        const facts = research?.facts || [];
        
        // Генерируем варианты заголовков
        const options = this.generateTitleOptions(topic, sectionName, facts, research);
        
        // Выбираем первый неиспользованный
        for (const option of options) {
            if (!this.usedTitles.has(option)) {
                this.usedTitles.add(option);
                return option;
            }
        }
        
        return options[0];
    }

    generateTitleOptions(topic, section, facts, research) {
        const options = [];
        
        // Базовые паттерны
        const patterns = [
            `${section}: ${topic}`,
            `Как ${topic} ${this.randomVerb()}`,
            `${this.randomAdjective()} ${topic}`,
            `Почему ${topic} ${this.randomVerb()}`,
            `${topic} в цифрах`,
            `История ${topic}`,
            `Будущее ${topic}`,
            `${topic} и его влияние`,
            `Секреты ${topic}`,
            `Правда о ${topic}`
        ];
        
        // Добавляем факты в заголовки
        if (facts.length > 0) {
            const randomFact = facts[Math.floor(Math.random() * facts.length)];
            const shortFact = randomFact.length > 60 ? randomFact.substring(0, 57) + '...' : randomFact;
            options.push(shortFact);
        }
        
        // Добавляем паттерны
        options.push(...patterns.map(p => p.replace('undefined', '').trim()).filter(Boolean));
        
        // Перемешиваем
        return options.sort(() => Math.random() - 0.5);
    }

    generateContent(slideData, section, research, context, position) {
        // Используем факты из исследования
        const facts = research?.facts || [];
        const stats = research?.statistics || [];
        
        if (facts.length > 0) {
            // Берём факты для этого слайда
            const startIdx = position * 3;
            const slideFacts = facts.slice(startIdx, startIdx + 3);
            
            if (slideFacts.length > 0) {
                let content = slideFacts.join(' ');
                
                // Добавляем статистику если есть
                if (stats.length > position) {
                    content += ` Интересный факт: ${stats[position]}.`;
                }
                
                return content;
            }
        }
        
        // Fallback
        return `${section.section} — важная часть понимания ${context.topic}. Исследования показывают значимость этой темы для ${context.audience}.`;
    }

    pickLayout(slideData, content, images, index) {
        // Не повторяем последние 2 лэйаута
        const recentLayouts = this.usedLayouts.slice(-2);
        
        const availableLayouts = [
            'content', 'two_column', 'image_right', 'image_left', 
            'split', 'stats', 'comparison', 'timeline'
        ].filter(l => !recentLayouts.includes(l));
        
        let layout;
        
        if (slideData.layout && !recentLayouts.includes(slideData.layout)) {
            layout = slideData.layout;
        } else if (images?.length > index && availableLayouts.includes('image_right')) {
            layout = Math.random() > 0.5 ? 'image_right' : 'image_left';
        } else if (content.length > 400 && availableLayouts.includes('two_column')) {
            layout = 'two_column';
        } else if (content.length > 250 && availableLayouts.includes('split')) {
            layout = 'split';
        } else {
            layout = availableLayouts[0] || 'content';
        }
        
        this.usedLayouts.push(layout);
        return layout;
    }

    assignImage(slideData, images, index) {
        if (!images || images.length === 0) return null;
        return images[index % images.length] || null;
    }

    generateSpeakerNotes(title, content, context) {
        return `Слайд: ${title}.
Контекст: ${context.topic} для ${context.audience}.
Ключевая мысль: ${content.substring(0, 100)}...
Говорите уверенно, поддерживайте зрительный контакт.`;
    }

    randomVerb() {
        const verbs = ['работает', 'живёт', 'развивается', 'влияет', 'меняется', 'существует', 'функционирует'];
        return verbs[Math.floor(Math.random() * verbs.length)];
    }

    randomAdjective() {
        const adjectives = ['удивительный', 'невероятный', 'уникальный', 'захватывающий', 'впечатляющий'];
        return adjectives[Math.floor(Math.random() * adjectives.length)];
    }
}
