// ========================================
// RESEARCH ENGINE v2.0
// Глубокое исследование темы
// ========================================

class ResearchEngine {
    constructor() {
        this.cache = new Map();
    }

    async deepResearch(context) {
        const topic = context.topic;
        const lang = context.language;
        
        // Проверяем кэш
        if (this.cache.has(topic)) return this.cache.get(topic);
        
        console.log('🔬 Deep research:', topic);
        
        const results = {
            topic,
            wikipedia: null,
            facts: [],
            statistics: [],
            classification: null,
            timeline: null,
            images: [],
            relatedTopics: []
        };

        // Параллельный сбор данных
        const [wiki, images] = await Promise.all([
            this.fetchWikipedia(topic, lang),
            this.fetchImages(topic)
        ]);

        results.wikipedia = wiki;
        results.images = images;

        // Извлекаем факты из Wikipedia
        if (wiki?.extract) {
            results.facts = this.extractFacts(wiki.extract);
            results.statistics = this.extractStatistics(wiki.extract);
            results.classification = this.extractClassification(wiki.extract, topic);
            results.timeline = this.extractTimeline(wiki.extract);
        }

        // Кэшируем
        this.cache.set(topic, results);
        
        console.log('✅ Research complete:', {
            facts: results.facts.length,
            stats: results.statistics.length,
            images: results.images.length,
            hasTimeline: !!results.timeline
        });

        return results;
    }

    async fetchWikipedia(topic, lang = 'en') {
        const langMap = { hy: 'hy', ru: 'ru', en: 'en' };
        const wikiLang = langMap[lang] || 'en';
        
        try {
            // Поиск статьи
            const searchUrl = `https://${wikiLang}.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(topic)}&format=json&origin=*`;
            const searchRes = await fetch(searchUrl);
            const searchData = await searchRes.json();
            
            if (!searchData.query?.search?.length) return null;
            
            const pageId = searchData.query.search[0].pageid;
            const title = searchData.query.search[0].title;
            
            // Полный текст
            const contentUrl = `https://${wikiLang}.wikipedia.org/w/api.php?action=query&prop=extracts&exintro=1&explaintext=1&pageids=${pageId}&format=json&origin=*`;
            const contentRes = await fetch(contentUrl);
            const contentData = await contentRes.json();
            
            const extract = contentData.query?.pages?.[pageId]?.extract || '';
            
            // Изображения со страницы
            const imageUrl = `https://${wikiLang}.wikipedia.org/w/api.php?action=query&prop=pageimages&pithumbsize=500&pageids=${pageId}&format=json&origin=*`;
            const imageRes = await fetch(imageUrl);
            const imageData = await imageRes.json();
            const thumbnail = imageData.query?.pages?.[pageId]?.thumbnail?.source || null;
            
            return {
                title,
                extract,
                pageUrl: `https://${wikiLang}.wikipedia.org/wiki/${encodeURIComponent(title)}`,
                thumbnail,
                pageId
            };
        } catch (e) {
            console.log('⚠️ Wikipedia fetch failed:', e.message);
            return null;
        }
    }

    async fetchImages(topic) {
        const images = [];
        
        // Unsplash
        try {
            const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(topic)}&per_page=8&orientation=landscape`;
            const res = await fetch(url);
            if (res.ok) {
                const data = await res.json();
                (data.results || []).forEach(img => {
                    images.push({
                        url: img.urls.regular,
                        thumb: img.urls.thumb,
                        alt: img.alt_description || topic,
                        source: 'Unsplash',
                        author: img.user?.name,
                        width: img.width,
                        height: img.height
                    });
                });
            }
        } catch (e) {}

        // Fallback: placeholder images
        if (images.length === 0) {
            for (let i = 0; i < 5; i++) {
                images.push({
                    url: `https://source.unsplash.com/800x600/?${encodeURIComponent(topic)}&sig=${i}`,
                    thumb: `https://source.unsplash.com/200x150/?${encodeURIComponent(topic)}&sig=${i}`,
                    alt: topic,
                    source: 'Unsplash',
                    author: 'Unsplash'
                });
            }
        }

        return images;
    }

    extractFacts(text) {
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20);
        return sentences.slice(0, 15).map(s => s.trim());
    }

    extractStatistics(text) {
        const stats = [];
        const patterns = [
            /(\d+[\.,]?\d*)\s*(?:million|billion|тысяч|миллион|миллиард|млн|млрд|тыс)/gi,
            /(\d+[\.,]?\d*)\s*%/g,
            /(\d+[\.,]?\d*)\s*(?:kg|km|m|cm|years|лет|год)/gi,
            /(\d+[\.,]?\d*)\s*(?:hours|minutes|часов|минут)/gi
        ];
        
        patterns.forEach(pattern => {
            const matches = text.match(pattern);
            if (matches) matches.forEach(m => stats.push(m));
        });
        
        return [...new Set(stats)].slice(0, 10);
    }

    extractClassification(text, topic) {
        const classificationPatterns = [
            /(?:kingdom|царство)[:\s]*(\w+)/i,
            /(?:phylum|тип)[:\s]*(\w+)/i,
            /(?:class|класс)[:\s]*(\w+)/i,
            /(?:order|отряд)[:\s]*(\w+)/i,
            /(?:family|семейство)[:\s]*(\w+)/i,
            /(?:genus|род)[:\s]*(\w+)/i,
            /(?:species|вид)[:\s]*(\w+)/i
        ];
        
        const classification = {};
        classificationPatterns.forEach(p => {
            const m = text.match(p);
            if (m) classification[p.source.split('|')[1].replace(/[?:\\]/g, '')] = m[1];
        });
        
        return Object.keys(classification).length > 0 ? classification : null;
    }

    extractTimeline(text) {
        const years = text.match(/\b(1[0-9]{3}|20[0-2][0-9])\b/g);
        if (!years || years.length < 2) return null;
        
        const unique = [...new Set(years)].sort();
        const events = [];
        
        unique.forEach(year => {
            const regex = new RegExp(`${year}[^.]*\\.`, 'i');
            const match = text.match(regex);
            if (match) events.push({ year, event: match[0].substring(0, 150) });
        });
        
        return events.length >= 2 ? events.slice(0, 10) : null;
    }
}
