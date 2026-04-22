import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import Notes from './pages/Notes';
import NoteDetail from './pages/NoteDetail';
import Recording from './pages/Recording';
import Profile from './pages/Profile';
import AdminPanel from './pages/AdminPanel';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Protected routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          } />
          <Route path="/notes" element={
            <ProtectedRoute><Notes /></ProtectedRoute>
          } />
          <Route path="/notes/:id" element={
            <ProtectedRoute><NoteDetail /></ProtectedRoute>
          } />
          <Route path="/record" element={
            <ProtectedRoute><Recording /></ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute><Profile /></ProtectedRoute>
          } />

          {/* Admin routes */}
          <Route path="/admin" element={
            <AdminRoute><AdminPanel /></AdminRoute>
          } />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
