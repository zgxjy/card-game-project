import React, { useRef } from 'react';
import { usePrintConfig } from './PrintConfig';
import GameCard from './GameCard';

export function PrintPreview({ cards }) {
  const { 
    calculateLayout, 
    displayMode, 
    paperSize, 
    cardSize, 
    margins, 
    spacing, 
    pdfQuality, 
    flipDirection 
  } = usePrintConfig();
  const layout = calculateLayout();
  const previewRef = useRef(null);

  const mmToPx = (mm) => mm * 3.7795275591;
  
  const actualWidth = mmToPx(paperSize.width * pdfQuality);
  const actualHeight = mmToPx(paperSize.height * pdfQuality);

  const pageContainerStyle = {
    width: `${actualWidth}px`,
    height: `${actualHeight}px`,
    margin: '20px auto',
    position: 'relative',
    transform: 'none',
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
    width: `${mmToPx(cardSize.width * pdfQuality)}px`,
    height: `${mmToPx(cardSize.height * pdfQuality)}px`,
    transform: 'none',
  };

  const getGridStyle = (pageIndex) => {
    const baseGridStyle = {
      display: 'grid',
      gridTemplateColumns: `repeat(${layout.cardsPerRow}, 1fr)`,
      gap: `${mmToPx(spacing.vertical)}px ${mmToPx(spacing.horizontal)}px`,
      height: '100%',
      position: 'relative',
    };

    if (displayMode === 'duplex' && isBackPage(pageIndex)) {
      if (flipDirection === 'long_edge') {
        return {
          ...baseGridStyle,
          transform: 'scaleX(-1)',
        };
      } else {
        return {
          ...baseGridStyle,
          transform: 'scaleY(-1)',
        };
      }
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
      return pageIndex % 2 === 1;
    }
    return displayMode === 'back_only';
  };

  const getCardsForPage = (pageIndex) => {
    const cardsPerPage = layout.cardsPerPage;
    
    if (displayMode === 'duplex') {
      const actualPageIndex = Math.floor(pageIndex / 2);
      const startIndex = actualPageIndex * cardsPerPage;
      return cards.slice(startIndex, startIndex + cardsPerPage);
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
            <div 
              style={getGridStyle(pageIndex)}
            >
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