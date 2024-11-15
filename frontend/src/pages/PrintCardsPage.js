import React, { useState, useEffect } from 'react';
import GameCard from '../components/GameCard';

const PrintCardsPage = () => {
  const [cards, setCards] = useState([]);
  
  // A4 dimensions in pixels (assuming 96 DPI)
  // A4: 210mm × 297mm = 793px × 1122px
  const A4_WIDTH = 793;
  const A4_HEIGHT = 1122;
  
  // Card dimensions from your GameCard component (350px × 490px)
  // Converting to mm for print: approximately 长8.8cm X宽6.3cm
  const CARD_WIDTH = 350;
  const CARD_HEIGHT = 490;
  
  // Calculate cards per page based on A4 size
  // Adding margins and gaps between cards
  const MARGIN = 30; // 30px margin
  const GAP = 20; // 20px gap between cards
  
  const USABLE_WIDTH = A4_WIDTH - (2 * MARGIN);
  const USABLE_HEIGHT = A4_HEIGHT - (2 * MARGIN);
  
  const CARDS_PER_ROW = Math.floor((USABLE_WIDTH + GAP) / (CARD_WIDTH + GAP));
  const CARDS_PER_COLUMN = Math.floor((USABLE_HEIGHT + GAP) / (CARD_HEIGHT + GAP));
  const CARDS_PER_PAGE = CARDS_PER_ROW * CARDS_PER_COLUMN;

  useEffect(() => {
    const loadCards = async () => {
      try {
        const cardsData = sessionStorage.getItem('printCards');
        const parsedData = cardsData ? JSON.parse(cardsData) : [];
        if (Array.isArray(parsedData)) {
          setCards(parsedData);
        } else {
          setCards([]);
        }
      } catch (error) {
        console.error('Error parsing cards data', error);
        setCards([]);
      }
    };
    
    loadCards();
  }, []);

  return (
    <div className="print-container">
      <style>
        {`
          @media print {
            @page {
              size: A4;
              margin: 0;
            }
            
            body {
              margin: 0;
              padding: 0;
            }

            .no-print {
              display: none !important;
            }

            .print-container {
              width: 210mm;
              margin: 0 auto;
            }

            .print-page {
              width: 210mm;
              height: 297mm;
              page-break-after: always;
              padding: ${MARGIN}px;
              display: grid;
              grid-template-columns: repeat(${CARDS_PER_ROW}, 1fr);
              grid-template-rows: repeat(${CARDS_PER_COLUMN}, 1fr);
              gap: ${GAP}px;
            }

            .print-page:last-child {
              page-break-after: auto;
            }

            .card-wrapper {
              width: ${CARD_WIDTH}px;
              height: ${CARD_HEIGHT}px;
            }
          }

          /* Preview styles */
          .print-container {
            background: #f0f0f0;
            padding: 20px;
          }

          .print-page {
            background: white;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
            margin: 20px auto;
            width: ${A4_WIDTH}px;
            height: ${A4_HEIGHT}px;
            padding: ${MARGIN}px;
            display: grid;
            grid-template-columns: repeat(${CARDS_PER_ROW}, 1fr);
            grid-template-rows: repeat(${CARDS_PER_COLUMN}, 1fr);
            gap: ${GAP}px;
          }

          .card-wrapper {
            width: ${CARD_WIDTH}px;
            height: ${CARD_HEIGHT}px;
          }
        `}
      </style>

      {/* Print controls */}
      <div className="no-print fixed top-4 right-4 z-50 space-y-2">
        <button
          onClick={() => window.print()}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          打印/保存PDF
        </button>
        <button
          onClick={() => window.history.back()}
          className="w-full px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
        >
          返回
        </button>
      </div>

      {/* Cards pages */}
      {Array.from({ length: Math.ceil(cards.length / CARDS_PER_PAGE) }).map((_, pageIndex) => (
        <div key={pageIndex} className="print-page">
          {cards
            .slice(pageIndex * CARDS_PER_PAGE, (pageIndex + 1) * CARDS_PER_PAGE)
            .map((card, index) => (
              <div key={card._id || index} className="card-wrapper">
                <GameCard
                  isFlipped={false}
                  cardtype={card.cardtype}
                  title={card.title}
                  description={card.description}
                  tags={card.tags}
                  properties={card.properties}
                  image={card.image}
                />
              </div>
            ))}
        </div>
      ))}
    </div>
  );
};

export default PrintCardsPage;