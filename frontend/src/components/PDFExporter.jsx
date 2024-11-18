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
    this.container = null;
    this.root = null;
  }

  // 创建渲染容器
  initContainer() {
    if (!this.container) {
      // 创建容器元素
      this.container = document.createElement('div');
      this.container.style.position = 'absolute';
      this.container.style.left = '-9999px';
      this.container.style.top = '0';
      this.container.style.width = `${this.mmToPx(this.config.cardSize.width)}px`;
      this.container.style.height = `${this.mmToPx(this.config.cardSize.height)}px`;
      document.body.appendChild(this.container);
      
      // 创建React根节点
      this.root = createRoot(this.container);
    }
    return this.container;
  }

  // 清理渲染容器
  cleanup() {
    if (this.root) {
      this.root.unmount();
    }
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
    this.container = null;
    this.root = null;
  }

  // 统一的转换函数
  mmToPx(mm) {
    return mm * 3.7795275591;
  }

  pxToMm(px) {
    return px / 3.7795275591;
  }

  async generateCardImage(card, isFlipped) {
    // 确保容器已初始化
    const container = this.initContainer();
    const containerWidth = this.mmToPx(this.config.cardSize.width);
    const containerHeight = this.mmToPx(this.config.cardSize.height);
    
    return new Promise((resolve, reject) => {
      // 使用已创建的React根节点渲染
      this.root.render(
        <GameCard
          {...card}
          isFlipped={isFlipped}
          style={{
            width: `${containerWidth}px`,
            height: `${containerHeight}px`
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
                  width: containerWidth,
                  height: containerHeight
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

  async generate(onProgress) {
    try {
      let pageIndex = 0;
      let hasMorePages = true;

      while (hasMorePages) {
        hasMorePages = await this.generatePage(pageIndex, onProgress);
        pageIndex++;
      }

      return this.pdf;
    } finally {
      // 确保在生成完成后清理容器
      this.cleanup();
    }
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