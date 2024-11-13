import React, { useState } from 'react';
import GameCard from '../components/GameCard';

const AllCardsView = ({ cards }) => {
  // 用来追踪每个卡片的翻转状态
  const [flippedCards, setFlippedCards] = useState({});

  const handleCardClick = (index) => {
    setFlippedCards(prevState => ({
      ...prevState,
      [index]: !prevState[index]  // 切换该卡片的翻转状态
    }));
  };

  return (
    <div className="flex flex-wrap justify-center gap-4 p-6 bg-gray-100 min-h-screen">
      {cards.map((card, index) => (
        <div key={index} onClick={() => handleCardClick(index)}>
          <GameCard
            {...card}  // 将所有卡片的属性传递给 GameCard
            isFlipped={!!flippedCards[index]}  // 根据 index 获取对应的翻转状态
          />
        </div>
      ))}
    </div>
  );
};

export default AllCardsView;
