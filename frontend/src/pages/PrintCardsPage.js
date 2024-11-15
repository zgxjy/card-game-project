import React, { useState,useEffect } from 'react';
const PrintCardsStruture = ({ cards }) => {
  // A4 尺寸为 210mm x 297mm
  // 假设每张卡片为 63mm x 88mm (标准扑克牌尺寸)
  // 每页可以放 3 x 3 = 9 张卡片

  if (!cards || cards.length === 0) {
    return (
      <div className="print-container flex justify-center items-center h-full">
        <h2 className="text-xl font-semibold">暂无数据</h2>
      </div>
    );
  }

  return (
    <div className="print-container">
      {/* 打印预览区域 */}
      <style>{`
        @media print {
          @page {
            size: A4;
            margin: 10mm;
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
            page-break-after: always;
            height: 297mm;
            padding: 5mm;
            box-sizing: border-box;
          }

          .print-grid {
            display: grid;
            grid-template-columns: repeat(3, 63mm);
            grid-template-rows: repeat(3, 88mm);
            gap: 5mm;
          }

          .print-card {
            border: 1px solid #ccc;
            padding: 5mm;
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
          }

          .print-card img {
            max-width: 53mm;
            max-height: 40mm;
            object-fit: contain;
          }
        }
      `}</style>

      {/* 打印控制按钮 */}
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

      {/* 分页显示卡片 */}
      {Array.from({ length: Math.ceil(cards.length / 9) }).map((_, pageIndex) => (
        <div key={pageIndex} className="print-page">
          <div className="print-grid">
            {cards.slice(pageIndex * 9, (pageIndex + 1) * 9).map((card, index) => (
              <div key={card._id || index} className="print-card">
                {card.image && (
                  <div className="mb-2">
                    <img src={card.image} alt={card.title} />
                  </div>
                )}
                <h3 className="text-lg font-bold mb-1">{card.title}</h3>
                {card.cardtype && (
                  <div className="text-sm text-gray-600 mb-1">{card.cardtype}</div>
                )}
                {card.description && (
                  <p className="text-sm">{card.description}</p>
                )}
                {card.project && (
                  <div className="text-xs text-gray-500 mt-auto">
                    {card.project}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};


const PrintCardsPage = () => {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    const loadCards = async () => {
      // 获取 sessionStorage 中的数据并解析为数组
      const cardsData = sessionStorage.getItem('printCards');
      
      // 确保数据有效并且是一个数组
      try {
        const parsedData = cardsData ? JSON.parse(cardsData) : [];
        if (Array.isArray(parsedData)) {
          setCards(parsedData);
        } else {
          console.warn('Invalid card data format');
          setCards([]);  // 如果数据格式不对，设置为空数组
        }
      } catch (error) {
        console.error('Error parsing cards data', error);
        setCards([]);  // 解析失败时设置为空数组
      }
    };
    
    loadCards();
  }, []);  // 空依赖数组确保只在组件加载时执行一次

  console.log(cards); // 可用于调试，查看加载的数据

  return (
    <div className="print-container">
      <PrintCardsStruture cards={cards} />
    </div>
  );
};

export default PrintCardsPage;
