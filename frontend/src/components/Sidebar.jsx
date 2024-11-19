import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutGrid, FlipHorizontal, Printer, PlusCircle } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', icon: LayoutGrid, label: '所有卡片' },
    { path: '/flip', icon: FlipHorizontal, label: '翻转卡片' },
    { path: '/print', icon: Printer, label: '打印卡片' },
    { path: '/create', icon: PlusCircle, label: '创建卡片' },
  ];

  return (
    <div className="w-48 h-screen bg-gray-800 text-white fixed left-0 top-0">
      <div className="p-4">
        <h1 className="text-lg font-bold mb-6">卡片管理</h1>
        <nav>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center gap-2 px-3 py-2 rounded-lg mb-1
                  transition-colors duration-200 text-sm
                  ${isActive 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-300 hover:bg-gray-700'}
                `}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;