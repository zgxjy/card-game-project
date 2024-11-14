// GameCard.js
import React from 'react';
import { CARD_THEMES, noiseTexture, styles, CardIcon, CardFrontImage } from '../styles/CardStyle';

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

const GameCard = ({ isFlipped, backimage, cardtype, title, description, tags, properties, image }) => {
  const cardFrontProps = { cardtype, title, description, tags, properties, image };
  const cardBackProps = { cardtype, backimage:'https://th.bing.com/th/id/R.c9c6efd9ddb4fcfbb92a83d724f0aa97?rik=zyl1%2f2Jt2YV6VQ&pid=ImgRaw&r=0' };

  return (
    <div className={`${styles.gameCard.wrapper} ${isFlipped ? styles.gameCard.flipped : styles.gameCard.notFlipped}`}>
      {isFlipped ? <CardBack {...cardBackProps} /> : <CardFront {...cardFrontProps} />}
    </div>
  );
};

export default GameCard;