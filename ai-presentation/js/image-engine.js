// ========================================
// IMAGE ENGINE
// Поиск, генерация и управление изображениями
// ========================================

class ImageEngine {
    constructor() {
        this.cache = new Map();
    }

    /**
     * Собирает изображения из всех источников
     */
    async collectImages(context, research, userImages = []) {
        console.log('🖼️ Image Engine: collecting images...');
        
        let images = [];
        
        // 1. Изображения из Wikipedia
        if (research?.wikipedia?.thumbnail) {
            images.push({
                url: research.wikipedia.thumbnail,
                alt: research.wikipedia.title || context.topic,
                source: 'Wikipedia',
                type: 'encyclopedia'
            });
        }
        
        // 2. Изображения из Unsplash
        if (research?.images?.length > 0) {
            images.push(...research.images.map(img => ({
                ...img,
                type: 'stock'
            })));
        }
        
        // 3. Пользовательские изображения
        if (userImages.length > 0) {
            userImages.forEach((img, i) => {
                images.push({
                    url: img.dataUrl || img.url,
                    alt: img.name || `User Image ${i + 1}`,
                    source: 'User',
                    type: 'custom',
                    isUserImage: true
                });
            });
        }
        
        // 4. Если ничего нет — placeholder'ы
        if (images.length === 0) {
            for (let i = 0; i < 5; i++) {
                images.push({
                    url: `https://source.unsplash.com/800x600/?${encodeURIComponent(context.topic)}&sig=${i}`,
                    alt: context.topic,
                    source: 'Unsplash',
                    type: 'placeholder'
                });
            }
        }
        
        console.log(`✅ ${images.length} images collected`);
        return images;
    }

    /**
     * Назначает изображение слайду по правилам
     */
    assignImageToSlide(slide, images, index, totalSlides) {
        // Hero слайд — лучшее изображение
        if (slide.type === 'hero') {
            // Ищем пользовательское или Wikipedia
            const best = images.find(i => i.isUserImage) || 
                        images.find(i => i.source === 'Wikipedia') || 
                        images[0];
            return best;
        }
        
        // CTA слайд — последнее изображение
        if (slide.type === 'cta') {
            return images[images.length - 1] || null;
        }
        
        // Обычные слайды — распределяем равномерно
        if (images.length > 0) {
            return images[index % images.length];
        }
        
        return null;
    }

    /**
     * Оптимизирует изображение под размер слайда
     */
    optimizeImage(imageUrl, width = 800, height = 600) {
        // Для Unsplash можно указать размер
        if (imageUrl.includes('unsplash.com')) {
            return imageUrl.replace(/w=\d+/, `w=${width}`).replace(/h=\d+/, `h=${height}`);
        }
        return imageUrl;
    }

    /**
     * Создаёт промпт для AI-генерации изображения
     */
    createAIPrompt(topic, style) {
        const prompts = {
            cyberpunk: `cyberpunk neon style, ${topic}, dark futuristic, holographic, 8K`,
            gaming: `gaming art style, ${topic}, epic, RGB lighting, 8K`,
            corporate: `professional corporate style, ${topic}, modern office, clean, 8K`,
            startup: `startup vibe, ${topic}, innovative, dynamic, modern, 8K`,
            educational: `educational illustration, ${topic}, clean, informative, 8K`
        };
        return prompts[style] || prompts.cyberpunk;
    }

    /**
     * Проверяет загружается ли изображение
     */
    async validateImage(url) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = url;
            setTimeout(() => resolve(false), 5000);
        });
    }
}
