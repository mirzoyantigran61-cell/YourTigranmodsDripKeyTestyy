// ========================================
// SLIDE GENERATOR v3.0 PRO
// Умная вёрстка, все лэйауты, адаптив
// ========================================

class SlideGenerator {
    constructor() {
        this.designSystem = null;
    }

    setDesignSystem(d) { this.designSystem = d || APP_CONFIG?.themes?.cyberpunk || this.defaultDesign(); }
    defaultDesign() { return { primary: '#FF0000', secondary: '#FF0055', accent: '#8B5CF6', background: '#090909', surface: '#171717', text: '#F5F5F5', textSecondary: '#B8B8B8', font: 'Orbitron' }; }

    renderSlide(slide, container) {
        const ds = this.designSystem || this.defaultDesign();
        const layout = slide.layout || 'content';
        const methodName = 'render_' + layout;
        const html = typeof this[methodName] === 'function' ? this[methodName](slide, ds) : this.render_content(slide, ds);
        container.innerHTML = `<div style="width:100%;height:100%;background:${ds.background};padding:40px;position:relative;overflow:hidden;border-radius:12px;">
            <div style="position:absolute;top:0;left:0;width:100%;height:3px;background:linear-gradient(90deg,${ds.primary},${ds.secondary},${ds.accent});"></div>
            ${html}
            <div style="position:absolute;bottom:12px;right:24px;font-size:10px;color:${ds.textSecondary};opacity:0.4;">YourTigranmods AI</div>
        </div>`;
    }

    // ========== ЛЭЙАУТЫ ==========

    render_hero(slide, ds) {
        return `<div style="display:flex;flex-direction:column;justify-content:center;align-items:center;height:100%;text-align:center;">
            <div style="font-size:56px;margin-bottom:20px;">${slide.topic || '🚀'}</div>
            <h1 style="font-family:${ds.font},sans-serif;font-size:clamp(24px,5vw,44px);font-weight:900;background:linear-gradient(135deg,${ds.primary},${ds.accent});-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:16px;max-width:85%;line-height:1.2;">${slide.title}</h1>
            <p style="font-size:clamp(14px,2vw,18px);color:${ds.textSecondary};max-width:65%;line-height:1.5;">${slide.content}</p>
            <div style="width:80px;height:3px;background:linear-gradient(90deg,transparent,${ds.primary},transparent);margin-top:24px;"></div>
        </div>`;
    }

    render_content(slide, ds) {
        const text = this.processText(slide.content);
        const fontSize = text.length > 300 ? '14px' : text.length > 150 ? '16px' : '18px';
        return `<div style="height:100%;display:flex;flex-direction:column;">
            <h2 style="font-family:${ds.font},sans-serif;font-size:clamp(18px,3vw,26px);color:${ds.primary};margin-bottom:20px;border-bottom:2px solid ${ds.primary}33;padding-bottom:10px;">${slide.title}</h2>
            <div style="flex:1;overflow-y:auto;font-size:${fontSize};color:${ds.text};line-height:1.7;">${text}</div>
        </div>`;
    }

    render_two_column(slide, ds) {
        const text = this.processText(slide.content);
        const mid = Math.ceil(text.length / 2);
        const left = text.substring(0, mid);
        const right = text.substring(mid);
        return `<div style="height:100%;">
            <h2 style="font-family:${ds.font},sans-serif;font-size:clamp(16px,2.5vw,22px);color:${ds.primary};margin-bottom:16px;">${slide.title}</h2>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;height:calc(100% - 50px);">
                <div style="background:${ds.surface};border-radius:12px;padding:20px;border-left:3px solid ${ds.primary};overflow-y:auto;font-size:14px;color:${ds.text};line-height:1.6;">${left}</div>
                <div style="background:${ds.surface};border-radius:12px;padding:20px;border-left:3px solid ${ds.accent};overflow-y:auto;font-size:14px;color:${ds.text};line-height:1.6;">${right}</div>
            </div>
        </div>`;
    }

    render_split(slide, ds) {
        const text = this.processText(slide.content);
        const lines = text.split(/[.!?]+/).filter(s => s.trim());
        const mid = Math.ceil(lines.length / 2);
        return `<div style="height:100%;">
            <h2 style="font-family:${ds.font},sans-serif;font-size:clamp(16px,2.5vw,22px);color:${ds.primary};margin-bottom:16px;">${slide.title}</h2>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
                <div>${lines.slice(0,mid).map(l=>`<p style="font-size:13px;color:${ds.text};margin-bottom:8px;line-height:1.5;">• ${l.trim()}</p>`).join('')}</div>
                <div>${lines.slice(mid).map(l=>`<p style="font-size:13px;color:${ds.text};margin-bottom:8px;line-height:1.5;">• ${l.trim()}</p>`).join('')}</div>
            </div>
        </div>`;
    }

    render_image_right(slide, ds) {
        const img = slide.userImage || slide.image || '';
        const text = this.processText(slide.content, 300);
        return `<div style="height:100%;display:flex;gap:24px;">
            <div style="flex:1;display:flex;flex-direction:column;justify-content:center;">
                <h2 style="font-family:${ds.font},sans-serif;font-size:clamp(16px,2.5vw,22px);color:${ds.primary};margin-bottom:16px;">${slide.title}</h2>
                <p style="font-size:15px;color:${ds.text};line-height:1.7;">${text}</p>
            </div>
            <div style="width:42%;display:flex;align-items:center;justify-content:center;">
                ${img ? `<img src="${img}" style="width:100%;max-height:85%;object-fit:cover;border-radius:16px;border:2px solid ${ds.primary};box-shadow:0 0 30px ${ds.primary}33;">` : `<div style="width:100%;height:70%;background:${ds.surface};border-radius:16px;display:flex;align-items:center;justify-content:center;color:${ds.textSecondary};">📷</div>`}
            </div>
        </div>`;
    }

    render_comparison(slide, ds) {
        return `<div style="height:100%;">
            <h2 style="font-family:${ds.font},sans-serif;font-size:clamp(16px,2.5vw,22px);color:${ds.primary};margin-bottom:16px;text-align:center;">${slide.title}</h2>
            <div style="display:grid;grid-template-columns:1fr auto 1fr;gap:16px;align-items:center;height:calc(100% - 50px);">
                <div style="background:${ds.surface};border-radius:12px;padding:20px;text-align:center;">
                    <h3 style="color:${ds.primary};font-size:18px;">A</h3>
                    <p style="color:${ds.text};font-size:13px;">${this.processText(slide.content, 150)}</p>
                </div>
                <div style="font-size:32px;color:${ds.primary};font-weight:900;">VS</div>
                <div style="background:${ds.surface};border-radius:12px;padding:20px;text-align:center;">
                    <h3 style="color:${ds.accent};font-size:18px;">B</h3>
                    <p style="color:${ds.text};font-size:13px;">${this.processText(slide.content, 150)}</p>
                </div>
            </div>
        </div>`;
    }

    render_stats(slide, ds) {
        return `<div style="height:100%;">
            <h2 style="font-family:${ds.font},sans-serif;font-size:clamp(16px,2.5vw,22px);color:${ds.primary};margin-bottom:20px;text-align:center;">${slide.title}</h2>
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:16px;">
                ${(slide.stats || [{v:'📊',l:'Data'},{v:'📈',l:'Growth'},{v:'🎯',l:'Target'},{v:'✅',l:'Done'}]).map(s=>`
                    <div style="background:${ds.surface};border-radius:12px;padding:20px;text-align:center;border:1px solid ${ds.primary}22;">
                        <div style="font-size:28px;font-weight:900;color:${ds.primary};">${s.v}</div>
                        <div style="font-size:11px;color:${ds.textSecondary};text-transform:uppercase;">${s.l}</div>
                    </div>
                `).join('')}
            </div>
        </div>`;
    }

    render_cta(slide, ds) {
        return `<div style="display:flex;flex-direction:column;justify-content:center;align-items:center;height:100%;text-align:center;">
            <div style="font-size:56px;margin-bottom:20px;">🔥</div>
            <h2 style="font-family:${ds.font},sans-serif;font-size:clamp(22px,4vw,36px);color:${ds.primary};margin-bottom:12px;">${slide.title}</h2>
            <p style="font-size:16px;color:${ds.textSecondary};max-width:55%;margin-bottom:24px;">${slide.content}</p>
            <div style="background:linear-gradient(135deg,${ds.primary},${ds.secondary});padding:12px 32px;border-radius:50px;color:white;font-weight:700;">${slide.button || 'Get Started'} →</div>
        </div>`;
    }

    // ========== ВСПОМОГАТЕЛЬНЫЕ ==========

    processText(text, maxLen = 0) {
        if (!text) return '';
        let t = String(text);
        if (maxLen > 0 && t.length > maxLen) t = t.substring(0, maxLen) + '...';
        return t.replace(/\n/g, '<br>');
    }

    createAllThumbnails(slides, activeIdx) {
        const ds = this.designSystem || this.defaultDesign();
        return slides.map((s, i) => `
            <div class="slide-thumb" data-slide-index="${i}" style="min-width:160px;height:85px;background:${i===activeIdx?ds.surface:ds.background};border:2px solid ${i===activeIdx?ds.primary:ds.surface};border-radius:8px;padding:10px;cursor:pointer;transition:0.3s;position:relative;">
                <div style="font-size:14px;">${s.type==='hero'?'🚀':s.type==='cta'?'🎯':'📄'}</div>
                <p style="font-size:10px;color:${ds.text};overflow:hidden;text-overflow:ellipsis;white-space:nowrap;margin:4px 0 0;">${s.title}</p>
                ${i===activeIdx?`<div style="position:absolute;bottom:0;left:0;width:100%;height:2px;background:${ds.primary};"></div>`:''}
            </div>
        `).join('');
    }
}

const slideGenerator = new SlideGenerator();

// Обработчик кликов по миниатюрам
document.addEventListener('click', function(e) {
    const thumb = e.target.closest('.slide-thumb');
    if (thumb && typeof window.selectPresentationSlide === 'function') {
        const idx = parseInt(thumb.getAttribute('data-slide-index'));
        if (!isNaN(idx)) window.selectPresentationSlide(idx);
    }
});

console.log('✅ Slide Generator v3.0 PRO готов');
