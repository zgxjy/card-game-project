// src/styles/CardStyles.js

// 定义标准卡片尺寸（美国扑克尺寸 2.5 × 3.5 inches = 63.5 × 88.9 mm）
export const CARD_DIMENSIONS = {
    // 卡片实际尺寸（300dpi）
    WIDTH: 744, // 2.5 inches * 300dpi = 750px
    HEIGHT: 1039, // 3.5 inches * 300dpi = 1050px
    BLEED: 37, // 3mm 出血位 (0.118 inches * 300dpi)
  };
  
  // 创建固定尺寸的样式字符串
  const createFixedDimensions = () => ({
    width: `${CARD_DIMENSIONS.WIDTH}px`,
    height: `${CARD_DIMENSIONS.HEIGHT}px`,
    position: 'relative',
  });
  
  export const CARD_THEMES = {
    Boundary: {
      background: "#ba3525",
      texture: "#ca4535",
      overlay: "rgba(0, 0, 0, 0.12)"
    },
    Scenario: {
      background: "#2d4724",
      texture: "#3d5734",
      overlay: "rgba(0, 0, 0, 0.12)"
    },
    Response: {
      background: "#1a3366",
      texture: "#2a4376",
      overlay: "rgba(0, 0, 0, 0.12)"
    },
    Attack: {
      background: "#462b57",
      texture: "#563b67",
      overlay: "rgba(0, 0, 0, 0.12)"
    },
    Event: {
      background: "#c54d0e",
      texture: "#d55d1e",
      overlay: "rgba(0, 0, 0, 0.12)"
    }
  };
  
  // 基础样式对象
  export const styles = {
    // 固定尺寸的基础容器样式
    baseContainer: {
      ...createFixedDimensions(),
      display: 'flex',
      flexDirection: 'column',
      borderRadius: '16px',
      overflow: 'hidden',
    },
  
    // 卡片正面框架
    cardFrame: {
      ...createFixedDimensions(),
      borderRadius: '16px',
      overflow: 'hidden',
    },
    
    // 卡片背面
    cardBack: {
      ...createFixedDimensions(),
      borderRadius: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  
    // 卡片头部
    cardHeader: {
      height: '96px',
      padding: '24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
    },
  
    // 标题区域
    titleArea: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
  
    cardIcon: {
      padding: '12px',
      borderRadius: '12px',
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
    },
  
    cardTitle: {
      fontSize: '28px',
      fontWeight: 'bold',
      color: '#fff',
      maxWidth: '460px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      letterSpacing: '0.05em',
    },
  
    cardType: {
      padding: '6px 16px',
      fontSize: '16px',
      color: 'rgba(255, 255, 255, 0.9)',
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
      borderRadius: '999px',
      letterSpacing: '0.05em',
    },
  
    // 图片区域
    cardImage: {
      height: '360px',
      padding: '16px',
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
  
    imageContainer: {
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      borderRadius: '12px',
      backgroundColor: 'rgba(0, 0, 0, 0.2)',
    },
  
    // 描述区域
    cardDescription: {
      padding: '24px',
      height: '420px',
      borderTop: '1px solid rgba(255, 255, 255, 0.2)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    },
  
    descriptionText: {
      fontSize: '21px',
      lineHeight: '1.6',
      color: 'rgba(255, 255, 255, 0.9)',
      marginBottom: '24px',
      letterSpacing: '0.03em',
    },
  
    // 标签容器
    tagContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '8px',
    },
  
    tag: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      padding: '4px 12px',
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
      borderRadius: '999px',
    },
  
    tagText: {
      fontSize: '14px',
      color: '#fff',
      letterSpacing: '0.05em',
    },
  
    // 属性区域
    properties: {
      padding: '12px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      marginTop: 'auto',
    },
  
    propertyItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
  
    propertyText: {
      fontSize: '18px',
      color: '#fff',
      fontWeight: '500',
    },
  
    // 属性图标样式
    propertyIcons: {
      attack: {
        fontSize: '24px',
        color: '#f87171',
      },
      defense: {
        fontSize: '24px',
        color: '#60a5fa',
      },
      cooldown: {
        fontSize: '24px',
        color: '#fbbf24',
      },
      difficulty: {
        fontSize: '24px',
        color: '#f87171',
      },
    },
  
    // 卡片背面内容
    cardBackContent: {
      wrapper: {
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      innerCircle: {
        width: '120px',
        height: '120px',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      innerDot: {
        width: '80px',
        height: '80px',
        backgroundColor: '#fff',
        borderRadius: '50%',
      },
    },
  };
  
  // 打印相关的样式
  export const printStyles = `
    @media print {
      @page {
        size: ${CARD_DIMENSIONS.WIDTH + CARD_DIMENSIONS.BLEED * 2}px ${CARD_DIMENSIONS.HEIGHT + CARD_DIMENSIONS.BLEED * 2}px;
        margin: 0;
        bleed: ${CARD_DIMENSIONS.BLEED}px;
        marks: crop cross;
      }
      
      .card-container {
        page-break-inside: avoid;
        break-inside: avoid;
      }
    }
  `;

  export const CardIcon = ({ type }) => {
    const icons = {
      Boundary: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 text-white">
          <circle cx="12" cy="12" r="10" stroke="currentColor" fill="none" strokeWidth="2" />
          <path d="M12 6v12M6 12h12" stroke="currentColor" strokeWidth="2" />
        </svg>
      ),
      Scenario: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 text-white">
          <rect x="6" y="6" width="12" height="12" stroke="currentColor" fill="none" strokeWidth="2" />
        </svg>
      ),
      Response: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 text-white">
          <path d="M12 4 L22 20 L2 20 Z" stroke="currentColor" fill="none" strokeWidth="2" />
        </svg>
      ),
      Attack: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 text-white">
          <path d="M18 6 L6 18 M6 6 L18 18" stroke="currentColor" fill="none" strokeWidth="2" />
        </svg>
      ),
      Event: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 text-white">
          <path d="M12 4 L12 20 M4 12 L20 12" stroke="currentColor" fill="none" strokeWidth="2" />
        </svg>
      )
    };
  
    return icons[type] || null;
  };
  
  export const ImagePlaceholder = () => (
    <div className={styles.imagePlaceholder}>
      <svg 
        viewBox="0 0 100 100" 
        className={styles.placeholderIcon}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="10" y="10" width="80" height="80" rx="4" stroke="currentColor" strokeWidth="4"/>
        <path d="M10 70L30 50L45 65L70 35L90 55" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
        <circle cx="35" cy="35" r="8" stroke="currentColor" strokeWidth="4"/>
      </svg>
    </div>
  );
  
  export const CardFrontImage = ({ image }) => (
    <div className={styles.cardImage}>
      <div className={styles.imageContainer}> 
        {image && image.trim() ? (
          <img src={image} alt="" className="w-full h-full object-cover rounded" /> 
        ) : (
          <ImagePlaceholder />
        )}
      </div>
    </div>
  );

  export const noiseTexture = `
  @keyframes noise {
    0% { transform: translate(0,0) }
    10% { transform: translate(-5%,-5%) }
    20% { transform: translate(-10%,5%) }
    30% { transform: translate(5%,-10%) }
    40% { transform: translate(-5%,15%) }
    50% { transform: translate(-10%,5%) }
    60% { transform: translate(15%,0) }
    70% { transform: translate(0,10%) }
    80% { transform: translate(-15%,0) }
    90% { transform: translate(10%,5%) }
    100% { transform: translate(5%,0) }
  }

  .noise-texture {
    position: relative;
    overflow: hidden;
  }

  .noise-texture::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url("../imgs/noise_texture.jpg");
    opacity: 0.2;
    mix-blend-mode: overlay;
  }

  .noise-texture::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: inherit;
    opacity: 0.8;
    mix-blend-mode: multiply;
  }
`;