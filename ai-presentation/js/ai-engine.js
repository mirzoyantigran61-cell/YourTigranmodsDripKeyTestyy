// ========================================
// AI PRESENTATION ENGINE v3.0
// Настоящая генерация через OpenAI
// ========================================

class AIPresentationEngine {
    constructor() {
        this.currentPresentation = null;
        this.slides = [];
        this.designSystem = null;
    }

    /**
     * Получить API ключ из поля ввода
     */
    getApiKey() {
        const keyInput = document.getElementById('openaiApiKey');
        if (keyInput && keyInput.value.trim()) {
            return keyInput.value.trim();
        }
        // Запасной: из config (если есть)
        if (APP_CONFIG.ai.openai.apiKey && APP_CONFIG.ai.openai.apiKey.length > 10) {
            return APP_CONFIG.ai.openai.apiKey;
        }
        return null;
    }

    /**
     * Главный метод — анализирует и генерирует ВСЁ через AI
     */
    async analyzePrompt(prompt) {
        console.log('🔍 AI Engine v3.0: Full AI Generation...');
        
        const apiKey = this.getApiKey();
        
        if (!apiKey) {
            throw new Error('Please enter your OpenAI API key to use AI features.');
        }
        
        // Определяем стиль локально
        const style = this.detectStyle(prompt);
        const slideCount = this.extractSlideCount(prompt);
        this.designSystem = APP_CONFIG.themes[style] || APP_CONFIG.themes.cyberpunk;
        
        // Генерируем ВСЁ через OpenAI
        const aiResult = await this.generateFullPresentation(prompt, slideCount, apiKey);
        
        return {
            ...aiResult,
            style: style,
            slideCount: slideCount,
            designSystem: this.designSystem
        };
    }

    /**
     * Генерация ПОЛНОЙ презентации через OpenAI
     */
    async generateFullPresentation(prompt, slideCount, apiKey) {
        console.log('🤖 Calling OpenAI for FULL presentation generation...');
        
        const systemPrompt = `You are a professional presentation designer AI.
        
        Create a COMPLETE presentation with DETAILED content for each slide.
        
        IMPORTANT RULES:
        - Generate EXACTLY ${slideCount} slides
        - Each slide MUST have a title AND detailed content (3-5 sentences minimum)
        - Content must be SPECIFIC to the topic, not generic templates
        - Include facts, statistics, examples where relevant
        - Use professional language
        
        Return ONLY valid JSON in this exact format:
        {
            "title": "Catchy Presentation Title",
            "subtitle": "Descriptive subtitle",
            "slides": [
                {
                    "title": "Slide Title Here",
                    "content": "Detailed paragraph about this slide topic. Include specific information, facts, and insights. Make it informative and engaging. At least 3-4 sentences.",
                    "type": "hero"
                },
                {
                    "title": "Another Slide",
                    "content": "Another detailed paragraph with specific information about this topic. Include relevant details and explanations.",
                    "type": "content"
                }
            ]
        }
        
        Slide types: "hero" (first slide), "cta" (last slide), "content" (middle slides).
        Make the first slide type "hero" and the last slide type "cta".`;

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini', // Быстрая и дешёвая модель
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: prompt }
                ],
                max_tokens: 4000,
                temperature: 0.8
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'OpenAI API error');
        }

        const data = await response.json();
        const content = data.choices[0].message.content;
        
        // Парсим JSON
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error('Invalid AI response format');
        
        const parsed = JSON.parse(jsonMatch[0]);
        
        console.log(`✅ AI generated ${parsed.slides.length} slides with full content!`);
        
        return parsed;
    }

    /**
     * Определяет стиль из запроса
     */
    detectStyle(prompt) {
        const lower = prompt.toLowerCase();
        if (lower.includes('cyberpunk') || lower.includes('neon') || lower.includes('киберпанк')) return 'cyberpunk';
        if (lower.includes('gaming') || lower.includes('game') || lower.includes('игр')) return 'gaming';
        if (lower.includes('modern') || lower.includes('minimal') || lower.includes('современ')) return 'modern';
        if (lower.includes('business') || lower.includes('corporate') || lower.includes('бизнес')) return 'modern';
        return 'cyberpunk';
    }

    /**
     * Извлекает количество слайдов
     */
    extractSlideCount(prompt) {
        const patterns = [
            /(\d+)[\s\-]*(?:slide|слайд|slides|слайдов)/i,
            /(?:slide|слайд)[\s\-]*(\d+)/i,
            /(\d+)[\s\-]*(?:page|страниц)/i
        ];
        for (const pattern of patterns) {
            const match = prompt.match(pattern);
            if (match) {
                const count = parseInt(match[1]);
                return Math.min(Math.max(count, 3), 30);
            }
        }
        return 5; // По умолчанию 5 слайдов
    }

    /**
     * Генерирует структуру слайдов из AI результата
     */
    generateSlideStructure(analysis) {
        if (!analysis.slides || analysis.slides.length === 0) {
            return this.fallbackStructure(analysis);
        }
        
        return analysis.slides.map((slide, i) => ({
            id: i + 1,
            type: slide.type || (i === 0 ? 'hero' : i === analysis.slides.length - 1 ? 'cta' : 'content'),
            title: slide.title,
            content: slide.content,
            layout: i === 0 ? 'hero' : i === analysis.slides.length - 1 ? 'cta' : 'content',
            imagePrompt: this.generateImagePrompt(slide.title, analysis.style || 'cyberpunk'),
            speakerNotes: `Present this slide about "${slide.title}" with confidence. ${slide.content ? slide.content.substring(0, 100) : ''}...`,
            index: i
        }));
    }

    /**
     * Запасная структура если AI не сработал
     */
    fallbackStructure(analysis) {
        const slides = [];
        const titles = ['Introduction', 'Overview', 'Key Points', 'Analysis', 'Conclusion'];
        
        for (let i = 0; i < titles.length; i++) {
            slides.push({
                id: i + 1,
                type: i === 0 ? 'hero' : i === titles.length - 1 ? 'cta' : 'content',
                title: analysis.title || titles[i],
                content: `Content for ${titles[i].toLowerCase()} about ${analysis.topic || 'this topic'}.`,
                layout: i === 0 ? 'hero' : i === titles.length - 1 ? 'cta' : 'content',
                speakerNotes: `Present this slide clearly and confidently.`,
                index: i
            });
        }
        
        return slides;
    }

    /**
     * Генерирует промпт для изображения
     */
    generateImagePrompt(title, style) {
        const stylePrompts = {
            cyberpunk: 'cyberpunk style, neon lighting, dark futuristic, holographic, 8K',
            gaming: 'gaming aesthetic, RGB, epic, game art, dynamic, 8K',
            modern: 'modern minimalist, clean, professional, sleek, 8K'
        };
        const baseStyle = stylePrompts[style] || stylePrompts.cyberpunk;
        return `${title} — ${baseStyle}, cinematic, professional presentation background`;
    }

    getPresentation() { return this.currentPresentation; }
    getSlide(index) { return this.slides[index] || null; }
    updateSlide(index, updates) {
        if (this.slides[index]) {
            this.slides[index] = { ...this.slides[index], ...updates };
        }
    }
}

const aiEngine = new AIPresentationEngine();
console.log('✅ AI Engine v3.0 ready — Full AI Generation Mode');
