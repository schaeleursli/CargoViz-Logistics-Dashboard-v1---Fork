import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './src/lib/queryClient';
import Layout from './components/layout/Layout';
import SpaceManagement from './components/modules/SpaceManagement';
import CargoManagement from './components/modules/CargoManagement';
import YardManagement from './components/modules/YardManagement';
import Reporting from './components/modules/Reporting';
import Login from './src/components/auth/Login';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { WebSocketProvider } from './src/contexts/WebSocketContext';
export type ModuleType = 'space' | 'cargo' | 'yard' | 'reporting';
const ProtectedRoute = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const {
    isAuthenticated,
    loading
  } = useAuth();
  if (loading) {
    return <div className="flex h-screen items-center justify-center">
        Loading...
      </div>;
  }
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};
const AppContent = () => {
  const [activeModule, setActiveModule] = useState<ModuleType>('space');
  const [darkMode, setDarkMode] = useState(false);
  const {
    isAuthenticated
  } = useAuth();
  const renderModule = () => {
    switch (activeModule) {
      case 'space':
        return <SpaceManagement />;
      case 'cargo':
        return <CargoManagement />;
      case 'yard':
        return <YardManagement />;
      case 'reporting':
        return <Reporting />;
      default:
        return <SpaceManagement />;
    }
  };
  return <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login />} />
      <Route path="/" element={<ProtectedRoute>
            <div className={`w-full min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
              <Layout activeModule={activeModule} setActiveModule={setActiveModule} darkMode={darkMode} setDarkMode={setDarkMode}>
                {renderModule()}
              </Layout>
            </div>
          </ProtectedRoute>} />
    </Routes>;
};
export function App() {
  return <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <WebSocketProvider>
          <Router>
            <AppContent />
          </Router>
        </WebSocketProvider>
      </AuthProvider>
    </QueryClientProvider>;
}