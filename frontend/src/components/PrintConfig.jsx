// PrintConfig.jsx
import React, { createContext, useContext, useState, useCallback } from 'react';

const PrintConfigContext = createContext();

export const PAPER_SIZES = {
  A4: { width: 210, height: 297, name: 'A4' },
  A3: { width: 297, height: 420, name: 'A3' },
  LETTER: { width: 215.9, height: 279.4, name: 'Letter' }
};

export const CARD_SIZES = {
  POKER: { width: 63, height: 88, name: '扑克牌' },
  TAROT: { width: 70, height: 120, name: '塔罗牌' },
  MAGIC_THE_GATHERING: { width: 63, height: 88, name: '万智牌' },
  YU_GI_OH: { width: 59, height: 86, name: '游戏王' },
  THREE_KINGDOMS_KILL: { width: 62, height: 87, name: '三国杀' },
  HEARTHSTONE: { width: 65, height: 90, name: '炉石传说' },
  CATAN_ISLAND: { width: 75, height: 110, name: '卡坦岛' },
  TICKETS_TO_RIDE: { width: 68, height: 92, name: '车票之旅' },
  CUSTOM: { width: 63, height: 88, name: '自定义' } // 给自定义一个默认值
};

export const DISPLAY_MODES = {
  FRONT_ONLY: 'front_only',
  BACK_ONLY: 'back_only',
  DUPLEX: 'duplex'  // 新的双面打印模式
};

// 新增翻转方向常量
export const FLIP_DIRECTIONS = {
  LONG_EDGE: 'long_edge',     // 长边翻转（书本式）
  SHORT_EDGE: 'short_edge'    // 短边翻转（日历式）
};

// 首先添加清晰度常量
export const PDF_QUALITY = {
  LOW: 1,
  MEDIUM: 1.5, 
  HIGH: 2
};

export function PrintConfigProvider({ children }) {
  // 当前生效的配置
  const [activeConfig, setActiveConfig] = useState({
    paperSize: PAPER_SIZES.A4,
    cardSize: CARD_SIZES.POKER,
    customCardSize: { width: 63, height: 88 },
    displayMode: DISPLAY_MODES.FRONT_ONLY,
    margins: { top: 5, right: 5, bottom: 5, left: 5 },
    spacing: { horizontal: 5, vertical: 5 },
    pdfQuality: PDF_QUALITY.LOW, // 默认使用中等清晰度
    flipDirection: FLIP_DIRECTIONS.LONG_EDGE  // 新增默认值
  });

  // 编辑中的配置
  const [editingConfig, setEditingConfig] = useState({
    ...activeConfig
  });

  // 计算布局（使用当前生效的配置）
  const calculateLayout = useCallback(() => {
    const currentCardSize = activeConfig.cardSize === CARD_SIZES.CUSTOM 
      ? activeConfig.customCardSize 
      : activeConfig.cardSize;
    
    const printableWidth = activeConfig.paperSize.width - activeConfig.margins.left - activeConfig.margins.right;
    const printableHeight = activeConfig.paperSize.height - activeConfig.margins.top - activeConfig.margins.bottom;
  
    const cardsPerRow = Math.floor(printableWidth / (currentCardSize.width + activeConfig.spacing.horizontal));
    const cardsPerColumn = Math.floor(printableHeight / (currentCardSize.height + activeConfig.spacing.vertical));
  
    return {
      cardsPerPage: cardsPerRow * cardsPerColumn,
      cardsPerRow,
      cardsPerColumn,
      pageWidth: activeConfig.paperSize.width,
      pageHeight: activeConfig.paperSize.height,
      cardWidth: currentCardSize.width,
      cardHeight: currentCardSize.height,
      spacing: activeConfig.spacing,
    flipDirection: activeConfig.flipDirection  // 添加翻转方向
    };
  }, [activeConfig]);

  // 提交配置变更
  const applyConfig = useCallback(() => {
    setActiveConfig({...editingConfig});
  }, [editingConfig]);

  const value = {
    // 当前生效的配置
    ...activeConfig,
    // 编辑中的配置
    editingConfig,
    // 更新编辑中的配置的方法
    setPaperSize: (size) => setEditingConfig(prev => ({ ...prev, paperSize: size })),
    setCardSize: (size) => setEditingConfig(prev => ({ ...prev, cardSize: size })),
    setCustomCardSize: (size) => setEditingConfig(prev => ({ ...prev, customCardSize: size })),
    setDisplayMode: (mode) => setEditingConfig(prev => ({ ...prev, displayMode: mode })),
    setMargins: (margins) => setEditingConfig(prev => ({ ...prev, margins })),
    setSpacing: (spacing) => setEditingConfig(prev => ({ ...prev, spacing })),
    setPdfQuality: (quality) => setEditingConfig(prev => ({ ...prev, pdfQuality: quality })),
    setFlipDirection: (direction) => setEditingConfig(prev => ({ ...prev, flipDirection: direction })),
    // 布局计算
    calculateLayout,
    // 提交配置
    applyConfig,
    // 判断是否有未保存的更改
    hasChanges: JSON.stringify(activeConfig) !== JSON.stringify(editingConfig)
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

export function PrintConfigurator() {
  const {
    editingConfig,
    setPaperSize,
    setCardSize,
    setCustomCardSize,
    setDisplayMode,
    setMargins,
    setSpacing,
    setPdfQuality,
    setFlipDirection,
    applyConfig,
    hasChanges
  } = usePrintConfig();

  const handleCustomSizeChange = (dimension, value) => {
    const numValue = parseFloat(value) || 0;
    setCustomCardSize({
      ...editingConfig.customCardSize,
      [dimension]: numValue
    });
  };

  return (
    <div className="print-configurator p-4 bg-white rounded-lg shadow">
      {/* Paper Size Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">纸张尺寸</label>
        <select
          value={Object.keys(PAPER_SIZES).find(key => PAPER_SIZES[key] === editingConfig.paperSize)}
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
          value={Object.keys(CARD_SIZES).find(key => CARD_SIZES[key] === editingConfig.cardSize)}
          onChange={(e) => setCardSize(CARD_SIZES[e.target.value])}
          className="w-full p-2 border rounded mb-2"
        >
          {Object.entries(CARD_SIZES).map(([key, size]) => (
            <option key={key} value={key}>
              {size.name} {key !== 'CUSTOM' && `(${size.width}mm × ${size.height}mm)`}
            </option>
          ))}
        </select>

        {editingConfig.cardSize === CARD_SIZES.CUSTOM && (
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs mb-1">宽度 (mm)</label>
              <input
                type="number"
                value={editingConfig.customCardSize.width}
                onChange={(e) => handleCustomSizeChange('width', e.target.value)}
                min="1"
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-xs mb-1">高度 (mm)</label>
              <input
                type="number"
                value={editingConfig.customCardSize.height}
                onChange={(e) => handleCustomSizeChange('height', e.target.value)}
                min="1"
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
        )}
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
              value={editingConfig.margins.top}
              onChange={(e) => setMargins({ ...editingConfig.margins, top: Number(e.target.value) })}
              className="w-full"
            />
            <span className="text-xs">{editingConfig.margins.top}mm</span>
          </div>
          <div>
            <label className="block text-xs mb-1">卡牌间距 (mm)</label>
            <input
              type="range"
              min="2"
              max="20"
              value={editingConfig.spacing.horizontal}
              onChange={(e) => setSpacing({ 
                horizontal: Number(e.target.value), 
                vertical: Number(e.target.value) 
              })}
              className="w-full"
            />
            <span className="text-xs">{editingConfig.spacing.horizontal}mm</span>
          </div>
        </div>
      </div>
      {/* Display Mode Selection */}     
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">展示模式</label>
        <select
          value={editingConfig.displayMode}
          onChange={(e) => setDisplayMode(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value={DISPLAY_MODES.FRONT_ONLY}>仅正面</option>
          <option value={DISPLAY_MODES.BACK_ONLY}>仅背面</option>
          <option value={DISPLAY_MODES.DUPLEX}>双面打印</option>
        </select>
        {editingConfig.displayMode === DISPLAY_MODES.DUPLEX && (
          <p className="mt-2 text-sm text-gray-600">
            双面打印模式：奇数页显示正面，偶数页显示背面。打印时请选择双面打印选项。
          </p>
        )}
      </div>

      {/* 新增翻转方向选择 */}
      {editingConfig.displayMode === DISPLAY_MODES.DUPLEX && (
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">双面翻转方向</label>
          <select
            value={editingConfig.flipDirection}
            onChange={(e) => setFlipDirection(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value={FLIP_DIRECTIONS.LONG_EDGE}>长边翻转（书本式）</option>
            <option value={FLIP_DIRECTIONS.SHORT_EDGE}>短边翻转（日历式）</option>
          </select>
          <p className="mt-2 text-sm text-gray-600">
            长边翻转：类似书本翻页 | 短边翻转：类似日历翻页
          </p>
        </div>
      )}

      {/* PDF Quality Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">PDF导出清晰度</label>
        <select
          value={editingConfig.pdfQuality}
          onChange={(e) => setPdfQuality(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value={PDF_QUALITY.LOW}>标准</option>
          <option value={PDF_QUALITY.MEDIUM}>放大1.5倍</option>
          <option value={PDF_QUALITY.HIGH}>放大2倍</option>
        </select>
      </div>

      {/* Apply Button */}
      <div className="mt-6">
        <button
          onClick={applyConfig}
          disabled={!hasChanges}
          className={`w-full py-2 px-4 rounded-lg text-white font-medium transition-colors ${
            hasChanges 
              ? 'bg-blue-500 hover:bg-blue-600' 
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          {hasChanges ? '配置已更改' : '配置未更改'}
        </button>
      </div>
    </div>
  );
}