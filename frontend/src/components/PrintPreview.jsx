import React, { useRef} from 'react';
import { usePrintConfig } from './PrintConfig';
import GameCard from './GameCard';


export function PrintPreview({ cards }) {
  const { calculateLayout, displayMode, paperSize, cardSize, margins, spacing, pdfQuality,flipDirection} = usePrintConfig();
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
    //确保容器大小的精确
    boxSizing: 'border-box',
  };

  const pageStyle = {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    position: 'relative',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    padding: `${mmToPx(margins.top)}px ${mmToPx(margins.right)}px ${mmToPx(margins.bottom)}px ${mmToPx(margins.left)}px`,
    transform: 'none',
    overflow: 'hidden',
  };

  const cardStyle = {
    width: `${mmToPx(cardSize.width*pdfQuality)}px`,
    height: `${mmToPx(cardSize.height*pdfQuality)}px`,
    transform: 'none',
  };

  // 新增：根据是否是背面页面调整网格布局
  const getGridStyle = (pageIndex) => {
    const baseGridStyle = {
      display: 'grid',
      gridTemplateColumns: `repeat(${layout.cardsPerRow}, 1fr)`,
      gap: `${mmToPx(spacing.vertical)}px ${mmToPx(spacing.horizontal)}px`,
      height: '100%',
      position: 'relative',
    };

    if (displayMode === 'duplex' && isBackPage(pageIndex)) {
      // 对于背面页面，反转列顺序
      return {
        ...baseGridStyle,
        direction: 'rtl', // 从右到左排列
      };
    }

    return baseGridStyle;
  };

  const calculateTotalPages = () => {
    const cardsPerPage = layout.cardsPerPage;
    const totalCards = cards.length;
    const basicPages = Math.ceil(totalCards / cardsPerPage);
    
    return displayMode === 'duplex' ? basicPages * 2 : basicPages;
  };

  const isBackPage = (pageIndex) => {
    if (displayMode === 'duplex') {
      return pageIndex % 2 === 1; // 偶数页显示背面
    }
    return displayMode === 'back_only';
  };

  const getCardsForPage = (pageIndex) => {
    const cardsPerPage = layout.cardsPerPage;
    
    if (displayMode === 'duplex') {
      const actualPageIndex = Math.floor(pageIndex / 2);
      const startIndex = actualPageIndex * cardsPerPage;
      const pageCards = cards.slice(startIndex, startIndex + cardsPerPage); 
    
      if (isBackPage(pageIndex)) {
        if (flipDirection === "long_edge") {
          // 长边翻转：上下反转每一列的卡片
          // const rowCount = layout.cardsPerColumn;
          const colCount = layout.cardsPerRow;
          const reorderedCards = [];
          
          for (let col = 0; col < colCount; col++) {
            // 获取当前列的卡片，并反转顺序
            const columnCards = pageCards
              .filter((_, index) => index % colCount === col)
              .reverse();
            
            // 将反转后的列卡片重新插入
            columnCards.forEach((card, rowIndex) => {
              const insertIndex = rowIndex * colCount + col;
              reorderedCards[insertIndex] = card;
            });
          }
          
          return reorderedCards;
        } else {
          // 短边翻转：从底部重新排列网格
          const rowCount = layout.cardsPerColumn;
          const colCount = layout.cardsPerRow;
          const reorderedCards = [];
          
          for (let row = rowCount - 1; row >= 0; row--) {
            for (let col = 0; col < colCount; col++) {
              const index = row * colCount + col;
              if (index < pageCards.length) {
                reorderedCards.push(pageCards[index]);
              }
            }
          }
          
          return reorderedCards;
        }
      }
      
      return pageCards;
    } else {
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
            <div style={getGridStyle(pageIndex)}>
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