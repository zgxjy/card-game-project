// AllCardsView.js
import React, { useState } from 'react';
import GameCard from '../components/GameCard';
import { deleteCard,updateCard} from '../services/api';  // 确保已导入API函数

const AllCardsView = ({ cards }) => {
  const [flippedCards, setFlippedCards] = useState({});
  const [selectedCards, setSelectedCards] = useState({});
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  const handleCardClick = (index) => {
    if (isSelectionMode) {
      setSelectedCards(prevState => ({
        ...prevState,
        [index]: !prevState[index]
      }));
    } else {
      setFlippedCards(prevState => ({
        ...prevState,
        [index]: !prevState[index]
      }));
    }
  };

  const toggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode);
    setSelectedCards({});  // 清空选择
  };

  const handleBatchDelete = async () => {
    const selectedIndices = Object.entries(selectedCards)
      .filter(([_, isSelected]) => isSelected)
      .map(([index]) => cards[parseInt(index)]._id);

    if (selectedIndices.length === 0) {
      alert('请先选择要删除的卡片');
      return;
    }

    if (window.confirm(`确定要删除选中的 ${selectedIndices.length} 张卡片吗？`)) {
      try {
        // 并行执行所有删除请求
        await Promise.all(selectedIndices.map(cardId => deleteCard(cardId)));
        alert('删除成功！');
        // 通知父组件重新加载数据
        window.location.reload();  // 临时使用重载页面的方式，理想情况下应该通过props传递更新函数
      } catch (error) {
        console.error('删除失败:', error);
        alert('删除失败，请重试');
      }
    }
  };

  const handleBatchImageDelete = async () => {
    const selectedIndices = Object.entries(selectedCards)
      .filter(([_, isSelected]) => isSelected)
      .map(([index]) => ({
        id: cards[parseInt(index)]._id
      }));
  
    if (selectedIndices.length === 0) {
      alert('请先选择要删除图片的卡片');
      return;
    }
  
    if (window.confirm(`确定要删除选中的 ${selectedIndices.length} 张卡片的图片吗？`)) {
      try {
        // 直接使用通用的 updateCard 方法
        await Promise.all(
          selectedIndices.map(({ id }) => updateCard(id, { image: null }))
        );
        alert('图片删除成功！');
        window.location.reload();
      } catch (error) {
        console.error('图片删除失败:', error);
        alert('图片删除失败，请重试');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 操作栏 */}
      <div className="sticky top-0 z-50 bg-white shadow-md p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex space-x-4">
            <button
              onClick={toggleSelectionMode}
              className={`px-4 py-2 rounded-lg transition-colors ${
                isSelectionMode 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {isSelectionMode ? '退出选择' : '选择卡片'}
            </button>
            {isSelectionMode && (
              <>
                <button
                  onClick={handleBatchDelete}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  删除卡片
                </button>
                <button
                  onClick={handleBatchImageDelete}
                  className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                >
                  删除图片
                </button>
              </>
            )}
          </div>
          {isSelectionMode && (
            <span className="text-gray-600">
              已选择 {Object.values(selectedCards).filter(Boolean).length} 张卡片
            </span>
          )}
        </div>
      </div>

      {/* 卡片网格 */}
      <div className="flex flex-wrap justify-center gap-4 p-6">
        {cards.map((card, index) => (
          <div key={index} className="relative" onClick={() => handleCardClick(index)}>
            {isSelectionMode && (
              <div className="absolute top-2 right-2 z-20">
                <input
                  type="checkbox"
                  checked={!!selectedCards[index]}
                  onChange={() => {}} // React需要这个处理程序，实际的更改在click事件中处理
                  className="w-5 h-5 cursor-pointer"
                />
              </div>
            )}
            <GameCard
              {...card}
              isFlipped={!!flippedCards[index]}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllCardsView;