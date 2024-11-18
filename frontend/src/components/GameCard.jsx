import React, {useState,useEffect} from 'react';

export const CARD_THEMES = {
  Boundary: {
    background: "bg-[#c4432d]",
    texture: "after:bg-[#d4533d]",
    overlay: "bg-[#00000015]"
  },
  Scenario: {
    background: "bg-[#435c35]",
    texture: "after:bg-[#536c45]",
    overlay: "bg-[#00000015]"
  },
  Response: {
    background: "bg-[#2b4878]",
    texture: "after:bg-[#3b5888]",
    overlay: "bg-[#00000015]"
  },
  Attack: {
    background: "bg-[#563b67]",
    texture: "after:bg-[#664b77]",
    overlay: "bg-[#00000015]"
  },
  Event: {
    background: "bg-[#d65d1e]",
    texture: "after:bg-[#e66d2e]",
    overlay: "bg-[#00000015]"
  }
};

const baseStyles = {
  // 核心卡牌框架
  cardFrame: `
    relative w-[350px] h-[490px] rounded-xl
    noise-texture
    shadow-lg 
    overflow-hidden
    transition-all duration-200
  `,
  cardBack: `
    relative w-[350px] h-[490px] rounded-xl
    flex items-center justify-center 
    shadow-lg 
    transition-all duration-200
  `,

  // 头部区域
  cardHeader: "p-4 flex items-center justify-between border-b border-white/10",
  cardIcon: "p-2 rounded-lg bg-white/10",
  cardTitle: "font-bold text-xl text-white truncate max-w-[220px]",
  cardType: "px-3 py-1 text-sm bg-white/10 rounded-full text-white/90",

  // 图片区域
  cardImage: "h-48 bg-black/30 p-3",
  imageContainer: "w-full h-full bg-black/20 rounded-lg flex items-center justify-center overflow-hidden",

  // 描述区域
  cardDescription: "p-4 border-t border-white/10 h-64 overflow-hidden flex flex-col justify-between",
  descriptionText: "text-base leading-relaxed text-white/80 mb-3 overflow-hidden",
  
  // 标签容器
  tagContainer: "flex flex-wrap gap-1.5",
  tag: "flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full",
  tagIcon: "w-4 h-4 text-white/60",
  tagText: "text-sm text-white",

  // 属性区域
  properties: "px-3 py-2 flex items-center justify-between bg-black/30 mt-auto",
  propertyItem: "flex items-center gap-2",
  propertyIcon: "text-lg",
  propertyText: "text-sm text-white",

  // 占位符
  imagePlaceholder: "w-full h-full flex items-center justify-center bg-white/10",
  placeholderIcon: "w-20 h-20 text-white/20",

  // 游戏卡片变换效果
  gameCard: {
    wrapper: "transform transition-all duration-500",
    flipped: "rotate-y-180",
    notFlipped: "rotate-y-0"
  },

  // 卡片背面内容
  cardBackContent: {
    wrapper: "flex items-center justify-center w-full h-full",
    innerCircle: "w-32 h-32 bg-black/70 rounded-full flex items-center justify-center",
    innerDot: "w-20 h-20 bg-white rounded-full"
  },

  // 属性图标颜色
  propertyIcons: {
    attack: "text-red-400 text-lg",
    defense: "text-blue-400 text-lg",
    cooldown: "text-amber-400 text-lg",
    difficulty: "text-red-400 text-lg"
  }
};

// 创建一个函数来生成缩放后的样式
const createScaledStyles = (scale = 1) => {
  return {
    ...baseStyles,
    cardTitle: `${baseStyles.cardTitle} !text-[${Math.max(16 * scale, 8)}px]`,
    cardType: `${baseStyles.cardType} !text-[${Math.max(14 * scale, 7)}px]`,
    descriptionText: `${baseStyles.descriptionText} !text-[${Math.max(14 * scale, 7)}px]`,
    tagText: `${baseStyles.tagText} !text-[${Math.max(12 * scale, 6)}px]`,
    propertyText: `${baseStyles.propertyText} !text-[${Math.max(12 * scale, 6)}px]`
  };
};

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
    background-image: url("/imgs/noise.jpg");
    opacity: 0.1;
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
    opacity: 0.3;
    mix-blend-mode: multiply;
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
  <div className={baseStyles.imagePlaceholder}>
    <svg 
      viewBox="0 0 100 100" 
      className={baseStyles.placeholderIcon}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="10" y="10" width="80" height="80" rx="4" stroke="currentColor" strokeWidth="4"/>
      <path d="M10 70L30 50L45 65L70 35L90 55" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
      <circle cx="35" cy="35" r="8" stroke="currentColor" strokeWidth="4"/>
    </svg>
  </div>
);

const CardFrontImage = ({ image }) => (
  <div className={baseStyles.cardImage}>
    <div className={baseStyles.imageContainer}> 
      {image && image.trim() ? (
        <img src={image} alt="" className="w-full h-full object-cover rounded" /> 
      ) : (
        <ImagePlaceholder />
      )}
    </div>
  </div>
);

const CardHeader = ({ title, type, styles }) => (
  <div className={styles.cardHeader}>
    <div className="flex items-center gap-2">
      <div className={styles.cardIcon}>
        <CardIcon type={type} />
      </div>
      <h3 className={styles.cardTitle}>{title}</h3>
    </div>
    <span className={styles.cardType}>{type}</span>
  </div>
);

const CardDescription = ({ description, tags, styles }) => (
  <div className={styles.cardDescription}>
    <p className={styles.descriptionText}>{description}</p>
    <div className={styles.tagContainer}>
      {tags.map((tag, index) => (
        <div key={index} className={styles.tag}>
          <span className={styles.tagText}>{tag}</span>
        </div>
      ))}
    </div>
  </div>
);

const CardProperties = ({ properties, styles }) => (
  <div className={styles.properties}>
    {properties.attack && (
      <div className={styles.propertyItem}>
        <span className={styles.propertyIcons.attack}>⚔️</span>
        <span className={styles.propertyText}>{properties.attack}</span>
      </div>
    )}
    {properties.defense && (
      <div className={styles.propertyItem}>
        <span className={styles.propertyIcons.defense}>🛡️</span>
        <span className={styles.propertyText}>{properties.defense}</span>
      </div>
    )}
    {properties.cooldown && (
      <div className={styles.propertyItem}>
        <span className={styles.propertyIcons.cooldown}>⏳</span>
        <span className={styles.propertyText}>{properties.cooldown}</span>
      </div>
    )}
    {properties.difficulty && (
      <div className={styles.propertyItem}>
        <span className={styles.propertyIcons.difficulty}>🔥</span>
        <span className={styles.propertyText}>{properties.difficulty}</span>
      </div>
    )}
  </div>
);

// CardFront组件 - 接收scale参数
const CardFront = ({ cardtype, title, description, tags = [], properties = {}, image, scale = 1 }) => {
  const scaledStyles = createScaledStyles(scale);
  
  return (
    <div className={`${baseStyles.cardFrame} ${CARD_THEMES[cardtype].background}`}>
      <div className="relative z-10 h-full">
        <CardHeader title={title} type={cardtype} styles={scaledStyles} />
        <CardFrontImage image={image} />
        <CardProperties properties={properties} styles={scaledStyles} />
        <CardDescription description={description} tags={tags} styles={scaledStyles} />
      </div>
      <style jsx>{noiseTexture}</style>
    </div>
  );
};

// 背面渲染函数
const CardBack = ({ backimage, cardtype }) => {
  const backgroundImage = backimage ? `url(${backimage})` : null;
  const cardBackgroundClass = cardtype ? CARD_THEMES[cardtype].background : 'bg-black/10';
  
  return (
    <div
      className={`relative w-[350px] h-[490px] rounded-xl shadow-lg ${backgroundImage ? 'bg-cover bg-center' : ''} ${cardBackgroundClass}`}
      style={{ backgroundImage }}
    >
      {!backgroundImage && (
        <div className="flex items-center justify-center w-full h-full">
          <div className="w-32 h-32 bg-black/70 rounded-full flex items-center justify-center">
            <div className="w-20 h-20 bg-white rounded-full"></div>
          </div>
        </div>
      )}
    </div>
  );
};

const GameCard = ({ isFlipped, backimage, cardtype, title, description, tags, properties, image, style }) => {
  const [showBack, setShowBack] = useState(isFlipped);
  const cardFrontProps = { cardtype, title, description, tags, properties, image };
  const cardBackProps = { backimage, cardtype };

  // 监听isFlipped变化
  useEffect(() => {
    setShowBack(isFlipped);
  }, [isFlipped]);

  // 计算缩放比例
  const scale = style ? Math.min(
    parseFloat(style.width) / 350,
    parseFloat(style.height) / 490
  ) : 1;

  // 容器样式 - 保持原始尺寸用于定位
  const containerStyle = {
    width: style?.width || '350px',
    height: style?.height || '490px',
    transform: `${showBack ? 'rotateY(180deg)' : 'rotateY(0)'}`,
    transition: 'transform 0.5s',
    transformStyle: 'preserve-3d',
    position: 'relative',
  };

  // 内容基础样式 - 应用于正面和背面
  const baseContentStyle = {
    width: '350px',
    height: '490px',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: `translate(-50%, -50%) scale(${scale})`,
    transformOrigin: 'center center',
    backfaceVisibility: 'hidden',
  };

  // 背面特定样式
  const backContentStyle = {
    ...baseContentStyle,
    transform: `translate(-50%, -50%) scale(${scale}) rotateY(180deg)`, // 注意这里添加了rotateY(180deg)
  };

  return (
    <div style={containerStyle} className="perspective-1000">
      {/* 正面 */}
      <div style={baseContentStyle} className={showBack ? 'invisible' : 'visible'}>
        <CardFront {...cardFrontProps} scale={scale} />
      </div>   
      {/* 背面 */}
      <div style={backContentStyle} className={showBack ? 'visible' : 'invisible'}>
        <CardBack {...cardBackProps} />
      </div>
    </div>
  );
};

export default GameCard;