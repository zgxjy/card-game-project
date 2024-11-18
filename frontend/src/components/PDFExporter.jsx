import React, { useState, useRef } from 'react';
import { usePrintConfig } from './PrintConfig';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { createRoot } from 'react-dom/client';
import GameCard from './GameCard';



class PDFGenerator {
  constructor(config, cards) {
    this.config = config;
    this.cards = cards;
    this.pdf = new jsPDF({
      unit: 'mm',
      format: [config.paperSize.width, config.paperSize.height],
      orientation: 'portrait'
    });
    this.containerRef = null;
    this.rootRef = null;
  }

  shouldShowBack(pageIndex, cardIndex) {
    switch (this.config.displayMode) {
      case 'back_only':
        return true;
      case 'alternating':
        return pageIndex % 2 === 1;
      case 'merged':
        return cardIndex % 2 === 1;
      default:
        return false;
    }
  }

  async generate(onProgress) {
    let pageIndex = 0;
    let hasMorePages = true;

    while (hasMorePages) {
      hasMorePages = await this.generatePage(pageIndex, onProgress);
      pageIndex++;
    }

    return this.pdf;
  }

  // 统一的转换函数
  mmToPx(mm) {
    return mm * 3.7795275591;
  }

  pxToMm(px) {
    return px / 3.7795275591;
  }

  initContainer() {
    if (!this.containerRef) {
      const container = document.createElement('div');
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      container.style.width = `${this.mmToPx(this.config.cardSize.width)}px`;
      container.style.height = `${this.mmToPx(this.config.cardSize.height)}px`;
      document.body.appendChild(container);
      this.containerRef = container;
      this.rootRef = createRoot(container);
    }
    return this.containerRef;
  }

  async generateCardImage(card, isFlipped) {
    const container = this.initContainer();
    
    return new Promise((resolve, reject) => {
      this.rootRef.render(
        <GameCard
          {...card}
          isFlipped={isFlipped}
          style={{
            width: `${this.mmToPx(this.config.cardSize.width)}px`,
            height: `${this.mmToPx(this.config.cardSize.height)}px`
          }}
        />
      );

      // 等待图片加载完成
      const checkRender = () => {
        const images = container.getElementsByTagName('img');
        const imagePromises = Array.from(images).map(img => {
          if (img.complete) return Promise.resolve();
          return new Promise(res => {
            img.onload = res;
            img.onerror = res;
          });
        });

        Promise.all(imagePromises)
          .then(() => {
            setTimeout(async () => {
              try {
                const canvas = await html2canvas(container.firstChild, {
                  scale: 2,
                  useCORS: true,
                  allowTaint: true,
                  backgroundColor: null,
                  width: this.mmToPx(this.config.cardSize.width),
                  height: this.mmToPx(this.config.cardSize.height)
                });
                resolve(canvas.toDataURL('image/jpeg', 1.0));
              } catch (error) {
                reject(error);
              }
            }, 100);
          });
      };

      checkRender();
    });
  }

  async generatePage(pageIndex, onProgress) {
    const layout = this.config.calculateLayout();
    const startIndex = pageIndex * layout.cardsPerPage;
    const pageCards = this.cards.slice(startIndex, startIndex + layout.cardsPerPage);
    
    if (pageCards.length === 0) return false;

    if (pageIndex > 0) {
      this.pdf.addPage();
    }

    for (let i = 0; i < pageCards.length; i++) {
      const card = pageCards[i];
      const row = Math.floor(i / layout.cardsPerRow);
      const col = i % layout.cardsPerRow;

      const x = this.config.margins.left + col * (this.config.cardSize.width + this.config.spacing.horizontal);
      const y = this.config.margins.top + row * (this.config.cardSize.height + this.config.spacing.vertical);

      try {
        const showBack = this.shouldShowBack(pageIndex, i);
        const cardImage = await this.generateCardImage(card, showBack);
        
        this.pdf.addImage(
          cardImage,
          'JPEG',
          x,
          y,
          this.config.cardSize.width,
          this.config.cardSize.height
        );

        onProgress(((pageIndex * layout.cardsPerPage + i + 1) / this.cards.length) * 100);
      } catch (error) {
        console.error(`Failed to generate card image at index ${i}:`, error);
      }
    }

    return true;
  }
}

export function PDFExporter({ onExport, cards }) {
  const [exporting, setExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const printConfig = usePrintConfig();
  const exportingRef = useRef(false);

  const handleExport = async () => {
    if (!cards || cards.length === 0 || exportingRef.current) {
      return;
    }

    setExporting(true);
    setProgress(0);
    exportingRef.current = true;

    try {
      const generator = new PDFGenerator(printConfig, cards);
      const pdf = await generator.generate((progress) => {
        setProgress(Math.round(progress));
      });

      pdf.save('cards.pdf');
      onExport?.();
    } catch (error) {
      console.error('PDF export failed:', error);
      throw error;
    } finally {
      setExporting(false);
      setProgress(0);
      exportingRef.current = false;
    }
  };

  return (
    <div className="pdf-exporter fixed bottom-4 right-4 z-50">
      <button
        onClick={handleExport}
        disabled={exporting || !cards || cards.length === 0}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {exporting ? `导出中 ${progress}%` : '导出 PDF'}
      </button>
    </div>
  );
}