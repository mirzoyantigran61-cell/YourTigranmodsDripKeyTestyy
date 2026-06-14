// ========================================
// AI PRESENTATION ENGINE
// Сердце AI — анализирует, планирует, генерирует
// ========================================

class AIPresentationEngine {
    constructor() {
        this.currentPresentation = null;
        this.slides = [];
        this.designSystem = null;
        this.isProcessing = false;
    }

    /**
     * Главный метод — анализирует запрос пользователя
     */
    async analyzePrompt(prompt) {
    console.log('🔍 AI Engine: Analyzing prompt...');
    
    // Определяем стиль
    const style = this.detectStyle(prompt);
    const slideCount = this.extractSlideCount(prompt);
    const topic = this.extractTopic(prompt);
    const audience = this.detectAudience(prompt);
    const purpose = this.detectPurpose(prompt);
    this.designSystem = APP_CONFIG.themes[style] || APP_CONFIG.themes.cyberpunk;
    
    // Пробуем OpenAI API
    try {
        const enhanced = await this.callOpenAI(prompt);
        if (enhanced) {
            console.log('✅ OpenAI enhancement applied!');
            return {
                ...enhanced,
                style: style,
                slideCount: slideCount,
                designSystem: this.designSystem
            };
        }
    } catch (e) {
        console.log('⚠️ OpenAI fallback:', e.message);
    }
    
    // Локальный анализ
    return {
        topic: topic,
        style: style,
        slideCount: slideCount,
        audience: audience,
        purpose: purpose,
        title: this.generateTitle(prompt, topic),
        subtitle: this.generateSubtitle(audience, purpose),
        designSystem: this.designSystem
    };
}

    /**
     * Определяет стиль презентации из запроса
     */
    detectStyle(prompt) {
        const lower = prompt.toLowerCase();
        
        if (lower.includes('cyberpunk') || lower.includes('neon') || lower.includes('киберпанк')) return 'cyberpunk';
        if (lower.includes('gaming') || lower.includes('game') || lower.includes('игр')) return 'gaming';
        if (lower.includes('modern') || lower.includes('minimal') || lower.includes('современ')) return 'modern';
        if (lower.includes('business') || lower.includes('corporate') || lower.includes('бизнес')) return 'modern';
        if (lower.includes('startup') || lower.includes('стартап') || lower.includes('pitch')) return 'modern';
        
        return 'cyberpunk'; // Твой стандартный стиль
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
                return Math.min(Math.max(count, 3), APP_CONFIG.presentation.maxSlides);
            }
        }
        
        return APP_CONFIG.presentation.defaultSlideCount;
    }

    /**
     * Извлекает тему
     */
    extractTopic(prompt) {
        // Убираем технические слова
        const clean = prompt
            .replace(/(?:create|make|generate|build|сделай|создай)\s+(?:a|an|the|me|мне)?\s*/gi, '')
            .replace(/(?:presentation|презентаци[юя])\s+(?:about|про|о|на тему)?\s*/gi, '')
            .replace(/(?:with|in|с|в)\s+(?:\d+\s*(?:slide|слайд).*?style.*$)/gi, '')
            .replace(/\s+/g, ' ')
            .trim();
        
        // Берём первые 5-7 слов
        const words = clean.split(' ').slice(0, 7);
        let topic = words.join(' ');
        
        // Делаем первую букву заглавной
        topic = topic.charAt(0).toUpperCase() + topic.slice(1);
        
        return topic || 'Professional Presentation';
    }

    /**
     * Определяет аудиторию
     */
    detectAudience(prompt) {
        const lower = prompt.toLowerCase();
        
        if (lower.includes('investor') || lower.includes('инвестор') || lower.includes('pitch')) return 'Investors';
        if (lower.includes('student') || lower.includes('school') || lower.includes('студент') || lower.includes('школ')) return 'Students';
        if (lower.includes('client') || lower.includes('клиент') || lower.includes('customer')) return 'Clients';
        if (lower.includes('team') || lower.includes('команд') || lower.includes('employee')) return 'Team';
        if (lower.includes('gamer') || lower.includes('игрок') || lower.includes('gaming')) return 'Gamers';
        
        return 'General Audience';
    }

    /**
     * Определяет цель презентации
     */
    detectPurpose(prompt) {
        const lower = prompt.toLowerCase();
        
        if (lower.includes('sell') || lower.includes('прода') || lower.includes('pitch')) return 'Pitch / Sell';
        if (lower.includes('educate') || lower.includes('teach') || lower.includes('обуч') || lower.includes('учеб')) return 'Educational';
        if (lower.includes('report') || lower.includes('отчёт') || lower.includes('отчет')) return 'Report';
        if (lower.includes('inspire') || lower.includes('motivate') || lower.includes('вдохнов')) return 'Inspirational';
        
        return 'Informational';
    }

    /**
     * Генерирует заголовок
     */
    generateTitle(prompt, topic) {
        // Если есть вопросительный знак — делаем заголовок-ответ
        if (prompt.includes('?')) {
            return topic.replace(/^What is |^How to |^Why /i, '');
        }
        
        // Если тема короткая — добавляем усиление
        if (topic.split(' ').length <= 2) {
            const boosters = [
                `The Ultimate Guide to ${topic}`,
                `${topic}: A Complete Overview`,
                `Mastering ${topic}`,
                `${topic} Revolution`,
                `The Future of ${topic}`
            ];
            return boosters[Math.floor(Math.random() * boosters.length)];
        }
        
        return topic;
    }

    /**
     * Генерирует подзаголовок
     */
    generateSubtitle(audience, purpose) {
        const subtitles = {
            'Investors': 'Investment Opportunity Overview',
            'Students': 'Learning & Development Guide',
            'Clients': 'Solution Overview & Benefits',
            'Team': 'Team Strategy & Roadmap',
            'Gamers': 'Gaming Evolution & Features',
            'General Audience': 'Comprehensive Overview & Insights'
        };
        
        return `${subtitles[audience] || subtitles['General Audience']} | ${purpose}`;
    }

    /**
     * Вызов AI API для улучшения результатов
     */
    /**
 * Вызов OpenAI API
 */
async callOpenAI(prompt) {
    const config = APP_CONFIG.ai.openai;
    
    console.log('🤖 Calling OpenAI API...');
    
    const response = await fetch(config.endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.apiKey}`
        },
        body: JSON.stringify({
            model: APP_CONFIG.ai.model,
            messages: [
                {
                    role: 'system',
                    content: `You are a professional presentation designer AI. 
                    Create presentation structures with titles, subtitles, and slide content.
                    Always return valid JSON with this format:
                    {
                        "title": "Presentation Title",
                        "subtitle": "Subtitle or description",
                        "slides": [
                            {"title": "Slide 1", "content": "Content here", "type": "hero"},
                            {"title": "Slide 2", "content": "Content here", "type": "content"}
                        ]
                    }`
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            max_tokens: APP_CONFIG.ai.maxTokens,
            temperature: APP_CONFIG.ai.temperature
        })
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'API error');
    }
    
    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // Парсим JSON из ответа
    try {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            console.log('✅ OpenAI response parsed:', parsed.title);
            return parsed;
        }
    } catch (parseError) {
        console.log('⚠️ Could not parse JSON, using raw text');
    }
    
    return null;
}

    /**
     * Генерирует полную структуру слайдов
     */
    generateSlideStructure(analysis) {
        const { topic, slideCount, audience, purpose, style } = analysis;
        const slides = [];
        
        // Шаблоны структур под разные цели
        const structures = {
            'Pitch / Sell': [
                'Problem Statement',
                'Our Solution',
                'Market Opportunity',
                'How It Works',
                'Competitive Advantage',
                'Business Model',
                'Traction & Results',
                'Team',
                'Financial Projections',
                'Call to Action'
            ],
            'Educational': [
                'Learning Objectives',
                'Key Concepts',
                'Core Principles',
                'Practical Examples',
                'Case Studies',
                'Common Mistakes',
                'Best Practices',
                'Tools & Resources',
                'Summary & Takeaways',
                'Q&A'
            ],
            'Report': [
                'Executive Summary',
                'Methodology',
                'Key Findings',
                'Data Analysis',
                'Trends & Patterns',
                'Recommendations',
                'Implementation Plan',
                'Expected Outcomes',
                'Next Steps',
                'Appendix'
            ],
            'default': [
                'Introduction',
                'Overview',
                'Key Points',
                'Deep Dive',
                'Analysis',
                'Examples',
                'Benefits',
                'Future Outlook',
                'Conclusion',
                'Thank You'
            ]
        };
        
        const structure = structures[purpose] || structures['default'];
        const actualCount = Math.min(slideCount, structure.length);
        
        for (let i = 0; i < actualCount; i++) {
            const isFirst = i === 0;
            const isLast = i === actualCount - 1;
            
            slides.push({
                id: i + 1,
                type: isFirst ? 'hero' : (isLast ? 'cta' : 'content'),
                title: isFirst ? analysis.title : structure[i],
                content: isFirst ? analysis.subtitle : this.generateSlideContent(structure[i], analysis),
                layout: this.pickLayout(i, actualCount),
                imagePrompt: this.generateImagePrompt(structure[i], style),
                speakerNotes: this.generateSpeakerNote(structure[i], audience),
                index: i
            });
        }
        
        return slides;
    }

    /**
     * Генерирует контент для слайда
     */
    generateSlideContent(title, analysis) {
        const templates = [
            `Overview of ${title.toLowerCase()} for ${analysis.audience}`,
            `Key aspects and important information about ${title.toLowerCase()}`,
            `Detailed analysis of ${title.toLowerCase()} in the context of ${analysis.topic}`,
            `Practical insights and actionable strategies for ${title.toLowerCase()}`
        ];
        
        return templates[Math.floor(Math.random() * templates.length)];
    }

    /**
     * Выбирает лэйаут для слайда
     */
    pickLayout(index, total) {
        if (index === 0) return 'hero';
        if (index === total - 1) return 'cta';
        return index % 2 === 0 ? 'two_column' : 'title_content';
    }

    /**
     * Генерирует промпт для изображения
     */
    generateImagePrompt(title, style) {
        const stylePrompts = {
            cyberpunk: 'cyberpunk style, neon lighting, dark futuristic city, holographic elements, rain, volumetric fog',
            gaming: 'gaming aesthetic, RGB lighting, epic composition, game art style, dynamic',
            modern: 'modern minimalist, clean design, professional lighting, sleek, corporate'
        };
        
        const baseStyle = stylePrompts[style] || stylePrompts.cyberpunk;
        return `${title} — ${baseStyle}, 8K quality, cinematic, professional presentation background`;
    }

    /**
     * Генерирует заметки для спикера
     */
    generateSpeakerNote(title, audience) {
        const notes = {
            'Investors': `Present "${title}" with confidence. Focus on ROI and market opportunity. Be ready for questions about numbers and traction.`,
            'Students': `Explain "${title}" clearly. Use simple examples. Check for understanding before moving on.`,
            'Clients': `Present "${title}" focusing on benefits and solutions. Address pain points. Be consultative.`,
            'Gamers': `Present "${title}" with energy and excitement. Use gaming references. Keep it engaging.`,
            'default': `Present "${title}" clearly and confidently. Make eye contact. Engage the audience with questions.`
        };
        
        return notes[audience] || notes['default'];
    }

    /**
     * Получить текущую презентацию
     */
    getPresentation() {
        return this.currentPresentation;
    }

    /**
     * Получить конкретный слайд
     */
    getSlide(index) {
        return this.slides[index] || null;
    }

    /**
     * Обновить слайд
     */
    updateSlide(index, updates) {
        if (this.slides[index]) {
            this.slides[index] = { ...this.slides[index], ...updates };
        }
    }
}

// Создаём глобальный экземпляр
const aiEngine = new AIPresentationEngine();

console.log('✅ AI Engine initialized and ready');
