import React, { useState } from 'react';
import GameCard from '../components/GameCard';

const FlipCardsView = ({ cards }) => {
  // State: left side shows the cards in the stack, all initially flipped (back side up)
  const [leftCards, setLeftCards] = useState(cards.map(() => false)); // false means back side up
  const [rightCards, setRightCards] = useState([]);

  const handleCardClick = (index, isRight) => {
    if (isRight) {
      // Move card from right to left and flip it back to the back side
      const card = rightCards[index];
      setLeftCards((prevState) => {
        const newLeftCards = [...prevState];
        newLeftCards[card.index] = false; // Flip back to the back side
        return newLeftCards;
      });
      setRightCards((prevState) => prevState.filter((_, i) => i !== index)); // Remove from right
    } else {
      // Move card from left to right and flip to the front side
      if (!leftCards[index]) { // Only flip the card if it's currently on the back side
        setLeftCards((prevState) => {
          const newLeftCards = [...prevState];
          newLeftCards[index] = true; // Flip to front side
          return newLeftCards;
        });

        // Add the card to the right region with the front side up
        setRightCards((prevState) => [
          ...prevState,
          { ...cards[index], index, flipped: true } // Add to right as front-facing card
        ]);
      }
    }
  };

  return (
    <div className="relative min-h-screen flex justify-center items-center">
      {/* Left Area */}
      <div className="absolute left-0 w-1/2 h-full flex justify-center items-start">
        {cards.map((card, index) => (
          <div
            key={index}
            onClick={() => handleCardClick(index, false)} // Click to move to right
            className={`absolute transition-all duration-500 ease-in-out ${leftCards[index] ? 'scale-100 z-10' : 'scale-75 z-0'}`}
            style={{
              transform: leftCards[index]
                ? 'translateY(-50%)' // Center the flipped card
                : `translateY(${index * 10}px)`, // Slight vertical offset for non-flipped cards
              perspective: '1000px',
              boxShadow: leftCards[index] ? '0px 10px 15px rgba(0, 0, 0, 0.3)' : '0px 4px 8px rgba(0, 0, 0, 0.2)', // Shadow for flipped cards
              borderRadius: '8px',
            }}
          >
            <GameCard
              {...card}
              isFlipped={leftCards[index]} // Pass flipped state for each card
            />
          </div>
        ))}
      </div>

      {/* Right Area */}
      <div className="absolute right-0 w-1/2 h-full flex justify-center items-start">
        {rightCards.map((card, index) => (
          <div
            key={index}
            onClick={() => handleCardClick(index, true)} // Click to move back to left
            className={`absolute transition-all duration-500 ease-in-out ${!leftCards[card.index] ? 'scale-100 z-10' : 'scale-75 z-0'}`}
            style={{
              transform: !leftCards[card.index]
                ? 'translateY(-50%)' // Center the flipped card
                : `translateY(${index * 10}px)`, // Slight vertical offset for non-flipped cards
              perspective: '1000px',
              boxShadow: !leftCards[card.index] ? '0px 10px 15px rgba(0, 0, 0, 0.3)' : '0px 4px 8px rgba(0, 0, 0, 0.2)', // Shadow for flipped cards
              borderRadius: '8px',
            }}
          >
            <GameCard
              {...card}
              isFlipped={!leftCards[card.index]} // Flip card state for cards in right region
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FlipCardsView;
