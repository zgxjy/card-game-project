// PrintPreview.jsx
import React, { useRef} from 'react';
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

  // 计算总页数 - 考虑双面打印模式
  const calculateTotalPages = () => {
    const cardsPerPage = layout.cardsPerPage;
    const totalCards = cards.length;
    const basicPages = Math.ceil(totalCards / cardsPerPage);
    
    // 双面打印模式下，每张卡片需要两页
    return displayMode === 'duplex' ? basicPages * 2 : basicPages;
  };

  // 判断当前页是否为背面
  const isBackPage = (pageIndex) => {
    if (displayMode === 'duplex') {
      return pageIndex % 2 === 1; // 偶数页显示背面
    }
    return displayMode === 'back_only';
  };

  // 获取实际卡片索引
  const getCardsForPage = (pageIndex) => {
    const cardsPerPage = layout.cardsPerPage;
    
    if (displayMode === 'duplex') {
      // 在双面打印模式下，需要计算实际的卡片索引
      const actualPageIndex = Math.floor(pageIndex / 2);
      const startIndex = actualPageIndex * cardsPerPage;
      const pageCards = cards.slice(startIndex, startIndex + cardsPerPage);
      
      // 确保卡片的正反面位置完全对应
      return pageCards;
    } else {
      // 单面打印模式保持原样
      const startIndex = pageIndex * cardsPerPage;
      return cards.slice(startIndex, startIndex + cardsPerPage);
    }
  };

  const totalPages = calculateTotalPages();

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
                    isFlipped={isBackPage(pageIndex)}
                    style={cardStyle}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="page-number absolute bottom-2 right-2 text-gray-400">
            Page {pageIndex + 1} of {totalPages}
            {displayMode === 'duplex' && (
              <span className="ml-2">
                ({isBackPage(pageIndex) ? '背面' : '正面'})
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}