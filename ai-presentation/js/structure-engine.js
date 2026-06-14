// ========================================
// STRUCTURE ENGINE
// Строит нарратив и структуру секций
// ========================================

class StructureEngine {
    /**
     * Создаёт структуру презентации на основе темы и исследования
     */
    async buildStructure(context, research) {
        const purpose = context.purpose;
        const topic = context.topic;
        
        // Определяем тип контента по теме и исследованию
        const contentType = this.detectContentType(topic, research);
        
        // Выбираем структуру под тип контента
        const structure = this.getStructureForType(contentType, context, research);
        
        // Добавляем вступление и заключение
        const fullStructure = [
            { section: 'Opening', slides: this.createOpeningSlides(context, research) },
            ...structure,
            { section: 'Closing', slides: this.createClosingSlides(context, research) }
        ];
        
        // Распределяем слайды
        const totalSlides = context.slideCount;
        const distributed = this.distributeSlides(fullStructure, totalSlides);
        
        return {
            contentType,
            sections: distributed,
            narrative: this.buildNarrative(distributed, context),
            totalSlides
        };
    }

    detectContentType(topic, research) {
        const text = (research?.wikipedia?.extract || '') + ' ' + topic;
        const lower = text.toLowerCase();
        
        if (/animal|plant|species|животн|растен|вид|млекопитающ/.test(lower)) return 'biology';
        if (/history|war|empire|истор|войн|импер|древн/.test(lower)) return 'history';
        if (/business|company|market|бизнес|компан|рынок/.test(lower)) return 'business';
        if (/technology|software|tech|технолог|программ/.test(lower)) return 'technology';
        if (/country|city|geography|стран|город|географ/.test(lower)) return 'geography';
        if (/science|physics|chemistry|наук|физ|хим/.test(lower)) return 'science';
        if (/sport|game|спорт|игр/.test(lower)) return 'sports';
        if (/art|music|film|искусств|музык|фильм/.test(lower)) return 'arts';
        
        return 'general';
    }

    getStructureForType(contentType, context, research) {
        const structures = {
            biology: [
                { section: 'Classification', slides: 2 },
                { section: 'Physical Characteristics', slides: 2 },
                { section: 'Habitat & Distribution', slides: 2 },
                { section: 'Behavior & Diet', slides: 2 },
                { section: 'Reproduction & Life Cycle', slides: 1 },
                { section: 'Conservation Status', slides: 1 },
                { section: 'Interesting Facts', slides: 1 }
            ],
            history: [
                { section: 'Historical Context', slides: 2 },
                { section: 'Timeline of Events', slides: 3 },
                { section: 'Key Figures', slides: 2 },
                { section: 'Impact & Legacy', slides: 2 },
                { section: 'Modern Relevance', slides: 1 }
            ],
            business: [
                { section: 'Market Overview', slides: 2 },
                { section: 'Competitive Landscape', slides: 2 },
                { section: 'Business Model', slides: 2 },
                { section: 'Financial Analysis', slides: 2 },
                { section: 'Future Outlook', slides: 1 }
            ],
            technology: [
                { section: 'Technology Overview', slides: 2 },
                { section: 'How It Works', slides: 2 },
                { section: 'Applications', slides: 2 },
                { section: 'Advantages & Limitations', slides: 2 },
                { section: 'Future Trends', slides: 1 }
            ],
            geography: [
                { section: 'Location & Geography', slides: 2 },
                { section: 'Culture & People', slides: 2 },
                { section: 'Economy', slides: 2 },
                { section: 'Tourism & Attractions', slides: 2 },
                { section: 'Interesting Facts', slides: 1 }
            ],
            general: [
                { section: 'Introduction & Background', slides: 2 },
                { section: 'Key Aspects', slides: 3 },
                { section: 'Analysis & Insights', slides: 2 },
                { section: 'Practical Applications', slides: 2 },
                { section: 'Summary & Takeaways', slides: 1 }
            ]
        };
        
        return structures[contentType] || structures.general;
    }

    createOpeningSlides(context, research) {
        return [
            {
                type: 'hero',
                purpose: 'title',
                title: context.topic,
                content: this.generateHeroContent(context, research),
                layout: 'hero',
                importance: 'critical'
            },
            {
                type: 'agenda',
                purpose: 'overview',
                title: `Что вы узнаете о ${context.topic}`,
                content: [],
                layout: 'agenda',
                importance: 'high'
            }
        ];
    }

    createClosingSlides(context, research) {
        return [
            {
                type: 'summary',
                purpose: 'key_takeaways',
                title: `Главное о ${context.topic}`,
                content: [],
                layout: 'summary',
                importance: 'high'
            },
            {
                type: 'cta',
                purpose: 'call_to_action',
                title: 'Спасибо за внимание!',
                content: 'Вопросы?',
                layout: 'cta',
                importance: 'critical'
            }
        ];
    }

    generateHeroContent(context, research) {
        if (research?.wikipedia?.extract) {
            const first = research.wikipedia.extract.split('.')[0];
            return first.length > 120 ? first.substring(0, 117) + '...' : first;
        }
        return `Полный обзор • ${context.audience} • ${new Date().getFullYear()}`;
    }

    distributeSlides(structure, totalSlides) {
        // Распределяем слайды по секциям пропорционально
        let totalRequested = 0;
        structure.forEach(s => totalRequested += s.slides);
        
        const scale = totalSlides / totalRequested;
        
        structure.forEach(s => {
            s.slides = Math.max(1, Math.round(s.slides * scale));
        });
        
        return structure;
    }

    buildNarrative(structure, context) {
        return {
            hook: `Узнайте всё о ${context.topic}`,
            journey: structure.map(s => s.section).join(' → '),
            callToAction: 'Готовы узнать больше?'
        };
    }
}
