import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

const SidebarLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen">
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <main className={`flex-1 ${isCollapsed ? 'ml-16' : 'ml-48'} p-8 transition-all duration-300`}>
        <Outlet />
      </main>
    </div>
  );
};

export default SidebarLayout;