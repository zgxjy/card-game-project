import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutGrid, FlipHorizontal, Printer, PlusCircle, ChevronLeft, ChevronRight } from 'lucide-react';

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', icon: LayoutGrid, label: '所有卡片' },
    { path: '/flip', icon: FlipHorizontal, label: '翻转卡片' },
    { path: '/print', icon: Printer, label: '打印卡片' },
    { path: '/create', icon: PlusCircle, label: '创建卡片' },
  ];

  return (
    <div 
      className={`
        h-screen bg-gray-800 text-white fixed left-0 top-0
        transition-all duration-300 ease-in-out
        ${isCollapsed ? 'w-16' : 'w-48'}
      `}
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-6">
          {!isCollapsed && <h1 className="text-lg font-bold">卡片管理</h1>}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`
              p-1 rounded-lg hover:bg-gray-700 transition-colors
              ${isCollapsed ? 'ml-1' : 'ml-2'}
            `}
            aria-label={isCollapsed ? "展开侧边栏" : "收起侧边栏"}
          >
            {isCollapsed ? (
              <ChevronRight size={20} />
            ) : (
              <ChevronLeft size={20} />
            )}
          </button>
        </div>
        <nav>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center gap-2 rounded-lg mb-1
                  transition-colors duration-200 text-sm
                  ${isCollapsed ? 'justify-center px-2 py-3' : 'px-3 py-2'}
                  ${isActive 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-300 hover:bg-gray-700'}
                `}
                title={isCollapsed ? item.label : ''}
              >
                <Icon size={16} />
                {!isCollapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;