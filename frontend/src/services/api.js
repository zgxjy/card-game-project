const API_BASE_URL = 'http://localhost:5000/api';

// 获取所有卡片
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

//获取部分卡片
export const findCards = async (cardIds) => {
  try {
    const response = await fetch(`${API_BASE_URL}/find_cards`,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        card_ids: cardIds }), // cardIds 应该是一个数组
    });
    const data = await response.json();
    return data.cards;
  } catch (error) {
    console.error('获取卡牌失败:', error);
    return [];
  }
};


// 批量增加卡片
export const addCards = async (cardsData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/add_cards`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cardsData),  // cardsData 应该是一个数组
    });
    
    // 这里直接返回 response.json()，解析并返回数据
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || '添加卡片失败');
    }

    return await response.json();  // 返回解析后的 JSON 数据
  } catch (error) {
    console.error('添加卡牌失败:', error);
    throw error;
  }
};


// 批量更新卡片信息
export const updateCards = async (cardIds, updateFields) => {
  try {
    // 添加安全检查
    if ('_id' in updateFields) {
      console.warn('Warning: _id field should not be included in updateFields');
      const { _id, ...safeUpdateFields } = updateFields;
      updateFields = safeUpdateFields;
    }

    const response = await fetch(`${API_BASE_URL}/update_cards`, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        card_ids: cardIds,
        update_fields: updateFields
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update cards');
    }

    return await response.json();
  } catch (error) {
    console.error('更新卡片失败:', error);
    throw error;
  }
};

// 批量删除卡片
export const deleteCards = async (cardIds) => {
  try {
    const response = await fetch(`${API_BASE_URL}/delete_cards`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        card_ids: cardIds,  // cardIds 是要删除的卡片 ID 数组
      })
    });

    if (!response.ok) {
      throw new Error('删除卡片失败');
    }

    return await response.json();
  } catch (error) {
    console.error('删除卡片失败:', error);
    throw error;
  }
};
