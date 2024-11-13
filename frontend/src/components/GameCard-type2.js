// GameCard.jsx
import React from 'react';
import "../styles/CardStyles.css"


const CardIcon = ({ type }) => {
  const icons = {
    Boundary: (
      <svg viewBox="0 0 24 24" className="card-icon">
        <circle cx="12" cy="12" r="10" stroke="currentColor" fill="none" strokeWidth="2" />
        <path d="M12 6v12M6 12h12" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
    Scenario: (
      <svg viewBox="0 0 24 24" className="card-icon">
        <rect x="6" y="6" width="12" height="12" stroke="currentColor" fill="none" strokeWidth="2" />
      </svg>
    ),
    Response: (
      <svg viewBox="0 0 24 24" className="card-icon">
        <path d="M12 4 L22 20 L2 20 Z" stroke="currentColor" fill="none" strokeWidth="2" />
      </svg>
    ),
    Attack: (
      <svg viewBox="0 0 24 24" className="card-icon">
        <path d="M18 6 L6 18 M6 6 L18 18" stroke="currentColor" fill="none" strokeWidth="2" />
      </svg>
    ),
    Event: (
      <svg viewBox="0 0 24 24" className="card-icon">
        <path d="M12 4 L12 20 M4 12 L20 12" stroke="currentColor" fill="none" strokeWidth="2" />
      </svg>
    )
  };

  return icons[type] || null;
};

const CardFrame = ({ children, type }) => {
  return (
    <div className={`card-frame noise-texture ${CARD_THEMES[type].background}`}>
      <div className="relative z-10 h-full">
        {children}
      </div>
    </div>
  );
};

const GameCard = ({ cardtype, title, description, tags = [], properties = {}, image }) => {
  return (
    <CardFrame type={cardtype}>
      <div className="h-full flex flex-col">
        <CardHeader title={title} type={cardtype} />
        <CardImage image={image} />
        <CardProperties properties={properties} />
        <CardDescription description={description} tags={tags} />
      </div>
    </CardFrame>
  );
};

export default GameCard;
