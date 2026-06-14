// ========================================
// SHARED CONFIGURATION
// ========================================

const APP_CONFIG = {
    // App Info
    appName: 'YourTigranmods Pro',
    version: '3.0.0',
    
    // AI Settings
    ai: {
    provider: 'openai',
    model: 'gpt-3.5-turbo',
    maxTokens: 2000,
    temperature: 0.7,
    
    // OpenAI API
    openai: {
        apiKey: '',
        endpoint: 'https://api.openai.com/v1/chat/completions'
    },
    
    // API Endpoints
    endpoints: {
        analyze: '/api/ai/generate/analyze',
        imagePrompt: '/api/ai/image-prompt',
        speakerNotes: '/api/ai/speaker-notes'
    }
},
    // Presentation Settings
    presentation: {
        maxFreePresentations: 1, // Сколько бесплатных презентаций
        slideSizes: {
            wide: { width: 13.33, height: 7.5 }, // 16:9
            standard: { width: 10, height: 7.5 }  // 4:3
        },
        defaultSlideCount: 10,
        maxSlides: 30,
        supportedFormats: ['pdf', 'docx', 'txt', 'md']
    },
    
    // Design Themes
    themes: {
        cyberpunk: {
            name: 'Cyberpunk Neon',
            primary: '#FF0000',
            secondary: '#FF0055',
            accent: '#8B5CF6',
            cyan: '#00F0FF',
            background: '#090909',
            surface: '#171717',
            text: '#F5F5F5',
            textSecondary: '#B8B8B8',
            font: 'Orbitron'
        },
        modern: {
            name: 'Modern Dark',
            primary: '#FF0000',
            secondary: '#FF4444',
            accent: '#666666',
            background: '#0A0A0A',
            surface: '#1A1A1A',
            text: '#FFFFFF',
            textSecondary: '#999999',
            font: 'Inter'
        },
        gaming: {
            name: 'Gaming RGB',
            primary: '#FF0000',
            secondary: '#00FF00',
            accent: '#0000FF',
            background: '#000000',
            surface: '#111111',
            text: '#FFFFFF',
            textSecondary: '#CCCCCC',
            font: 'Orbitron'
        }
    },
    
    // Subscription Plans
    plans: {
        week: { name: 'Week Plan', price: 20, days: 7 },
        month: { name: 'Month Plan', price: 30, days: 30 },
        year: { name: 'Year Plan', price: 40, days: 365 }
    },
    
    // Contact Info
    contact: {
        email: 'mirzoyantigran61@gmail.com',
        telegram: '@YourTigranmods',
        instagram: '@armffsoft',
        whatsapp: 'https://wa.me/qr/IK2UVLTM2D6GB1',
        youtube: '@speedmak01'
    }
};

// Экспортируем для использования в других файлах
if (typeof module !== 'undefined' && module.exports) {
    module.exports = APP_CONFIG;
}
