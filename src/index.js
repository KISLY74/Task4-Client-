import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from './App';
import Main from './pages/Main';
import Authorization from './pages/Authorization';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Routes>
        <Route path="regin" element={<Authorization />} />
        <Route path="login" element={<Authorization />} />
        <Route path="users" element={<Main />} />
        <Route path="*" element={<Navigate to="/users" />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);