// ========================================
// DESIGN ENGINE
// Создаёт дизайн-систему для презентации
// ========================================

class DesignEngine {
    constructor() {
        this.themes = {
            cyberpunk: {
                primary: '#FF0000',
                secondary: '#FF0055',
                accent: '#8B5CF6',
                background: '#090909',
                surface: '#171717',
                text: '#F5F5F5',
                textSecondary: '#B8B8B8',
                font: 'Orbitron',
                bodyFont: 'Inter',
                name: 'Cyberpunk Neon'
            },
            gaming: {
                primary: '#FF0000',
                secondary: '#00FF00',
                accent: '#0066FF',
                background: '#000000',
                surface: '#111111',
                text: '#FFFFFF',
                textSecondary: '#CCCCCC',
                font: 'Orbitron',
                bodyFont: 'Inter',
                name: 'Gaming RGB'
            },
            corporate: {
                primary: '#0033CC',
                secondary: '#0055FF',
                accent: '#666666',
                background: '#0A0A0A',
                surface: '#1A1A1A',
                text: '#FFFFFF',
                textSecondary: '#999999',
                font: 'Orbitron',
                bodyFont: 'Inter',
                name: 'Corporate Dark'
            },
            startup: {
                primary: '#FF4500',
                secondary: '#FF6600',
                accent: '#FFD700',
                background: '#0D0D0D',
                surface: '#1A1A1A',
                text: '#FFFFFF',
                textSecondary: '#BBBBBB',
                font: 'Orbitron',
                bodyFont: 'Inter',
                name: 'Startup Pitch'
            },
            educational: {
                primary: '#0099CC',
                secondary: '#00CCFF',
                accent: '#66CCFF',
                background: '#080808',
                surface: '#151515',
                text: '#FFFFFF',
                textSecondary: '#AAAAAA',
                font: 'Orbitron',
                bodyFont: 'Inter',
                name: 'Educational'
            }
        };
    }

    createDesignSystem(context) {
        const style = context.style || 'cyberpunk';
        const theme = this.themes[style] || this.themes.cyberpunk;
        
        // Расширяем тему дополнительными настройками
        return {
            ...theme,
            style: style,
            gradients: this.generateGradients(theme),
            shadows: this.generateShadows(theme),
            spacing: this.generateSpacing(),
            typography: this.generateTypography(theme),
            layoutRules: this.generateLayoutRules(context)
        };
    }

    generateGradients(theme) {
        return {
            header: `linear-gradient(90deg, ${theme.primary}, ${theme.secondary}, ${theme.accent})`,
            card: `linear-gradient(135deg, ${theme.surface}, ${theme.background})`,
            accent: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`,
            glow: `linear-gradient(180deg, ${theme.primary}00, ${theme.primary}22)`
        };
    }

    generateShadows(theme) {
        return {
            card: `0 4px 20px rgba(0,0,0,0.4)`,
            hover: `0 8px 30px rgba(0,0,0,0.6)`,
            glow: `0 0 30px ${theme.primary}33`,
            text: `0 2px 10px rgba(0,0,0,0.5)`
        };
    }

    generateSpacing() {
        return {
            slidePadding: '40px',
            elementGap: '20px',
            titleBottom: '20px',
            contentLineHeight: '1.7',
            cardPadding: '20px'
        };
    }

    generateTypography(theme) {
        return {
            titleFont: `${theme.font}, sans-serif`,
            bodyFont: `${theme.bodyFont}, sans-serif`,
            titleSize: 'clamp(18px, 3vw, 28px)',
            bodySize: 'clamp(13px, 1.5vw, 16px)',
            heroSize: 'clamp(24px, 5vw, 44px)',
            captionSize: '11px'
        };
    }

    generateLayoutRules(context) {
        return {
            maxContentPerSlide: 500,
            autoSplitThreshold: 400,
            minImageSlides: Math.ceil(context.slideCount * 0.3),
            maxRepeatingLayouts: 2,
            preferredImageRatio: '16:9'
        };
    }
}
