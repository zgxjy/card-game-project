import React, { useState } from 'react';
import GameCard,{ CARD_THEMES } from '../components/GameCard';
import { ClipboardIcon, Share2Icon } from 'lucide-react';

const TabButton = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-lg ${
      active 
        ? 'bg-blue-500 text-white' 
        : 'bg-gray-100 hover:bg-gray-200'
    }`}
  >
    {children}
  </button>
);

const CardsEditPage = () => {
  const [cardConfig, setCardConfig] = useState({
    isFlipped: false,
    cardtype: 'Boundary',
    title: 'Example Card',
    description: 'This is a sample card description. Edit this text to customize your card.',
    tags: ["物理界限", "个人空间", "身体接触"],
    properties: {
      attack: 5,
      defense: 3,
      cooldown: 2,
      difficulty: 4
    },
    image: '',
    backimage: '',
    style: {
      width: '350px',
      height: '490px'
    }
  });

  const [newTag, setNewTag] = useState('');
  const [activeTab, setActiveTab] = useState('basic');
  const [scale, setScale] = useState(100);

  const handlePropertyChange = (property, value) => {
    setCardConfig(prev => ({
      ...prev,
      properties: {
        ...prev.properties,
        [property]: parseInt(value)
      }
    }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && cardConfig.tags.length < 5) {
      setCardConfig(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (index) => {
    setCardConfig(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  const generateCardCode = () => {
    const code = `<GameCard
  isFlipped={${cardConfig.isFlipped}}
  cardtype="${cardConfig.cardtype}"
  title="${cardConfig.title}"
  description="${cardConfig.description}"
  tags={${JSON.stringify(cardConfig.tags)}}
  properties={${JSON.stringify(cardConfig.properties, null, 2)}}
  image="${cardConfig.image}"
  backimage="${cardConfig.backimage}"
  style={{
    width: "${cardConfig.style.width}",
    height: "${cardConfig.style.height}"
  }}
/>`;
    return code;
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-6 min-h-screen bg-gray-50">
      {/* Editor Section */}
      <div className="w-full lg:w-1/2 space-y-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            {['basic', 'properties', 'tags', 'style'].map((tab) => (
              <TabButton
                key={tab}
                active={activeTab === tab}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </TabButton>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'basic' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Card Type</label>
                <select
                  value={cardConfig.cardtype}
                  onChange={(e) => setCardConfig(prev => ({...prev, cardtype: e.target.value}))}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {Object.keys(CARD_THEMES).map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={cardConfig.title}
                  onChange={(e) => setCardConfig(prev => ({...prev, title: e.target.value}))}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={cardConfig.description}
                  onChange={(e) => setCardConfig(prev => ({...prev, description: e.target.value}))}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Image URL</label>
                <input
                  type="text"
                  value={cardConfig.image}
                  onChange={(e) => setCardConfig(prev => ({...prev, image: e.target.value}))}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter image URL"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Back Image URL</label>
                <input
                  type="text"
                  value={cardConfig.backimage}
                  onChange={(e) => setCardConfig(prev => ({...prev, backimage: e.target.value}))}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter back image URL"
                />
              </div>
            </div>
          )}

          {activeTab === 'properties' && (
            <div className="space-y-4">
              {Object.entries(cardConfig.properties).map(([key, value]) => (
                <div key={key}>
                  <label className="block text-sm font-medium mb-1 capitalize">{key}</label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={value}
                      onChange={(e) => handlePropertyChange(key, e.target.value)}
                      className="flex-1"
                    />
                    <span className="w-8 text-center">{value}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'tags' && (
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add new tag"
                  className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                />
                <button
                  onClick={handleAddTag}
                  disabled={cardConfig.tags.length >= 5}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {cardConfig.tags.map((tag, index) => (
                  <div key={index} className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
                    <span>{tag}</span>
                    <button
                      onClick={() => handleRemoveTag(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'style' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Scale (%)</label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="50"
                    max="150"
                    value={scale}
                    onChange={(e) => {
                      const newScale = parseInt(e.target.value);
                      setScale(newScale);
                      const baseWidth = 350;
                      const baseHeight = 490;
                      setCardConfig(prev => ({
                        ...prev,
                        style: {
                          width: `${baseWidth * (newScale/100)}px`,
                          height: `${baseHeight * (newScale/100)}px`
                        }
                      }));
                    }}
                    className="flex-1"
                  />
                  <span className="w-12 text-center">{scale}%</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={cardConfig.isFlipped}
                  onChange={(e) => setCardConfig(prev => ({...prev, isFlipped: e.target.checked}))}
                  className="w-4 h-4"
                />
                <label className="text-sm font-medium">Show Back</label>
              </div>
            </div>
          )}
        </div>

        {/* Code Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Card Code</h3>
            <button
              onClick={generateCardCode}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              <ClipboardIcon className="w-4 h-4" />
              Copy Code
            </button>
          </div>
          <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
            <code>{generateCardCode()}</code>
          </pre>
        </div>
      </div>

      {/* Preview Section */}
      <div className="w-full lg:w-1/2">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">Preview</h3>
            <button
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Share2Icon className="w-4 h-4" />
              Share
            </button>
          </div>
          <div className="flex items-center justify-center bg-gray-50 rounded-lg p-8 min-h-[600px]">
            <GameCard {...cardConfig} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardsEditPage;