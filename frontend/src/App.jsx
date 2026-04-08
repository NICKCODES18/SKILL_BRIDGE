import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import ServiceBrowse from './pages/ServiceBrowse';
import ServiceDetail from './pages/ServiceDetail';
import CreateService from './pages/CreateService';
import EditService from './pages/EditService';
import Dashboard from './pages/Dashboard';
import MyBookings from './pages/MyBookings';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Routes>
          {/* Public */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/services" element={<ServiceBrowse />} />
          <Route path="/services/:id" element={<ServiceDetail />} />

          {/* Protected — User */}
          <Route path="/dashboard" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          } />
          <Route path="/services/new" element={
            <ProtectedRoute><CreateService /></ProtectedRoute>
          } />
          <Route path="/services/:id/edit" element={
            <ProtectedRoute><EditService /></ProtectedRoute>
          } />
          <Route path="/bookings" element={
            <ProtectedRoute><MyBookings /></ProtectedRoute>
          } />

          {/* Protected — Admin */}
          <Route path="/admin" element={
            <ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>
          } />

          {/* 404 */}
          <Route path="*" element={
            <div className="empty-state page" style={{ textAlign: 'center', paddingTop: '6rem' }}>
              <h2 style={{ fontSize: '4rem' }}>404</h2>
              <h3>Page not found</h3>
              <a href="/" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>Go Home</a>
            </div>
          } />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
