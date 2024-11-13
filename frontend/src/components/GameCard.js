import React from 'react';
import { CARD_THEMES, noiseTexture, styles, CardIcon } from '../styles/CardStyle';

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

const ImagePlaceholder = () => (
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

const CardFrontImage = ({ image }) => (
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

const CardDescription = ({ description, tags }) => (
  <div className={styles.cardDescription}>
    <p className={styles.descriptionText}>{description}</p>
    <div className={styles.tagContainer}>
      {tags.map((tag, index) => (
        <div key={index} className={styles.tag}>
          <svg viewBox="0 0 24 24" className={styles.tagIcon}>
            <path d="M5 12l7-7 7 7-7 7-7-7z" fill="currentColor" />
          </svg>
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
        <span className="text-red-400 text-base">⚔️</span>
        <span className={styles.propertyText}>{properties.attack}</span>
      </div>
    )}
    {properties.defense && (
      <div className={styles.propertyItem}>
        <span className="text-blue-400 text-base">🛡️</span>
        <span className={styles.propertyText}>{properties.defense}</span>
      </div>
    )}
    {properties.cooldown && (
      <div className={styles.propertyItem}>
        <span className="text-amber-400 text-base">⏳</span>
        <span className={styles.propertyText}>{properties.cooldown}</span>
      </div>
    )}
    {properties.difficulty && (
      <div className={styles.propertyItem}>
        <span className="text-red-400 text-base">🔥</span>
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

const CardBack = ({ backimage='https://tse2-mm.cn.bing.net/th/id/OIP-C.8JD_DFCA9kDlb_fM3371PgHaKa?rs=1&pid=ImgDetMain', cardtype }) => {
  const backgroundImage = backimage ? `url(${backimage})` : null;
  const cardBackgroundClass = cardtype ? CARD_THEMES[cardtype].background : 'bg-black/10';

  return (
    <div
      className={`${styles.cardBack} ${backgroundImage ? 'bg-cover bg-center' : ''}`}
      style={{ backgroundImage }}
    >
      {/* 如果没有背景图片，并且有cardtype，显示对应背景色 */}
      {!backgroundImage && cardtype && (
        <div className={`flex items-center justify-center w-full h-full ${cardBackgroundClass}`}>
          <div className="w-24 h-24 bg-black/70 rounded-full flex items-center justify-center">
            <div className="w-16 h-16 bg-white rounded-full"></div>
          </div>
        </div>
      )}
      
      {/* 如果没有背景图片且没有cardtype，使用默认的背景颜色 */}
      {!backgroundImage && !cardtype && (
        <div className="flex items-center justify-center w-full h-full bg-black/10">
          <div className="w-24 h-24 bg-black/70 rounded-full flex items-center justify-center">
            <div className="w-16 h-16 bg-white rounded-full"></div>
          </div>
        </div>
      )}
    </div>
  );
};


const GameCard = ({ isFlipped, backimage, cardtype, title, description, tags, properties, image }) => {
  const cardFrontProps = {cardtype, title, description, tags, properties, image };
  const cardBackProps = {cardtype};

  return (
    <div className={`transform ${isFlipped ? 'rotate-y-180' : 'rotate-y-0'} transition-all duration-500`}>
      {isFlipped ? <CardBack {...cardBackProps} /> : <CardFront {...cardFrontProps} />}
    </div>
  );
};

export default GameCard;