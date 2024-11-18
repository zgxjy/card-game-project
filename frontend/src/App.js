// src/App.js
import React from 'react';
import AppRoutes from './routes/Routes';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
      <Toaster/>
      <AppRoutes />
    </>
  );
}

export default App;
