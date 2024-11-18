import React, { useState, useRef } from 'react';
import { usePrintConfig } from './PrintConfig';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

class PDFGenerator {
  constructor(config) {
    this.config = config;
    this.pdf = new jsPDF({
      unit: 'mm',
      format: [config.paperSize.width, config.paperSize.height],
      orientation: 'portrait'
    });
  }

  // 转换函数
  mmToPx(mm) {
    return mm * 3.7795275591;
  }

  pxToMm(px) {
    return px / 3.7795275591;
  }

  async generateFromPages(pages, onProgress) {
    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      
      // 如果不是第一页，添加新页
      if (i > 0) {
        this.pdf.addPage();
      }

      try {
        // 使用html2canvas捕获整个页面
        const canvas = await html2canvas(page, {
          scale: 2, // 提高清晰度
          useCORS: true,
          allowTaint: true,
          backgroundColor: null,
          width: this.mmToPx(this.config.paperSize.width),
          height: this.mmToPx(this.config.paperSize.height)
        });

        // 将canvas内容添加到PDF
        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        this.pdf.addImage(
          imgData,
          'JPEG',
          0,
          0,
          this.config.paperSize.width,
          this.config.paperSize.height
        );

        // 更新进度
        if (onProgress) {
          onProgress(((i + 1) / pages.length) * 100);
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

    // 获取所有打印预览页面
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