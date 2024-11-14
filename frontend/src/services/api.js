const API_BASE_URL = 'http://localhost:5000';

//获取所有卡片
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

//增加卡片
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

//更新卡片信息
export const updateCardImage = async (cardId, newImageUrl) => {
  try {
    const response = await fetch(`/update_card/${cardId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ image: newImageUrl }),  // 更新图片 URL
    });
    
    if (response.ok) {
      alert('Card updated successfully');
    } else {
      alert('Card not found');
    }
  } catch (error) {
    console.error('Error updating card:', error);
  }
};

//删除卡片数据
export const deleteCardImage = async (cardId) => {
  try {
    const response = await fetch(`/delete_card/${cardId}`, {
      method: 'DELETE',
    });
    
    if (response.ok) {
      alert('Card deleted successfully');
    } else {
      alert('Card not found');
    }
  } catch (error) {
    console.error('Error deleting card:', error);
  }
};
