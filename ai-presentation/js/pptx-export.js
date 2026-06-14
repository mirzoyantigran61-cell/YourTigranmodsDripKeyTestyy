// ========================================
// PPTX EXPORT ENGINE
// Экспорт презентации в PowerPoint (.pptx)
// Использует PptxGenJS библиотеку
// ========================================

class PPTXExporter {
    constructor() {
        this.pptx = null;
    }

    /**
     * Главный метод — создаёт и скачивает PPTX файл
     */
    async exportToPPTX(presentation, filename) {
        console.log('📦 PPTX Export: Starting...');
        
        // Проверяем что библиотека загружена
        if (typeof PptxGenJS === 'undefined') {
            console.error('❌ PptxGenJS not loaded!');
            throw new Error('PptxGenJS library not loaded. Add script tag to HTML.');
        }
        
        this.pptx = new PptxGenJS();
        
        // Настройка презентации
        this.pptx.layout = 'LAYOUT_WIDE'; // 16:9
        this.pptx.author = presentation.author || 'YourTigranmods AI';
        this.pptx.company = 'YourTigranmods Icon Maker Pro';
        this.pptx.title = presentation.title || 'AI Generated Presentation';
        this.pptx.subject = presentation.subtitle || '';
        
        // Добавляем слайды
        const slides = presentation.slides || [];
        const design = presentation.designSystem || APP_CONFIG.themes.cyberpunk;
        
        for (let i = 0; i < slides.length; i++) {
            await this.addSlide(slides[i], design, i + 1, slides.length);
        }
        
        // Скачиваем
        const fileName = filename || `${presentation.title || 'presentation'}.pptx`;
        await this.pptx.writeFile({ fileName });
        
        console.log('✅ PPTX Export: Complete!');
        return true;
    }

    /**
     * Добавить слайд в презентацию
     */
    async addSlide(slideData, design, slideNum, totalSlides) {
        const slide = this.pptx.addSlide();
        
        // Фон слайда
        slide.background = { fill: this.hexToColor(design.background || '090909') };
        
        // Декоративная линия сверху
        slide.addShape(this.pptx.ShapeType.rect, {
            x: 0, y: 0, w: '100%', h: 0.04,
            fill: { color: this.hexToColor(design.primary || 'FF0000') }
        });
        
        // Номер слайда
        slide.addText(`${String(slideNum).padStart(2, '0')} / ${String(totalSlides).padStart(2, '0')}`, {
            x: 11.5, y: 0.3, w: 1.5, h: 0.4,
            fontSize: 9, fontFace: 'Orbitron',
            color: this.hexToColor(design.textSecondary || 'B8B8B8'),
            align: 'right'
        });
        
        // Тип слайда
        switch (slideData.type) {
            case 'hero':
                this.addHeroSlide(slide, slideData, design);
                break;
            case 'agenda':
                this.addAgendaSlide(slide, slideData, design);
                break;
            case 'content':
                this.addContentSlide(slide, slideData, design);
                break;
            case 'two_column':
                this.addTwoColumnSlide(slide, slideData, design);
                break;
            case 'stats':
                this.addStatsSlide(slide, slideData, design);
                break;
            case 'cta':
                this.addCTASlide(slide, slideData, design);
                break;
            default:
                this.addDefaultSlide(slide, slideData, design);
        }
        
        // Логотип внизу
        slide.addText('YourTigranmods AI Presentation', {
            x: 0.5, y: 7.0, w: 3, h: 0.3,
            fontSize: 7, fontFace: 'Orbitron',
            color: this.hexToColor(design.textSecondary || 'B8B8B8'),
            opacity: 0.4
        });
    }

    /**
     * Hero слайд (титульный)
     */
    addHeroSlide(slide, data, design) {
        // Эмодзи/иконка
        slide.addText('🚀', {
            x: 6.0, y: 1.2, w: 1.3, h: 1.0,
            fontSize: 48, align: 'center'
        });
        
        // Заголовок
        slide.addText(data.title, {
            x: 1.5, y: 2.5, w: 10.3, h: 1.5,
            fontSize: 44, fontFace: 'Orbitron',
            color: this.hexToColor(design.primary || 'FF0000'),
            bold: true, align: 'center',
            lineSpacing: 48
        });
        
        // Подзаголовок
        slide.addText(data.content || '', {
            x: 2.5, y: 4.2, w: 8.3, h: 0.8,
            fontSize: 16, fontFace: 'Inter',
            color: this.hexToColor(design.textSecondary || 'B8B8B8'),
            align: 'center'
        });
        
        // Декоративная линия
        slide.addShape(this.pptx.ShapeType.rect, {
            x: 5.5, y: 3.8, w: 2.3, h: 0.03,
            fill: { color: this.hexToColor(design.primary || 'FF0000') }
        });
    }

    /**
     * Agenda слайд (содержание)
     */
    addAgendaSlide(slide, data, design) {
        slide.addText(data.title, {
            x: 0.8, y: 0.5, w: 11, h: 0.8,
            fontSize: 28, fontFace: 'Orbitron',
            color: this.hexToColor(design.primary || 'FF0000'),
            bold: true
        });
        
        const items = Array.isArray(data.content) ? data.content : ['Item 1', 'Item 2', 'Item 3'];
        
        items.forEach((item, i) => {
            const yPos = 1.8 + (i * 1.0);
            
            // Фон для пункта
            slide.addShape(this.pptx.ShapeType.roundRect, {
                x: 1.0, y: yPos, w: 10.5, h: 0.75,
                fill: { color: this.hexToColor(design.surface || '171717') },
                rectRadius: 0.1
            });
            
            // Акцентная полоса
            slide.addShape(this.pptx.ShapeType.rect, {
                x: 1.0, y: yPos, w: 0.06, h: 0.75,
                fill: { color: this.hexToColor(design.primary || 'FF0000') }
            });
            
            // Номер
            slide.addText(String(i + 1).padStart(2, '0'), {
                x: 1.3, y: yPos + 0.1, w: 0.6, h: 0.55,
                fontSize: 18, fontFace: 'Orbitron',
                color: this.hexToColor(design.primary || 'FF0000'),
                bold: true
            });
            
            // Текст
            slide.addText(item, {
                x: 2.2, y: yPos + 0.1, w: 9.0, h: 0.55,
                fontSize: 14, fontFace: 'Inter',
                color: this.hexToColor(design.text || 'F5F5F5')
            });
        });
    }

    /**
     * Content слайд
     */
    addContentSlide(slide, data, design) {
        slide.addText(data.title, {
            x: 0.8, y: 0.5, w: 11, h: 0.8,
            fontSize: 28, fontFace: 'Orbitron',
            color: this.hexToColor(design.primary || 'FF0000'),
            bold: true
        });
        
        // Разделительная линия
        slide.addShape(this.pptx.ShapeType.rect, {
            x: 0.8, y: 1.4, w: 11.5, h: 0.01,
            fill: { color: this.hexToColor(design.primary || 'FF0000'), transparency: 80 }
        });
        
        const bullets = typeof data.content === 'string' ? 
            data.content.split('.').filter(b => b.trim()) : 
            (Array.isArray(data.content) ? data.content : [data.content]);
        
        bullets.forEach((bullet, i) => {
            slide.addText(`${bullet.trim()}${bullet.endsWith('.') ? '' : '.'}`, {
                x: 1.2, y: 1.8 + (i * 0.6), w: 10.5, h: 0.5,
                fontSize: 14, fontFace: 'Inter',
                color: this.hexToColor(design.text || 'F5F5F5'),
                bullet: { type: 'bullet', color: this.hexToColor(design.primary || 'FF0000') }
            });
        });
    }

    /**
     * Two Column слайд
     */
    addTwoColumnSlide(slide, data, design) {
        slide.addText(data.title, {
            x: 0.8, y: 0.5, w: 11, h: 0.8,
            fontSize: 24, fontFace: 'Orbitron',
            color: this.hexToColor(design.primary || 'FF0000'),
            bold: true
        });
        
        // Левая колонка
        slide.addShape(this.pptx.ShapeType.roundRect, {
            x: 0.5, y: 1.8, w: 5.8, h: 4.5,
            fill: { color: this.hexToColor(design.surface || '171717') },
            rectRadius: 0.2
        });
        
        slide.addText(data.content || 'Content', {
            x: 0.8, y: 2.0, w: 5.2, h: 4.0,
            fontSize: 14, fontFace: 'Inter',
            color: this.hexToColor(design.text || 'F5F5F5'),
            valign: 'top'
        });
        
        // Правая колонка
        slide.addShape(this.pptx.ShapeType.roundRect, {
            x: 7.0, y: 1.8, w: 5.8, h: 4.5,
            fill: { color: this.hexToColor(design.surface || '171717') },
            rectRadius: 0.2
        });
        
        slide.addText('🎯 Visual / Chart Area', {
            x: 7.3, y: 3.5, w: 5.2, h: 1.0,
            fontSize: 16, fontFace: 'Orbitron',
            color: this.hexToColor(design.textSecondary || 'B8B8B8'),
            align: 'center'
        });
    }

    /**
     * Stats слайд
     */
    addStatsSlide(slide, data, design) {
        slide.addText(data.title, {
            x: 0.8, y: 0.5, w: 11, h: 0.8,
            fontSize: 28, fontFace: 'Orbitron',
            color: this.hexToColor(design.primary || 'FF0000'),
            bold: true,
            align: 'center'
        });
        
        const stats = data.stats || [
            { value: '10K+', label: 'Users' },
            { value: '50+', label: 'Countries' },
            { value: '99%', label: 'Uptime' },
            { value: '4.9', label: 'Rating' }
        ];
        
        const positions = [
            { x: 1.0, y: 2.2 }, { x: 7.0, y: 2.2 },
            { x: 1.0, y: 5.0 }, { x: 7.0, y: 5.0 }
        ];
        
        stats.slice(0, 4).forEach((stat, i) => {
            const pos = positions[i];
            
            // Карточка
            slide.addShape(this.pptx.ShapeType.roundRect, {
                ...pos, w: 5.3, h: 2.3,
                fill: { color: this.hexToColor(design.surface || '171717') },
                rectRadius: 0.2
            });
            
            // Значение
            slide.addText(stat.value, {
                x: pos.x + 0.3, y: pos.y + 0.3, w: 4.7, h: 1.0,
                fontSize: 36, fontFace: 'Orbitron',
                color: this.hexToColor(design.primary || 'FF0000'),
                bold: true, align: 'center'
            });
            
            // Лейбл
            slide.addText(stat.label, {
                x: pos.x + 0.3, y: pos.y + 1.4, w: 4.7, h: 0.5,
                fontSize: 12, fontFace: 'Inter',
                color: this.hexToColor(design.textSecondary || 'B8B8B8'),
                align: 'center',
                charSpacing: 3
            });
        });
    }

    /**
     * CTA слайд (финальный)
     */
    addCTASlide(slide, data, design) {
        slide.addText('🔥', {
            x: 6.0, y: 1.0, w: 1.3, h: 1.0,
            fontSize: 48, align: 'center'
        });
        
        slide.addText(data.title, {
            x: 1.5, y: 2.2, w: 10.3, h: 1.2,
            fontSize: 40, fontFace: 'Orbitron',
            color: this.hexToColor(design.primary || 'FF0000'),
            bold: true, align: 'center'
        });
        
        slide.addText(data.content || '', {
            x: 2.5, y: 3.5, w: 8.3, h: 0.8,
            fontSize: 16, fontFace: 'Inter',
            color: this.hexToColor(design.textSecondary || 'B8B8B8'),
            align: 'center'
        });
        
        // Кнопка
        slide.addShape(this.pptx.ShapeType.roundRect, {
            x: 5.0, y: 4.8, w: 3.3, h: 0.7,
            fill: { color: this.hexToColor(design.primary || 'FF0000') },
            rectRadius: 0.5
        });
        
        slide.addText('Get Started →', {
            x: 5.0, y: 4.8, w: 3.3, h: 0.7,
            fontSize: 14, fontFace: 'Orbitron',
            color: 'FFFFFF', align: 'center', bold: true
        });
    }

    /**
     * Default слайд
     */
    addDefaultSlide(slide, data, design) {
        slide.addText(data.title, {
            x: 0.8, y: 1.0, w: 11, h: 0.8,
            fontSize: 24, fontFace: 'Orbitron',
            color: this.hexToColor(design.primary || 'FF0000'),
            bold: true
        });
        
        slide.addText(data.content || '', {
            x: 0.8, y: 2.2, w: 11, h: 4.0,
            fontSize: 14, fontFace: 'Inter',
            color: this.hexToColor(design.text || 'F5F5F5'),
            valign: 'top'
        });
    }

    /**
     * Конвертирует HEX цвет в формат для PptxGenJS
     */
    hexToColor(hex) {
        // Убираем # если есть
        return hex.replace('#', '');
    }
}

// Создаём глобальный экземпляр
const pptxExporter = new PPTXExporter();

console.log('✅ PPTX Exporter initialized and ready');
