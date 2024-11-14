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


// 通用的更新卡片信息方法，可以更新任何字段
export const updateCard = async (cardId, updateData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/update_card/${cardId}`, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updateData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update card');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating card:', error);
    throw error;
  }
};

//删除卡片数据
export const deleteCard = async (cardId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/delete_card`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete card');
    }
    return await response.json();
  } catch (error) {
    console.error('Error deleting card:', error);
    throw error;
  }
};
