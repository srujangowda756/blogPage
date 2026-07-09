import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import BlogList from './pages/BlogList';
import BlogDetail from './pages/BlogDetail';
import BlogForm from './pages/BlogForm';
import Auth from './pages/Auth';
import NotFound from './pages/NotFound';
import { isAuthenticated } from './api';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<BlogList />} />
        <Route path="/blogs/:id" element={<BlogDetail />} />
        <Route path="/create" element={isAuthenticated() ? <BlogForm /> : <Navigate to="/login" replace />} />
        <Route path="/edit/:id" element={isAuthenticated() ? <BlogForm /> : <Navigate to="/login" replace />} />
        <Route path="/login" element={<Auth />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
