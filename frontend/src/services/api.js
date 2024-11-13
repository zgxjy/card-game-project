const API_BASE_URL = 'http://localhost:5000';

export const getCards = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/get_cards`);
    const data = await response.json();
    return data.cards;
  } catch (error) {
    console.error('获取卡牌失败:', error);
    return [];
  }
};

export const addCards = async (cardData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/add_card`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cardData),
    });
    return await response.json();
  } catch (error) {
    console.error('添加卡牌失败:', error);
    throw error;
  }
};