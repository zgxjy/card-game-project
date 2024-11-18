import React, { useState, useMemo, useEffect } from 'react';
import GameCard from '../components/GameCard';
import { deleteCards, updateCards, addCards,getCards,findCards } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast'; // 假设你使用 react-hot-toast 做提示

const AllCardsStructure = ({ cards }) => {
  const navigate = useNavigate();
  const [flippedCards, setFlippedCards] = useState({});
  const [selectedCards, setSelectedCards] = useState({});
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [newCardData, setNewCardData] = useState({ title: '', description: '', image: '', cardtype: '', project: '' });
  const [isAllSelected, setIsAllSelected] = useState(false);

  // 筛选状态
  const [filters, setFilters] = useState({
    project: '',
    cardtype: ''
  });

  // 提取所有已存在的项目和卡片类型
  const existingProjects = useMemo(() => 
    Array.from(new Set(cards.map(card => card.project))).filter(Boolean),
    [cards]
  );

  const existingCardTypes = useMemo(() => 
    Array.from(new Set(cards.map(card => card.cardtype))).filter(Boolean),
    [cards]
  );

  // 应用筛选器后的卡片
  const filteredCards = useMemo(() => {
    return cards.filter(card => {
      const matchProject = !filters.project || card.project === filters.project;
      const matchType = !filters.cardtype || card.cardtype === filters.cardtype;
      return matchProject && matchType;
    });
  }, [cards, filters]);

  // 计算分类数据
  const categorizedCards = useMemo(() => {
    const grouped = filteredCards.reduce((acc, card) => {
      const type = card.cardtype || '未分类';
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(card);
      return acc;
    }, {});
    return grouped;
  }, [filteredCards]);

  // 获取所有类别
  const categories = useMemo(() => Object.keys(categorizedCards), [categorizedCards]);

  // 处理筛选器变化
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  // 修改处理编辑卡片输入的函数
  const handleEditingCardChange = (e) => {
    const { name, value } = e.target;
    setEditingCard(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 处理新卡片输入
  const handleNewCardChange = (e) => {
    const { name, value } = e.target;
    setNewCardData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 重置筛选器
  const resetFilters = () => {
    setFilters({
      project: '',
      cardtype: ''
    });
  };

  // 添加全选/取消全选处理函数
  const handleSelectAll = () => {
    if (isAllSelected) {
      // 如果当前是全选状态，则取消所有选择
      setSelectedCards({});
      setIsAllSelected(false);
    } else {
      // 如果当前不是全选状态，则选择所有卡片
      const newSelectedCards = {};
      filteredCards.forEach((_, index) => {
        newSelectedCards[index] = true;
      });
      setSelectedCards(newSelectedCards);
      setIsAllSelected(true);
    }
  };

  // 修改现有的 handleCardClick 函数，更新全选状态
  const handleCardClick = (index) => {
    if (isEditMode) {
      setSelectedCards({
        [index]: true
      });
      const selectedCard = filteredCards[index];
      setEditingCard({ ...selectedCard });
      setIsEditModalOpen(true);
    } else if (isSelectionMode) {
      setSelectedCards(prevState => {
        const newState = {
          ...prevState,
          [index]: !prevState[index]
        };
        // 检查是否所有卡片都被选中
        const allSelected = filteredCards.every((_, i) => newState[i]);
        setIsAllSelected(allSelected);
        return newState;
      });
    } else {
      setFlippedCards(prevState => ({
        ...prevState,
        [index]: !prevState[index]
      }));
    }
  };
  // 进入编辑模式
  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
    setIsSelectionMode(false); // 退出批量选择模式
    setSelectedCards({}); // 清除所有选择
  };

  // 修改 toggleSelectionMode，重置全选状态
  const toggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode);
    setSelectedCards({});
    setIsAllSelected(false);
  };
  
  const handleUpdateCard = async () => {
      if (!editingCard) {
        toast.error('没有选中要修改的卡片',{
          'position':"top-center",
          'duration':3000
        });
        return;
      }
    
      if (window.confirm('确定要修改这张卡片吗？')) {
        try {
          // 创建一个新对象，排除 _id 字段
          const { _id, ...updateFields } = editingCard;
          
          await updateCards([_id], updateFields);
          toast.success('修改成功！',{
            'position':"top-center",
            'duration':3000
          });
          window.location.reload();
        } catch (error) {
          console.error('修改失败:', error,{
            'position':"top-center",
            'duration':3000
          });
          toast.error('修改失败，请重试',{
            'position':"top-center",
            'duration':3000
          });
        } finally {
          closeEditModal();
        }
      }
    };
  
    // 关闭编辑模态窗口
    const closeEditModal = () => {
      setIsEditModalOpen(false);
      setEditingCard(null);
      setSelectedCards({});
      setIsEditMode(false);
    };

  // 滚动到指定类别
  const scrollToCategory = (category) => {
    const element = document.getElementById(`category-${category}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleBatchDelete = async () => {
    const selectedIds = Object.entries(selectedCards)
      .filter(([_, isSelected]) => isSelected)
      .map(([index]) => cards[parseInt(index)]._id);

    if (selectedIds.length === 0) {
      toast.error('请先选择要删除的卡片',{
        'position':"top-center",
        'duration':3000
      });
      return;
    }

    if (window.confirm(`确定要删除选中的 ${selectedIds.length} 张卡片吗？`)) {
      try {
        await deleteCards(selectedIds);
        toast.success('删除成功！',{
          'position':"top-center",
          'duration':3000
        });
        window.location.reload();
      } catch (error) {
        console.error('删除失败:', error);
        toast.error('删除失败，请重试');
      }
    }
  };

  const handleBatchImageDelete = async () => {
    const selectedIds = Object.entries(selectedCards)
      .filter(([_, isSelected]) => isSelected)
      .map(([index]) => ({
        id: cards[parseInt(index)]._id
      }));

    if (selectedIds.length === 0) {
      toast.error('请先选择要删除图片的卡片',{
        'position':"top-center",
        'duration':3000
      });
      return;
    }

    if (window.confirm(`确定要删除选中的 ${selectedIds.length} 张卡片的图片吗？`)) {
      try {
        await updateCards(selectedIds.map(({ id }) => id), { image: null });
        toast.success('图片删除成功！',{
          'position':"top-center",
          'duration':3000
        });
        window.location.reload();
      } catch (error) {
        console.error('图片删除失败:', error);
        toast.error('图片删除失败，请重试',{
          'position':"top-center",
          'duration':3000
        });
      }
    }
  };

  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setNewCardData({ title: '', description: '', image: '', cardtype: '', project: '' });
  };


  const handleAddCard = async () => {
    if (!newCardData || Object.keys(newCardData).length === 0) {
      toast.error('卡片数据无效，请检查卡片信息',{
        'position':"top-center",
        'duration':3000
      });
      return;
    }
    if (window.confirm('确定要添加新的卡片吗？')) {
      try {
        await addCards([newCardData]);
        toast.success('添加成功！',{
          'position':"top-center",
          'duration':3000
        });
        window.location.reload();
      } catch (error) {
        console.error('添加卡片失败:', error);
        toast.error('添加卡片失败，请重试',{
          'position':"top-center",
          'duration':3000
        });
      } finally {
        closeAddModal();
      }
    }
  };
  // 添加打印功能
  const handleBatchPrint = async () => {
    const selectedIds = Object.entries(selectedCards)
      .filter(([_, isSelected]) => isSelected)
      .map(([index]) => cards[parseInt(index)]._id);

    if (selectedIds.length === 0) {
      toast.error('请先选择要打印的卡片',{
        'position':"top-center",
        'duration':3000
      });
      return;
    }
    if (window.confirm(`确定要打印选中的 ${selectedIds.length} 张卡片吗？`)) {
      try {
        console.log('Selected IDs:', selectedIds);
        const cardsdata = await findCards(selectedIds);
        sessionStorage.setItem('printCards', JSON.stringify(cardsdata));
        toast.success('打印卡片信息成功获取',{
          'position':"top-center",
          'duration':3000
        });
        console.log('Printing cards:', cardsdata);
        navigate('/print')

      } catch (error) {
        console.error('打印卡片信息获取失败:', error);
        toast.error('打印卡片失败，请重试',{
          'position':"top-center",
          'duration':3000
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 顶部区域：筛选器和统计信息 */}
      <div className="sticky top-0 z-50 bg-white shadow-md">
        <div className="max-w-7xl mx-auto p-4">
          {/* 筛选区域 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">项目筛选</label>
              <select
                name="project"
                value={filters.project}
                onChange={handleFilterChange}
                className="w-full p-2 border rounded"
              >
                <option value="">全部项目</option>
                {existingProjects.map(project => (
                  <option key={project} value={project}>{project}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">类型筛选</label>
              <select
                name="cardtype"
                value={filters.cardtype}
                onChange={handleFilterChange}
                className="w-full p-2 border rounded"
              >
                <option value="">全部类型</option>
                {existingCardTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                重置筛选
              </button>
            </div>
          </div>

        {/* 修改管理工具栏，添加全选按钮 */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-4">
          <button
            onClick={toggleSelectionMode}
            className={`px-4 py-2 rounded-lg transition-colors ${
              isSelectionMode ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            disabled={isEditMode}
          >
            {isSelectionMode ? '退出选择' : '选择卡片'}
          </button>
          {isSelectionMode && (
            <>
              <button
                onClick={handleSelectAll}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                {isAllSelected ? '取消全选' : '全选'}
              </button>
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
              <button
                onClick={handleBatchPrint}
                className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
              >
                打印卡片
              </button>
            </>
            )}
            {!isSelectionMode && (
              <>
                <button
                onClick={openAddModal}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  添加卡片
                </button>            
                <button
                  onClick={toggleEditMode}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    isEditMode ? 'bg-yellow-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                  disabled={isSelectionMode}
                >
                  {isEditMode ? '退出修改' : '修改卡片'}
                </button>
              </>
            )}

          </div>
          <div className="text-gray-600">
            {(isSelectionMode || isEditMode) && (
              <span className="mr-4">
                已选择: {Object.values(selectedCards).filter(Boolean).length} 张
              </span>
            )}
            <span>总数: {filteredCards.length} 张</span>
          </div>
        </div>

          {/* 类别导航 */}
          <div className="border-t pt-4">
            <div className="flex space-x-4 overflow-x-auto pb-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => scrollToCategory(category)}
                  className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors whitespace-nowrap"
                >
                  {category} ({categorizedCards[category].length})
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

       {/* 卡片展示区域 */}
       <div className="max-w-8xl mx-auto p-6">
        {categories.map((category) => (
          <div key={category} id={`category-${category}`} className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center">
              <span>{category}</span>
              <span className="ml-2 text-lg font-normal text-gray-600">
                ({categorizedCards[category].length} 张)
              </span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {categorizedCards[category].map((card, index) => {
                const globalIndex = filteredCards.findIndex(c => c._id === card._id);
                return (
                  <div
                    key={card._id}
                    className="transform transition-transform duration-200 hover:scale-105"
                    onClick={() => handleCardClick(globalIndex)}
                  >
                    {(isSelectionMode || isEditMode) && (
                      <div className="absolute top-2 right-2 z-20">
                        <input
                          type="checkbox"
                          checked={!!selectedCards[globalIndex]}
                          onChange={() => {}}
                          className="w-5 h-5 cursor-pointer"
                        />
                      </div>
                    )}
                    <GameCard
                      {...card}
                      isFlipped={!!flippedCards[globalIndex]}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* 修改编辑卡片模态窗口的输入处理 */}
      {isEditModalOpen && editingCard && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-1/3 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">修改卡片信息</h2>
            <div className="mb-3">
              <label className="block text-gray-700">项目代码 *</label>
              <div className="flex gap-2">
                <select
                  name="project"
                  value={editingCard.project || ''}
                  onChange={handleEditingCardChange}
                  className="flex-1 p-2 border rounded"
                >
                  <option value="">选择项目</option>
                  {existingProjects.map(project => (
                    <option key={project} value={project}>{project}</option>
                  ))}
                </select>
                <input
                  type="text"
                  name="project"
                  placeholder="新项目"
                  value={editingCard.project || ''}
                  onChange={handleEditingCardChange}
                  className="flex-1 p-2 border rounded"
                />
              </div>
            </div>
            <div className="mb-3">
              <label className="block text-gray-700">卡片名称 *</label>
              <input
                type="text"
                name="title"
                value={editingCard.title || ''}
                onChange={handleEditingCardChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-3">
              <label className="block text-gray-700">卡片类型 *</label>
              <div className="flex gap-2">
                <select
                  name="cardtype"
                  value={editingCard.cardtype || ''}
                  onChange={handleEditingCardChange}
                  className="flex-1 p-2 border rounded"
                >
                  <option value="">选择类型</option>
                  {existingCardTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                <input
                  type="text"
                  name="cardtype"
                  placeholder="新类型"
                  value={editingCard.cardtype || ''}
                  onChange={handleEditingCardChange}
                  className="flex-1 p-2 border rounded"
                />
              </div>
            </div>
            <div className="mb-3">
              <label className="block text-gray-700">描述</label>
              <textarea
                name="description"
                value={editingCard.description || ''}
                onChange={handleEditingCardChange}
                className="w-full p-2 border rounded"
                rows="4"
              />
            </div>
            <div className="mb-3">
              <label className="block text-gray-700">图片URL</label>
              <input
                type="text"
                name="image"
                value={editingCard.image || ''}
                onChange={handleEditingCardChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={closeEditModal}
                className="px-4 py-2 bg-gray-300 rounded mr-2"
              >
                取消
              </button>
              <button
                onClick={handleUpdateCard}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                确认修改
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 添加卡片模态窗口 */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-1/3 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">添加新卡片</h2>
            <div className="mb-3">
              <label className="block text-gray-700">项目代码 *</label>
              <div className="flex gap-2">
                <select
                  name="project"
                  value={newCardData.project}
                  onChange={handleNewCardChange}
                  className="flex-1 p-2 border rounded"
                >
                  <option value="">选择或输入新项目</option>
                  {existingProjects.map(project => (
                    <option key={project} value={project}>{project}</option>
                  ))}
                </select>
                <input
                  type="text"
                  name="project"
                  placeholder="新项目"
                  value={newCardData.project}
                  onChange={handleNewCardChange}
                  className="flex-1 p-2 border rounded"
                />
              </div>
            </div>
            <div className="mb-3">
              <label className="block text-gray-700">卡片名称 *</label>
              <input
                type="text"
                name="title"
                value={newCardData.title}
                onChange={handleNewCardChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-3">
              <label className="block text-gray-700">卡片类型 *</label>
              <div className="flex gap-2">
                <select
                  name="cardtype"
                  value={newCardData.cardtype}
                  onChange={handleNewCardChange}
                  className="flex-1 p-2 border rounded"
                >
                  <option value="">选择或输入新类型</option>
                  {existingCardTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                <input
                  type="text"
                  name="cardtype"
                  placeholder="新类型"
                  value={newCardData.cardtype}
                  onChange={handleNewCardChange}
                  className="flex-1 p-2 border rounded"
                />
              </div>
            </div>
            <div className="mb-3">
              <label className="block text-gray-700">描述</label>
              <textarea
                name="description"
                value={newCardData.description}
                onChange={handleNewCardChange}
                className="w-full p-2 border rounded"
                rows="4"
              />
            </div>
            <div className="mb-3">
              <label className="block text-gray-700">图片URL</label>
              <input
                type="text"
                name="image"
                value={newCardData.image}
                onChange={handleNewCardChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={closeAddModal}
                className="px-4 py-2 bg-gray-300 rounded mr-2"
              >
                取消
              </button>
              <button
                onClick={handleAddCard}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                添加
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function AllCardsPage() {
  const [cards, setCards] = useState([]);
  
  useEffect(() => {
    const loadCards = async () => {
      const cardsData = await getCards();
      setCards(cardsData);
    };
    loadCards();
  }, []);

  return <AllCardsStructure cards={cards} />;
}

export default AllCardsPage;