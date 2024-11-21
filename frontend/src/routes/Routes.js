// src/routes/Routes.js
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SidebarLayout from '../components/SidebarLayout';

// 懒加载页面组件
const AllCardsPage = lazy(() => import('../pages/AllCardsPage'));
const FlipCardsPage = lazy(() => import('../pages/FlipCardsPage'));
const PrintCardsPage = lazy(() => import('../pages/PrintCardsPage'));
const CreateCardsPage = lazy(() => import('../pages/CreateCardsPage'));

function AppRoutes() {
  return (
    <Router>
      <Suspense fallback={
        <div className="flex items-center justify-center h-screen">
          <div className="text-xl text-gray-600">加载中...</div>
        </div>
      }>
        <Routes>
          <Route element={<SidebarLayout />}>
            <Route path="/" element={<AllCardsPage />} />
            <Route path="/flip" element={<FlipCardsPage />} />
            <Route path="/print" element={<PrintCardsPage />} />
            <Route path="/create" element={<CreateCardsPage />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}

export default AppRoutes;