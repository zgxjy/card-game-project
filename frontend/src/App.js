import React, { useState, useEffect } from 'react';
import GameCard from './components/GameCard-type';
import { getCards} from './services/api';

function App() {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    // 组件加载时获取卡牌数据
    const loadCards = async () => {
      const cardsData = await getCards();
      setCards(cardsData);
    };
    loadCards();
  }, []);

  return (
    <div className="flex flex-wrap justify-center gap-4 p-6 bg-gray-100 min-h-screen">
      {cards.map((card, index) => (
        <GameCard
          key={index}
          cardtype={card.cardtype}
          cardName={card.cardName}
          title={card.title}
          description={card.description}
          tags={card.tags}
          properties={card.properties}
          image={card.image}
        />
      ))}
    </div>
  );
}

export default App;