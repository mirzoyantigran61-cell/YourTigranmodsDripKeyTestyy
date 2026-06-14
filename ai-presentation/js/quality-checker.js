// ========================================
// QUALITY CHECKER
// Проверяет и исправляет презентацию
// ========================================

class QualityChecker {
    validateAll(slides, designSystem) {
        console.log('✅ Quality Checker: validating', slides.length, 'slides');
        
        const issues = [];
        const fixed = [];
        
        slides.forEach((slide, i) => {
            const slideIssues = this.validateSlide(slide, i, slides, designSystem);
            if (slideIssues.length > 0) {
                issues.push({ slide: i + 1, issues: slideIssues });
                // Пытаемся исправить
                this.fixSlide(slide, slideIssues, designSystem);
                fixed.push(i + 1);
            }
        });
        
        // Проверка на повторяющиеся лэйауты подряд
        this.checkRepeatingLayouts(slides);
        
        // Проверка на слабые заголовки
        this.checkWeakTitles(slides);
        
        console.log(`📊 Quality Report: ${issues.length} slides had issues, ${fixed.length} fixed`);
        
        return slides;
    }

    validateSlide(slide, index, allSlides, ds) {
        const issues = [];
        
        // Проверка заголовка
        if (!slide.title || slide.title.length < 3) {
            issues.push('Слишком короткий заголовок');
        }
        
        // Проверка на запрещённые заголовки
        const forbiddenTitles = ['overview', 'analysis', 'examples', 'key points', 'deep dive', 'introduction', 'conclusion', 'обзор', 'анализ', 'примеры', 'ключевые моменты', 'введение', 'заключение'];
        if (forbiddenTitles.some(t => slide.title?.toLowerCase().includes(t))) {
            issues.push('Шаблонный заголовок');
        }
        
        // Проверка контента
        if (!slide.content || slide.content.length < 30) {
            issues.push('Слишком мало контента');
        }
        
        // Проверка на переполнение
        if (slide.content && slide.content.length > 800) {
            issues.push('Слишком много текста — нужна разбивка');
        }
        
        // Проверка изображения
        if (!slide.image && !slide.imageData && slide.type !== 'agenda') {
            issues.push('Нет изображения');
        }
        
        return issues;
    }

    fixSlide(slide, issues, ds) {
        issues.forEach(issue => {
            switch (issue) {
                case 'Слишком короткий заголовок':
                    slide.title = slide.title + ' — подробный разбор';
                    break;
                case 'Шаблонный заголовок':
                    slide.title = slide.title.replace(/Overview|Analysis|Examples|Key Points|Deep Dive|Introduction|Conclusion|Обзор|Анализ|Примеры|Введение|Заключение/gi, 'Исследование');
                    break;
                case 'Слишком мало контента':
                    slide.content += ' Дополнительная информация будет добавлена по мере исследования темы.';
                    break;
                case 'Слишком много текста — нужна разбивка':
                    // Разбиваем на части
                    const sentences = slide.content.split(/[.!?]+/);
                    const mid = Math.ceil(sentences.length / 2);
                    slide.content = sentences.slice(0, mid).join('. ') + '.';
                    slide.splitContent = sentences.slice(mid).join('. ') + '.';
                    slide.layout = 'two_column';
                    break;
                case 'Нет изображения':
                    slide.layout = slide.layout === 'image_right' ? 'content' : slide.layout;
                    break;
            }
        });
    }

    checkRepeatingLayouts(slides) {
        for (let i = 2; i < slides.length; i++) {
            if (slides[i].layout === slides[i-1].layout && slides[i].layout === slides[i-2].layout) {
                // Меняем лэйаут
                const alternatives = ['content', 'two_column', 'split', 'image_right', 'image_left'];
                const current = slides[i].layout;
                const newLayout = alternatives.find(l => l !== current) || 'content';
                slides[i].layout = newLayout;
                console.log(`🔄 Slide ${i+1}: changed layout from ${current} to ${newLayout}`);
            }
        }
    }

    checkWeakTitles(slides) {
        const weakPatterns = /^[A-ZА-Я][a-zа-я]+\s+\d+$/; // "Chapter 1", "Глава 1"
        
        slides.forEach((slide, i) => {
            if (weakPatterns.test(slide.title) || slide.title.length < 5) {
                slide.title = `Важная информация — слайд ${i + 1}`;
            }
        });
    }
}
