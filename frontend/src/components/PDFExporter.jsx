import React, { useState, useRef } from 'react';
import { usePrintConfig } from './PrintConfig';
import domtoimage from 'dom-to-image';
import jsPDF from 'jspdf';

class PDFGenerator {
  constructor(config) {
    this.config = config;
    this.pdf = new jsPDF({
      unit: 'mm',
      format: [config.paperSize.width*config.pdfQuality, config.paperSize.height*config.pdfQuality],
      orientation: 'portrait',
      compress: false // 禁用PDF压缩以保持图片质量
    });
  }

  mmToPx(mm) {
    return mm * 3.7795275591;
  }

  pxToMm(px) {
    return px / 3.7795275591;
  }
  
  async generateFromPages(pages, onProgress) {
    // 跳过第一页，从第二页开始处理
    const pageArray = Array.from(pages).slice(1);
    
    for (let i = 0; i < pageArray.length; i++) {
      const page = pageArray[i];
      
      if (i > 0) {
        this.pdf.addPage();
      }

      try {
        // 等待所有内容加载完成
        await document.fonts.ready;
        
        // 确保页面内所有图片加载完成
        const images = Array.from(page.getElementsByTagName('img'));
        await Promise.all(images.map(img => {
          if (img.complete) return Promise.resolve();
          return new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
          });
        }));

        // 计算实际尺寸
        const width = this.mmToPx(this.config.paperSize.width*this.config.pdfQuality);
        const height = this.mmToPx(this.config.paperSize.height*this.config.pdfQuality);

        // 优化的 domtoimage 配置
        const options = {
          width: width,
          height: height,
          style: {
            transform: 'none',
            width: `${width}px`,
            height: `${height}px`
          },
          skipFonts: false,
          cacheBust: true,
          foreignObjectRendering: true,
          useCORS: true,
          backgroundColor: '#ffffff'
        };

        // 使用 toPng 获取更高质量的输出
        const dataUrl = await domtoimage.toPng(page, options);

        // 添加到 PDF，使用高质量设置
        this.pdf.addImage(
          dataUrl,
          'PNG',
          0,
          0,
          this.config.paperSize.width*this.config.pdfQuality,
          this.config.paperSize.height*this.config.pdfQuality,
          undefined,
          'NONE' // 使用无压缩模式
        );

        if (onProgress) {
          onProgress(((i + 1) / pageArray.length) * 100);
        }
      } catch (error) {
        console.error(`Failed to generate page ${i + 1}:`, error);
        throw error;
      }
    }

    return this.pdf;
  }
}

export function PDFExporter({ onExport }) {
  const [exporting, setExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const printConfig = usePrintConfig();
  const exportingRef = useRef(false);

  const handleExport = async () => {
    if (exportingRef.current) {
      return;
    }

    const printPages = document.querySelectorAll('.print-page');
    if (!printPages.length) {
      console.error('No print pages found');
      return;
    }

    setExporting(true);
    setProgress(0);
    exportingRef.current = true;

    try {
      const generator = new PDFGenerator(printConfig);
      const pdf = await generator.generateFromPages(Array.from(printPages), (progress) => {
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
        disabled={exporting}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {exporting ? `导出中 ${progress}%` : '导出 PDF'}
      </button>
    </div>
  );
}