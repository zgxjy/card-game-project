// PrintPreview.jsx
import React from 'react';
import { usePrintConfig } from './PrintConfig';
import GameCard from './GameCard';

export function PrintPreview({ cards }) {
  const { calculateLayout, displayMode, paperSize, cardSize, margins, spacing } = usePrintConfig();
  const layout = calculateLayout();

  const mmToPx = (mm) => mm * 3.7795275591;

  const pageStyle = {
    width: `${mmToPx(paperSize.width)}px`,
    height: `${mmToPx(paperSize.height)}px`,
    backgroundColor: 'white',
    position: 'relative',
    margin: '20px auto',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    padding: `${mmToPx(margins.top)}px ${mmToPx(margins.right)}px ${mmToPx(margins.bottom)}px ${mmToPx(margins.left)}px`
  };

  const cardStyle = {
    width: `${mmToPx(cardSize.width)}px`,
    height: `${mmToPx(cardSize.height)}px`
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${layout.cardsPerRow}, 1fr)`,
    gap: `${mmToPx(spacing.vertical)}px ${mmToPx(spacing.horizontal)}px`,
    height: '100%'
  };

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
    return cards.slice(startIndex, startIndex + layout.cardsPerPage).map((card, index) => ({
      ...card,
      isFlipped: shouldShowBack(pageIndex, index)
    }));
  };

  const totalPages = Math.ceil(cards.length / layout.cardsPerPage);

  return (
    <div className="print-preview overflow-auto">
      {Array.from({ length: totalPages }).map((_, pageIndex) => (
        <div key={pageIndex} style={pageStyle} className="print-page">
          <div style={gridStyle}>
            {getCardsForPage(pageIndex).map((card, cardIndex) => (
              <div key={cardIndex} style={cardStyle} className="card-wrapper">
                <GameCard 
                  {...card} 
                  style={{
                    width: `${mmToPx(cardSize.width)}px`,
                    height: `${mmToPx(cardSize.height)}px`
                  }}
                />
              </div>
            ))}
          </div>
          <div className="page-number absolute bottom-2 right-2 text-gray-400">
            Page {pageIndex + 1} of {totalPages}
          </div>
        </div>
      ))}
    </div>
  );
}