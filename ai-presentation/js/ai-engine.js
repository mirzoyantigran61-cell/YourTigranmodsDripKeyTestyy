// ========================================
// AI PRESENTATION ENGINE v5.0 PRO
// Полная переработка — профессиональный AI
// ========================================

class AIPresentationEngine {
    constructor() {
        this.currentPresentation = null;
        this.slides = [];
        this.designSystem = null;
    }

    getApiKey() {
        const keyInput = document.getElementById('openaiApiKey');
        if (keyInput && keyInput.value.trim()) return keyInput.value.trim();
        if (APP_CONFIG?.ai?.openai?.apiKey && APP_CONFIG.ai.openai.apiKey.length > 10) return APP_CONFIG.ai.openai.apiKey;
        return null;
    }

    /**
     * ГЛАВНЫЙ МЕТОД — полный цикл генерации
     */
    async analyzePrompt(prompt) {
        console.log('🤖 AI Engine v5.0 PRO запущен');
        const apiKey = this.getApiKey();
        if (!apiKey) throw new Error('Введи OpenAI API ключ');

        // 1. Локальный анализ запроса
        const topic = this.extractTopic(prompt);
        const style = this.detectStyle(prompt);
        const slideCount = this.extractSlideCount(prompt);
        const audience = this.detectAudience(prompt);
        const purpose = this.detectPurpose(prompt);
        const lang = this.detectLanguage(prompt);

        this.designSystem = APP_CONFIG?.themes?.[style] || this.getDefaultTheme();

        // 2. Поиск информации в интернете
        let researchData = null;
        try {
            if (typeof researchEngine !== 'undefined') {
                researchData = await researchEngine.research(topic, lang);
                console.log('📚 Найдено:', researchData?.wikipedia ? 'Wikipedia ✅' : 'Wikipedia ❌', researchData?.images?.length || 0, 'изображений');
            }
        } catch (e) { console.log('⚠️ Research skipped'); }

        // 3. Генерация через OpenAI
        const aiResult = await this.callOpenAI(prompt, slideCount, topic, audience, purpose, researchData, apiKey);

        // 4. Добавляем изображения к слайдам
        if (researchData?.images?.length > 0) {
            aiResult.slides.forEach((slide, i) => {
                if (!slide.image) slide.image = researchData.images[i % researchData.images.length];
            });
        }
        // Добавляем загруженные пользователем изображения
        if (typeof uploadedSlideImages !== 'undefined' && uploadedSlideImages.length > 0) {
            aiResult.slides.forEach((slide, i) => {
                if (uploadedSlideImages[i % uploadedSlideImages.length]) {
                    slide.userImage = uploadedSlideImages[i % uploadedSlideImages.length].dataUrl;
                }
            });
        }

        return {
            ...aiResult,
            topic, style, slideCount, audience, purpose, lang,
            designSystem: this.designSystem,
            research: researchData
        };
    }

    /**
     * Вызов OpenAI с контекстом исследования
     */
    async callOpenAI(prompt, slideCount, topic, audience, purpose, researchData, apiKey) {
        // Собираем контекст
        let contextPrompt = '';
        if (researchData?.wikipedia?.extract) {
            contextPrompt += `\n\nИСТОЧНИК (Wikipedia):\n${researchData.wikipedia.extract.substring(0, 2000)}\n`;
        }
        if (typeof uploadedSlideImages !== 'undefined' && uploadedSlideImages.length > 0) {
            contextPrompt += `\n\nПОЛЬЗОВАТЕЛЬ ЗАГРУЗИЛ ${uploadedSlideImages.length} изображений. Используй их в слайдах.\n`;
        }

        const systemPrompt = `Ты — профессиональный дизайнер презентаций мирового уровня.
Тема: "${topic}"
Аудитория: ${audience}
Цель: ${purpose}
Слайдов: ${slideCount}
${contextPrompt}

СОЗДАЙ УНИКАЛЬНУЮ ПРЕЗЕНТАЦИЮ.
ВАЖНЕЙШИЕ ПРАВИЛА:
1. Каждый слайд должен иметь УНИКАЛЬНОЕ название, ОТРАЖАЮЩЕЕ СОДЕРЖАНИЕ.
2. ЗАПРЕЩЕНЫ шаблонные названия: "Overview", "Analysis", "Examples", "Key Points", "Deep Dive", "Introduction", "Conclusion".
3. Используй ТОЛЬКО конкретные названия по теме.
4. Каждый слайд должен содержать 3-6 предложений содержательного текста.
5. Используй факты из источников.
6. Для бизнес-тем добавляй SWOT, цифры, конкурентов.
7. Для исторических тем добавляй даты, события, карты.
8. Для тем про животных добавляй классификацию, среду обитания, поведение.

ФОРМАТ ОТВЕТА (только JSON):
{
  "title": "Креативный заголовок",
  "subtitle": "Подзаголовок",
  "slides": [
    {"title": "Конкретное название", "content": "Содержательный текст 3-6 предложений", "type": "hero"},
    {"title": "Ещё одно конкретное название", "content": "Текст...", "type": "content"},
    {"title": "Финальное название", "content": "Текст...", "type": "cta"}
  ]
}`;

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: prompt }
                ],
                max_tokens: 4000,
                temperature: 0.85
            })
        });

        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            if (response.status === 401) throw new Error('Неверный API ключ');
            if (response.status === 429) throw new Error('Закончились кредиты OpenAI');
            throw new Error(err.error?.message || `Ошибка ${response.status}`);
        }

        const data = await response.json();
        const text = data.choices[0].message.content;
        
        // Парсим JSON (устойчивый)
        let jsonStr = text;
        const start = text.indexOf('{');
        const end = text.lastIndexOf('}');
        if (start >= 0 && end > start) jsonStr = text.substring(start, end + 1);
        
        const parsed = JSON.parse(jsonStr);
        console.log(`✅ Сгенерировано ${parsed.slides?.length || 0} слайдов`);
        return parsed;
    }

    // ========== ЛОКАЛЬНЫЕ АНАЛИЗАТОРЫ ==========

    detectStyle(prompt) {
        const l = prompt.toLowerCase();
        if (/cyberpunk|neon|киберпанк|неон/.test(l)) return 'cyberpunk';
        if (/gaming|game|игр|гейм/.test(l)) return 'gaming';
        if (/business|corporate|бизнес|корпорат/.test(l)) return 'modern';
        if (/school|education|учеб|школ/.test(l)) return 'educational';
        if (/startup|стартап|pitch/.test(l)) return 'startup';
        if (/luxury|premium|люкс/.test(l)) return 'luxury';
        return 'cyberpunk';
    }

    extractSlideCount(prompt) {
        const m = prompt.match(/(\d+)\s*(?:slide|слайд|слайдов|slides)/i);
        if (m) return Math.min(Math.max(parseInt(m[1]), 3), 30);
        // Умный подбор под тип презентации
        if (/business|pitch|стартап|бизнес/i.test(prompt)) return 10;
        if (/school|education|учеб/i.test(prompt)) return 8;
        return 7;
    }

    extractTopic(prompt) {
        return prompt
            .replace(/(?:create|make|generate|build|сделай|создай|напиши)\s+(?:a|an|the|me|мне|красивую|профессиональную)?\s*/gi, '')
            .replace(/(?:presentation|презентаци[юя]|презу)\s+(?:about|про|о|на тему|по теме)?\s*/gi, '')
            .replace(/(?:with|in|с|в)\s+\d+\s*(?:slide|слайд).*/gi, '')
            .replace(/\s+/g, ' ').trim().split(' ').slice(0, 8).join(' ') || 'Презентация';
    }

    detectAudience(prompt) {
        const l = prompt.toLowerCase();
        if (/investor|инвестор|pitch|funding/i.test(l)) return 'Инвесторы';
        if (/student|school|студент|школ|учеб/i.test(l)) return 'Студенты';
        if (/client|клиент|customer/i.test(l)) return 'Клиенты';
        if (/team|команд|employee/i.test(l)) return 'Команда';
        return 'Общая аудитория';
    }

    detectPurpose(prompt) {
        const l = prompt.toLowerCase();
        if (/sell|прода|pitch|продаж/i.test(l)) return 'Продажи / Питч';
        if (/educate|teach|обуч|учеб|лекц/i.test(l)) return 'Обучение';
        if (/report|отчёт|отчет|reporting/i.test(l)) return 'Отчёт';
        if (/inspire|вдохнов|motivate/i.test(l)) return 'Вдохновение';
        return 'Информирование';
    }

    detectLanguage(prompt) {
        if (/[ա-ֆ]/.test(prompt)) return 'hy';
        if (/[а-яА-ЯёЁ]/.test(prompt)) return 'ru';
        return 'en';
    }

    getDefaultTheme() {
        return {
            primary: '#FF0000', secondary: '#FF0055', accent: '#8B5CF6',
            background: '#090909', surface: '#171717',
            text: '#F5F5F5', textSecondary: '#B8B8B8',
            font: 'Orbitron'
        };
    }

    // ========== ГЕНЕРАЦИЯ СТРУКТУРЫ СЛАЙДОВ ==========

    generateSlideStructure(analysis) {
        if (!analysis?.slides?.length) return this.fallbackSlides(analysis);

        return analysis.slides.map((s, i) => ({
            id: i + 1,
            type: s.type || (i === 0 ? 'hero' : i === analysis.slides.length - 1 ? 'cta' : 'content'),
            title: s.title,
            content: s.content,
            image: s.image || null,
            userImage: s.userImage || null,
            layout: this.pickBestLayout(s, i, analysis.slides.length),
            speakerNotes: `Слайд ${i + 1}: ${s.title}. ${(s.content || '').substring(0, 120)}...`,
            index: i
        }));
    }

    /**
     * УМНЫЙ ВЫБОР ЛЭЙАУТА
     */
    pickBestLayout(slide, index, total) {
        if (index === 0) return 'hero';
        if (index === total - 1) return 'cta';
        if (slide.image || slide.userImage) return 'image_right';
        const text = slide.content || '';
        if (text.length > 400) return 'two_column';
        if (text.length > 250) return 'split';
        if (/сравнени|compar|vs|против/.test(text.toLowerCase())) return 'comparison';
        if (/\d+%|\d+\s*(?:million|billion|тыс|млн|млрд)/.test(text)) return 'stats';
        return 'content';
    }

    fallbackSlides(analysis) {
        const t = analysis?.topic || 'Тема';
        return [
            { id: 1, type: 'hero', title: t, content: `${t} — полный обзор`, layout: 'hero', index: 0 },
            { id: 2, type: 'content', title: `Что такое ${t}?`, content: `Подробный разбор темы ${t}.`, layout: 'content', index: 1 },
            { id: 3, type: 'content', title: `Ключевые факты о ${t}`, content: `Важная информация.`, layout: 'content', index: 2 },
            { id: 4, type: 'cta', title: 'Спасибо за внимание!', content: 'Вопросы?', layout: 'cta', index: 3 }
        ];
    }

    getPresentation() { return this.currentPresentation; }
    getSlide(i) { return this.slides[i] || null; }
    updateSlide(i, data) { if (this.slides[i]) Object.assign(this.slides[i], data); }
}

const aiEngine = new AIPresentationEngine();
console.log('✅ AI Engine v5.0 PRO готов');
