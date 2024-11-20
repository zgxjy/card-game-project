// PrintPreview.jsx
import React, { useRef, useEffect } from 'react';
import { usePrintConfig } from './PrintConfig';
import GameCard from './GameCard';

export function PrintPreview({ cards }) {
  const { calculateLayout, displayMode, paperSize, cardSize, margins, spacing, pdfQuality } = usePrintConfig();
  const layout = calculateLayout();
  const previewRef = useRef(null);

  const mmToPx = (mm) => mm * 3.7795275591;
  
  const actualWidth = mmToPx(paperSize.width*pdfQuality);
  const actualHeight = mmToPx(paperSize.height*pdfQuality);

  const pageContainerStyle = {
    width: `${actualWidth}px`,
    height: `${actualHeight}px`,
    margin: '20px auto',
    position: 'relative',
    // 重要：移除任何可能影响定位的属性
    transform: 'none',
    // 确保容器大小精确
    boxSizing: 'border-box',
  };

  const pageStyle = {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    position: 'relative',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    padding: `${mmToPx(margins.top)}px ${mmToPx(margins.right)}px ${mmToPx(margins.bottom)}px ${mmToPx(margins.left)}px`,
    // 移除可能导致偏移的属性
    transform: 'none',
    // 确保内容不会溢出
    overflow: 'hidden',
  };

  const cardStyle = {
    width: `${mmToPx(cardSize.width*pdfQuality)}px`,
    height: `${mmToPx(cardSize.height*pdfQuality)}px`,
    // 移除不必要的变换
    transform: 'none',
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${layout.cardsPerRow}, 1fr)`,
    gap: `${mmToPx(spacing.vertical)}px ${mmToPx(spacing.horizontal)}px`,
    height: '100%',
    // 确保网格定位准确
    position: 'relative',
  };

  // 其他计算函数保持不变
  const shouldShowBack = (pageIndex, cardIndex) => {
    const globalIndex = pageIndex * layout.cardsPerPage + cardIndex;
    switch (displayMode) {
      case 'back_only':
        return true;
      case 'alternating':
        return pageIndex % 2 === 1;
      case 'merged':
        return globalIndex % 2 === 1;
      default:
        return false;
    }
  };

  const getCardsForPage = (pageIndex) => {
    const startIndex = pageIndex * layout.cardsPerPage;
    return cards.slice(startIndex, startIndex + layout.cardsPerPage);
  };

  const totalPages = Math.ceil(cards.length / layout.cardsPerPage);

  // 确保字体和图片加载完成
  useEffect(() => {
    const loadFonts = async () => {
      await document.fonts.ready;
      
      // 触发重绘
      if (previewRef.current) {
        previewRef.current.style.opacity = '0.99';
        requestAnimationFrame(() => {
          previewRef.current.style.opacity = '1';
        });
      }
    };
    
    loadFonts();
  }, []);

  return (
    <div className="print-preview" ref={previewRef}>
      {Array.from({ length: totalPages }).map((_, pageIndex) => (
        <div 
          key={pageIndex} 
          style={pageContainerStyle} 
          className="page-container"
        >
          <div
            style={pageStyle}
            className="print-page"
            data-page={pageIndex + 1}
          >
            <div style={gridStyle}>
              {getCardsForPage(pageIndex).map((card, cardIndex) => (
                <div 
                  key={cardIndex} 
                  style={cardStyle} 
                  className="card-wrapper"
                  data-card={cardIndex}
                >
                  <GameCard 
                    {...card} 
                    isFlipped={shouldShowBack(pageIndex, cardIndex)}
                    style={cardStyle}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="page-number absolute bottom-2 right-2 text-gray-400">
            Page {pageIndex + 1} of {totalPages}
          </div>
        </div>
      ))}
    </div>
  );
}