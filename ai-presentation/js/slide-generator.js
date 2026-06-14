// ========================================
// SLIDE GENERATOR
// Отрисовывает слайды в HTML и генерирует превью
// ========================================

class SlideGenerator {
    constructor() {
        this.currentSlide = null;
        this.designSystem = null;
    }

    /**
     * Установить дизайн-систему
     */
    setDesignSystem(design) {
        this.designSystem = design;
    }

    /**
     * Главный метод — рендерит слайд в контейнер
     */
    renderSlide(slide, container) {
        if (!this.designSystem) {
            this.designSystem = APP_CONFIG.themes.cyberpunk;
        }
        
        this.currentSlide = slide;
        
        const design = this.designSystem;
        let html = '';
        
        // Общая обёртка с фоном
        html += `
        <div style="width: 100%; height: 100%; background: ${design.background}; 
            padding: 50px; position: relative; overflow: hidden; border-radius: 12px;">
            
            <!-- Декоративная линия сверху -->
            <div style="position: absolute; top: 0; left: 0; width: 100%; height: 4px; 
                background: linear-gradient(90deg, ${design.primary}, ${design.secondary}, ${design.accent});"></div>
            
            <!-- Номер слайда -->
            <div style="position: absolute; top: 20px; right: 30px; 
                font-family: 'Orbitron', sans-serif; font-size: 12px; color: ${design.textSecondary}; 
                opacity: 0.6;">
                ${String(slide.id || 1).padStart(2, '0')} / ${String(slide.total || 10).padStart(2, '0')}
            </div>
        `;
        
        // Тип слайда определяет лэйаут
        switch (slide.type) {
            case 'hero':
                html += this.renderHero(slide, design);
                break;
            case 'agenda':
                html += this.renderAgenda(slide, design);
                break;
            case 'content':
                html += this.renderContent(slide, design);
                break;
            case 'two_column':
                html += this.renderTwoColumn(slide, design);
                break;
            case 'stats':
                html += this.renderStats(slide, design);
                break;
            case 'cta':
                html += this.renderCTA(slide, design);
                break;
            default:
                html += this.renderDefault(slide, design);
        }
        
        // Закрываем обёртку
        html += `
            <!-- Логотип внизу -->
            <div style="position: absolute; bottom: 20px; left: 50px; 
                font-family: 'Orbitron', sans-serif; font-size: 10px; color: ${design.textSecondary}; 
                opacity: 0.4;">
                YourTigranmods AI Presentation
            </div>
        </div>`;
        
        container.innerHTML = html;
    }

    /**
     * Hero слайд (титульный)
     */
    renderHero(slide, design) {
        return `
            <div style="display: flex; flex-direction: column; justify-content: center; 
                align-items: center; height: 100%; text-align: center;">
                
                <!-- Иконка/эмодзи -->
                <div style="font-size: 64px; margin-bottom: 30px; 
                    filter: drop-shadow(0 0 20px ${design.primary});">
                    🚀
                </div>
                
                <!-- Заголовок -->
                <h1 style="font-family: 'Orbitron', sans-serif; font-size: 48px; font-weight: 900;
                    background: linear-gradient(135deg, ${design.primary}, ${design.accent});
                    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
                    margin-bottom: 20px; max-width: 80%; line-height: 1.2;">
                    ${slide.title}
                </h1>
                
                <!-- Подзаголовок -->
                <p style="font-family: 'Inter', sans-serif; font-size: 20px; 
                    color: ${design.textSecondary}; max-width: 60%; line-height: 1.5;">
                    ${slide.content}
                </p>
                
                <!-- Декоративная линия -->
                <div style="width: 120px; height: 3px; 
                    background: linear-gradient(90deg, transparent, ${design.primary}, transparent);
                    margin-top: 30px;"></div>
            </div>
        `;
    }

    /**
     * Agenda слайд (содержание)
     */
    renderAgenda(slide, design) {
        const items = Array.isArray(slide.content) ? slide.content : 
            ['Introduction', 'Main Points', 'Analysis', 'Conclusion'];
        
        const itemsHtml = items.map((item, i) => `
            <div style="display: flex; align-items: center; gap: 20px; 
                padding: 18px 24px; margin-bottom: 12px;
                background: ${design.surface}; border-radius: 12px;
                border-left: 3px solid ${design.primary};
                transition: all 0.3s;"
                onmouseover="this.style.transform='translateX(10px)'; this.style.background='${design.surface}CC';"
                onmouseout="this.style.transform='translateX(0)'; this.style.background='${design.surface}';">
                
                <!-- Номер -->
                <span style="font-family: 'Orbitron', sans-serif; font-size: 28px; font-weight: 700;
                    color: ${design.primary}; min-width: 50px; text-align: center;">
                    ${String(i + 1).padStart(2, '0')}
                </span>
                
                <!-- Текст -->
                <span style="font-family: 'Inter', sans-serif; font-size: 18px; 
                    color: ${design.text}; flex: 1;">
                    ${item}
                </span>
                
                <!-- Стрелка -->
                <span style="color: ${design.primary}; opacity: 0.5;">→</span>
            </div>
        `).join('');
        
        return `
            <div style="height: 100%;">
                <h2 style="font-family: 'Orbitron', sans-serif; font-size: 32px; 
                    color: ${design.primary}; margin-bottom: 30px;">
                    📋 ${slide.title}
                </h2>
                <div style="max-width: 700px; margin: 0 auto;">
                    ${itemsHtml}
                </div>
            </div>
        `;
    }

    /**
     * Content слайд (обычный контент)
     */
    renderContent(slide, design) {
        // Разбиваем контент на буллиты если это строка
        const bullets = typeof slide.content === 'string' ? 
            slide.content.split('.').filter(b => b.trim()).map(b => b.trim() + '.') :
            slide.content;
        
        const bulletsHtml = Array.isArray(bullets) ? bullets.map(bullet => `
            <li style="margin-bottom: 16px; font-family: 'Inter', sans-serif; font-size: 16px;
                color: ${design.text}; line-height: 1.6; padding-left: 8px;">
                <span style="color: ${design.primary}; margin-right: 8px;">▸</span>
                ${bullet}
            </li>
        `).join('') : `<p style="color: ${design.text};">${slide.content}</p>`;
        
        return `
            <div style="height: 100%; display: flex; flex-direction: column;">
                <h2 style="font-family: 'Orbitron', sans-serif; font-size: 32px; 
                    color: ${design.primary}; margin-bottom: 30px;
                    border-bottom: 2px solid ${design.primary}33; padding-bottom: 15px;">
                    ${slide.title}
                </h2>
                <ul style="list-style: none; padding: 0; margin: 0; flex: 1;">
                    ${bulletsHtml}
                </ul>
            </div>
        `;
    }

    /**
     * Two Column слайд
     */
    renderTwoColumn(slide, design) {
        return `
            <div style="height: 100%;">
                <h2 style="font-family: 'Orbitron', sans-serif; font-size: 28px; 
                    color: ${design.primary}; margin-bottom: 30px;">
                    ${slide.title}
                </h2>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; height: calc(100% - 80px);">
                    
                    <!-- Левая колонка -->
                    <div style="background: ${design.surface}; border-radius: 16px; padding: 30px;
                        border: 1px solid ${design.primary}22;">
                        <h3 style="font-family: 'Orbitron', sans-serif; font-size: 20px; 
                            color: ${design.primary}; margin-bottom: 20px;">
                            📊 Key Points
                        </h3>
                        <p style="color: ${design.text}; line-height: 1.8; font-size: 15px;">
                            ${slide.content}
                        </p>
                    </div>
                    
                    <!-- Правая колонка -->
                    <div style="background: ${design.surface}; border-radius: 16px; padding: 30px;
                        border: 1px solid ${design.accent}22; display: flex; align-items: center; justify-content: center;">
                        <div style="text-align: center;">
                            <div style="font-size: 80px; margin-bottom: 20px; opacity: 0.6;">🎯</div>
                            <p style="font-family: 'Orbitron', sans-serif; color: ${design.accent}; 
                                font-size: 14px;">
                                Visual Placeholder
                            </p>
                        </div>
                    </div>
                    
                </div>
            </div>
        `;
    }

    /**
     * Stats слайд
     */
    renderStats(slide, design) {
        const stats = slide.stats || [
            { value: '10K+', label: 'Users' },
            { value: '50+', label: 'Countries' },
            { value: '99%', label: 'Uptime' },
            { value: '4.9', label: 'Rating' }
        ];
        
        const statsHtml = stats.map(stat => `
            <div style="background: ${design.surface}; border-radius: 16px; padding: 30px; 
                text-align: center; border: 1px solid ${design.primary}22;
                transition: all 0.3s;"
                onmouseover="this.style.transform='translateY(-5px)'; this.style.borderColor='${design.primary}';"
                onmouseout="this.style.transform='translateY(0)'; this.style.borderColor='${design.primary}22';">
                
                <div style="font-family: 'Orbitron', sans-serif; font-size: 42px; font-weight: 900;
                    background: linear-gradient(135deg, ${design.primary}, ${design.secondary});
                    -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                    ${stat.value}
                </div>
                <div style="font-family: 'Inter', sans-serif; font-size: 14px; 
                    color: ${design.textSecondary}; margin-top: 8px; text-transform: uppercase; letter-spacing: 1px;">
                    ${stat.label}
                </div>
            </div>
        `).join('');
        
        return `
            <div style="height: 100%;">
                <h2 style="font-family: 'Orbitron', sans-serif; font-size: 32px; 
                    color: ${design.primary}; margin-bottom: 30px; text-align: center;">
                    ${slide.title}
                </h2>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); 
                    gap: 20px;">
                    ${statsHtml}
                </div>
            </div>
        `;
    }

    /**
     * CTA слайд (финальный)
     */
    renderCTA(slide, design) {
        return `
            <div style="display: flex; flex-direction: column; justify-content: center; 
                align-items: center; height: 100%; text-align: center;">
                
                <!-- Большая иконка -->
                <div style="font-size: 80px; margin-bottom: 30px;
                    filter: drop-shadow(0 0 30px ${design.primary});">
                    🔥
                </div>
                
                <!-- Заголовок -->
                <h2 style="font-family: 'Orbitron', sans-serif; font-size: 44px; font-weight: 900;
                    color: ${design.primary}; margin-bottom: 20px;">
                    ${slide.title}
                </h2>
                
                <!-- Контент -->
                <p style="font-family: 'Inter', sans-serif; font-size: 20px; 
                    color: ${design.textSecondary}; max-width: 60%; margin-bottom: 30px;">
                    ${slide.content}
                </p>
                
                <!-- Кнопка -->
                <div style="background: linear-gradient(135deg, ${design.primary}, ${design.secondary});
                    padding: 16px 40px; border-radius: 50px; font-family: 'Orbitron', sans-serif;
                    font-size: 18px; color: white; cursor: pointer; transition: all 0.3s;
                    box-shadow: 0 0 30px ${design.primary}44;"
                    onmouseover="this.style.transform='scale(1.05)';"
                    onmouseout="this.style.transform='scale(1)';">
                    Get Started →
                </div>
                
                <!-- Контакты -->
                <div style="margin-top: 40px; font-family: 'Inter', sans-serif; font-size: 14px;
                    color: ${design.textSecondary}; opacity: 0.6;">
                    YourTigranmods AI • @YourTigranmods
                </div>
            </div>
        `;
    }

    /**
     * Default слайд (запасной)
     */
    renderDefault(slide, design) {
        return `
            <div style="height: 100%;">
                <h2 style="font-family: 'Orbitron', sans-serif; font-size: 28px; 
                    color: ${design.primary}; margin-bottom: 20px;">
                    ${slide.title}
                </h2>
                <p style="font-family: 'Inter', sans-serif; font-size: 16px; 
                    color: ${design.text}; line-height: 1.8;">
                    ${slide.content}
                </p>
            </div>
        `;
    }

    /**
     * Создать миниатюру слайда для навигатора
     */
    createThumbnail(slide, index, isActive) {
        const design = this.designSystem || APP_CONFIG.themes.cyberpunk;
        
        return `
            <div class="slide-thumb" 
                style="min-width: 180px; height: 100px; 
                background: ${isActive ? design.surface : design.background}; 
                border: 2px solid ${isActive ? design.primary : design.surface};
                border-radius: 10px; padding: 12px; cursor: pointer;
                transition: all 0.3s; position: relative; overflow: hidden;"
                onclick="selectSlide(${index})"
                onmouseover="this.style.borderColor='${design.primary}'; this.style.transform='translateY(-3px)';"
                onmouseout="if(!${isActive}){this.style.borderColor='${design.surface}'; this.style.transform='translateY(0)';}">
                
                <!-- Мини-превью типа слайда -->
                <div style="font-size: 20px; margin-bottom: 8px;">
                    ${slide.type === 'hero' ? '🚀' : slide.type === 'cta' ? '🎯' : '📄'}
                </div>
                
                <!-- Название -->
                <p style="font-family: 'Inter', sans-serif; font-size: 11px; color: ${design.text};
                    overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin: 0;">
                    ${slide.title}
                </p>
                
                <!-- Индикатор активного -->
                ${isActive ? `
                    <div style="position: absolute; bottom: 0; left: 0; width: 100%; height: 3px;
                        background: ${design.primary};"></div>
                ` : ''}
            </div>
        `;
    }

    /**
     * Создать полный набор миниатюр
     */
    createAllThumbnails(slides, activeIndex) {
        return slides.map((slide, i) => 
            this.createThumbnail(slide, i, i === activeIndex)
        ).join('');
    }
}

// Создаём глобальный экземпляр
const slideGenerator = new SlideGenerator();

console.log('✅ Slide Generator initialized and ready');
