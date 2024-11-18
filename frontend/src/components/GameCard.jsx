// GameCard.js
import React from 'react';

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

export const styles = {
  // 核心卡牌框架
  // 标准扑克牌尺寸约为 63mm × 88mm (2.5" × 3.5")
  // 考虑到屏幕显示和打印需求，我们采用 350px × 490px 的尺寸
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

  // 图片区域 - 增加高度以保持比例
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

 /* 优化后的卡片图标 */
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

const CardFrame = ({ children, type }) => {
  return (
    <div className={`${styles.cardFrame} ${CARD_THEMES[type].background}`}>
      <div className="relative z-10 h-full">
        {children}
      </div>
      <style jsx>{noiseTexture}</style>
    </div>
  );
};

const CardHeader = ({ title, type }) => (
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

const CardDescription = ({ description, tags }) => (
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

const CardProperties = ({ properties }) => (
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

const CardFront = ({ cardtype, title, description, tags = [], properties = {}, image }) => {
  return (
    <CardFrame type={cardtype}>
      <div className="h-full flex flex-col">
        <CardHeader title={title} type={cardtype} />
        <CardFrontImage image={image} />
        <CardProperties properties={properties} />
        <CardDescription description={description} tags={tags} />
      </div>
    </CardFrame>
  );
};

const CardBack = ({ backimage, cardtype }) => {
  const backgroundImage = backimage ? `url(${backimage})` : null;
  const cardBackgroundClass = cardtype ? CARD_THEMES[cardtype].background : 'bg-black/10';

  return (
    <div
      className={`${styles.cardBack} ${backgroundImage ? 'bg-cover bg-center' : ''}`}
      style={{ backgroundImage }}
    >
      {!backgroundImage && (
        <div className={`${styles.cardBackContent.wrapper} ${cardtype ? cardBackgroundClass : 'bg-black/10'}`}>
          <div className={styles.cardBackContent.innerCircle}>
            <div className={styles.cardBackContent.innerDot}></div>
          </div>
        </div>
      )}
    </div>
  );
};

const GameCard = ({ isFlipped, backimage, cardtype, title, description, tags, properties, image}) => {
  const cardFrontProps = { cardtype, title, description, tags, properties, image };
  const cardBackProps = { cardtype, backimage:'https://th.bing.com/th/id/R.c9c6efd9ddb4fcfbb92a83d724f0aa97?rik=zyl1%2f2Jt2YV6VQ&pid=ImgRaw&r=0' };

  return (
    <div className={`${styles.gameCard.wrapper} ${isFlipped ? styles.gameCard.flipped : styles.gameCard.notFlipped}`}>
      {isFlipped ? <CardBack {...cardBackProps} /> : <CardFront {...cardFrontProps} />}
    </div>
  );
};

export default GameCard;