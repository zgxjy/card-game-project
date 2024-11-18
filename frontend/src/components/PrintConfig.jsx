// PrintConfigProvider.js
import React, { createContext, useContext, useState, useCallback } from 'react';

const PrintConfigContext = createContext();

export const PAPER_SIZES = {
  A4: { width: 210, height: 297, name: 'A4' },
  A3: { width: 297, height: 420, name: 'A3' },
  LETTER: { width: 215.9, height: 279.4, name: 'Letter' }
};

export const CARD_SIZES = {
  POKER: { width: 63, height: 88, name: 'Poker' },
  TAROT: { width: 70, height: 120, name: 'Tarot' },
  CUSTOM: { width: 0, height: 0, name: 'Custom' }
};

export const DISPLAY_MODES = {
  FRONT_ONLY: 'front_only',
  BACK_ONLY: 'back_only',
  ALTERNATING: 'alternating',
  MERGED: 'merged'
};

export function PrintConfigProvider({ children }) {
  const [paperSize, setPaperSize] = useState(PAPER_SIZES.A4);
  const [cardSize, setCardSize] = useState(CARD_SIZES.POKER);
  const [customCardSize, setCustomCardSize] = useState({ width: 0, height: 0 });
  const [displayMode, setDisplayMode] = useState(DISPLAY_MODES.FRONT_ONLY);
  const [margins, setMargins] = useState({ top: 5, right: 5, bottom: 5, left: 5 });
  const [spacing, setSpacing] = useState({ horizontal: 5, vertical: 5 });

  const calculateLayout = useCallback(() => {
    const currentCardSize = cardSize === CARD_SIZES.CUSTOM ? customCardSize : cardSize;
    const printableWidth = paperSize.width - margins.left - margins.right;
    const printableHeight = paperSize.height - margins.top - margins.bottom;
  
    const cardsPerRow = Math.floor(printableWidth / (currentCardSize.width + spacing.horizontal));
    const cardsPerColumn = Math.floor(printableHeight / (currentCardSize.height + spacing.vertical));
  
    return {
      cardsPerPage: cardsPerRow * cardsPerColumn,
      cardsPerRow,
      cardsPerColumn,
      pageWidth: paperSize.width,
      pageHeight: paperSize.height,
      cardWidth: currentCardSize.width,
      cardHeight: currentCardSize.height,
      spacing: {  // 添加spacing属性
        horizontal: spacing.horizontal,
        vertical: spacing.vertical
      }
    };
  }, [paperSize, cardSize, customCardSize, margins, spacing]);

  const value = {
    paperSize,
    setPaperSize,
    cardSize,
    setCardSize,
    customCardSize,
    setCustomCardSize,
    displayMode,
    setDisplayMode,
    margins,
    setMargins,
    spacing,
    setSpacing,
    calculateLayout
  };

  return (
    <PrintConfigContext.Provider value={value}>
      {children}
    </PrintConfigContext.Provider>
  );
}

export function usePrintConfig() {
  const context = useContext(PrintConfigContext);
  if (!context) {
    throw new Error('usePrintConfig must be used within a PrintConfigProvider');
  }
  return context;
}

// PrintConfigurator.js
export function PrintConfigurator() {
  const {
    paperSize,
    setPaperSize,
    cardSize,
    setCardSize,
    customCardSize,
    setCustomCardSize,
    displayMode,
    setDisplayMode,
    margins,
    setMargins,
    spacing,
    setSpacing
  } = usePrintConfig();

  return (
    <div className="print-configurator p-4 bg-white rounded-lg shadow">
      {/* Paper Size Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">纸张尺寸</label>
        <select
          value={paperSize.name}
          onChange={(e) => setPaperSize(PAPER_SIZES[e.target.value])}
          className="w-full p-2 border rounded"
        >
          {Object.entries(PAPER_SIZES).map(([key, size]) => (
            <option key={key} value={key}>
              {size.name} ({size.width}mm × {size.height}mm)
            </option>
          ))}
        </select>
      </div>

      {/* Card Size Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">卡牌尺寸</label>
        <select
          value={cardSize.name}
          onChange={(e) => setCardSize(CARD_SIZES[e.target.value])}
          className="w-full p-2 border rounded mb-2"
        >
          {Object.entries(CARD_SIZES).map(([key, size]) => (
            <option key={key} value={key}>
              {size.name} {key !== 'CUSTOM' && `(${size.width}mm × ${size.height}mm)`}
            </option>
          ))}
        </select>

        {cardSize === CARD_SIZES.CUSTOM && (
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs mb-1">宽度 (mm)</label>
              <input
                type="number"
                value={customCardSize.width}
                onChange={(e) => setCustomCardSize({ ...customCardSize, width: Number(e.target.value) })}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-xs mb-1">高度 (mm)</label>
              <input
                type="number"
                value={customCardSize.height}
                onChange={(e) => setCustomCardSize({ ...customCardSize, height: Number(e.target.value) })}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
        )}
      </div>

      {/* Display Mode Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">展示模式</label>
        <select
          value={displayMode}
          onChange={(e) => setDisplayMode(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value={DISPLAY_MODES.FRONT_ONLY}>仅正面</option>
          <option value={DISPLAY_MODES.BACK_ONLY}>仅背面</option>
          <option value={DISPLAY_MODES.ALTERNATING}>正反交替</option>
          <option value={DISPLAY_MODES.MERGED}>正反合并</option>
        </select>
      </div>

      {/* Margins and Spacing */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">边距和间距</label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs mb-1">页面边距 (mm)</label>
            <input
              type="range"
              min="5"
              max="30"
              value={margins.top}
              onChange={(e) => setMargins({ ...margins, top: Number(e.target.value) })}
              className="w-full"
            />
            <span className="text-xs">{margins.top}mm</span>
          </div>
          <div>
            <label className="block text-xs mb-1">卡牌间距 (mm)</label>
            <input
              type="range"
              min="2"
              max="20"
              value={spacing.horizontal}
              onChange={(e) => setSpacing({ horizontal: Number(e.target.value), vertical: Number(e.target.value) })}
              className="w-full"
            />
            <span className="text-xs">{spacing.horizontal}mm</span>
          </div>
        </div>
      </div>
    </div>
  );
}