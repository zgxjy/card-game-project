import React, { useState, useEffect } from 'react';
import { getCards} from './services/api';
import AllCardsView from './views/AllCardsView';
// import FlipCardsView from './views/FlipCardsView';


function App() {
  const [cards, setCards] = useState([]);
  
  useEffect(() => {
    const loadCards = async () => {
      const cardsData = await getCards();
      setCards(cardsData);
    };
    loadCards();
  }, []);

  return <AllCardsView cards={cards} />;
}

export default App