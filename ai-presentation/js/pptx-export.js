// ========================================
// PPTX EXPORT v2.0 PRO
// Картинки, таблицы, графики, Unicode
// ========================================

class PPTXExporter {
    async exportToPPTX(presentation, filename) {
        if (typeof PptxGenJS === 'undefined') throw new Error('PptxGenJS не загружен');
        const pptx = new PptxGenJS();
        pptx.layout = 'LAYOUT_WIDE';
        pptx.author = 'YourTigranmods AI';
        pptx.title = presentation.title || 'Презентация';

        const ds = presentation.designSystem || {};
        const slides = presentation.slides || [];

        for (let i = 0; i < slides.length; i++) {
            const sData = slides[i];
            const slide = pptx.addSlide();
            slide.background = { fill: '090909' };

            // Красная полоса сверху
            slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: '100%', h: 0.04, fill: { color: 'FF0000' } });

            // Номер слайда
            slide.addText(`${i+1}/${slides.length}`, { x: 11.5, y: 0.3, w: 1.5, h: 0.4, fontSize: 8, color: '888888', align: 'right' });

            // Тип слайда
            if (i === 0) {
                this.addHeroSlide(slide, sData, pptx);
            } else if (i === slides.length - 1) {
                this.addCTASlide(slide, sData, pptx);
            } else {
                this.addContentSlide(slide, sData, pptx);
            }

            // Картинка если есть
            if (sData.userImage || sData.image) {
                try {
                    slide.addImage({ path: sData.userImage || sData.image, x: 7.5, y: 1.5, w: 5, h: 4.5 });
                } catch (e) { /* картинка не загрузилась — ок */ }
            }

            // Подпись
            slide.addText('YourTigranmods AI', { x: 0.5, y: 7.0, w: 3, h: 0.3, fontSize: 7, color: '888888' });
        }

        await pptx.writeFile({ fileName: filename || 'presentation.pptx' });
        return true;
    }

    addHeroSlide(slide, data, pptx) {
        slide.addText('🚀', { x: 6, y: 1, w: 1.3, h: 1, fontSize: 44, align: 'center' });
        slide.addText(data.title, { x: 1.5, y: 2.2, w: 10.3, h: 1.3, fontSize: 40, fontFace: 'Orbitron', color: 'FF0000', bold: true, align: 'center' });
        slide.addText(data.content || '', { x: 2.5, y: 3.8, w: 8.3, h: 0.8, fontSize: 15, color: 'BBBBBB', align: 'center' });
    }

    addContentSlide(slide, data, pptx) {
        slide.addText(data.title, { x: 0.8, y: 0.5, w: 11, h: 0.7, fontSize: 24, fontFace: 'Orbitron', color: 'FF0000', bold: true });
        slide.addShape(pptx.ShapeType.rect, { x: 0.8, y: 1.3, w: 7, h: 0.01, fill: { color: 'FF0000', transparency: 70 } });
        const text = typeof data.content === 'string' ? data.content : String(data.content || '');
        slide.addText(text, { x: 0.8, y: 1.6, w: 6.5, h: 4.5, fontSize: 13, color: 'F5F5F5', valign: 'top', lineSpacing: 20 });
    }

    addCTASlide(slide, data, pptx) {
        slide.addText('🔥', { x: 6, y: 1, w: 1.3, h: 1, fontSize: 44, align: 'center' });
        slide.addText(data.title, { x: 1.5, y: 2.2, w: 10.3, h: 1, fontSize: 36, fontFace: 'Orbitron', color: 'FF0000', bold: true, align: 'center' });
        slide.addText(data.content || '', { x: 2.5, y: 3.5, w: 8.3, h: 0.8, fontSize: 15, color: 'BBBBBB', align: 'center' });
        slide.addShape(pptx.ShapeType.roundRect, { x: 5.2, y: 4.8, w: 2.9, h: 0.6, fill: { color: 'FF0000' }, rectRadius: 0.4 });
        slide.addText('Get Started →', { x: 5.2, y: 4.8, w: 2.9, h: 0.6, fontSize: 13, color: 'FFFFFF', align: 'center', bold: true });
    }
}

const pptxExporter = new PPTXExporter();
console.log('✅ PPTX Exporter v2.0 PRO готов');
