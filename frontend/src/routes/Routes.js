// src/routes/Routes.js
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// 懒加载页面组件
const AllCardsPage = lazy(() => import('../pages/AllCardsPage'));
const FlipCardsPage = lazy(() => import('../pages/FlipCardsPage'));
const PrintCardsPage = lazy(() => import('../pages/PrintCardsPage'));


function AppRoutes() {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<AllCardsPage />} />
          <Route path="/flip" element={<FlipCardsPage />} />
          <Route path="/print" element={<PrintCardsPage />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default AppRoutes;
