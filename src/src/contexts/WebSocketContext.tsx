import React, { useEffect, useState, createContext, useContext } from 'react';
import { useWebSocket, WebSocketMessage, WebSocketOptions } from '../services/webSocketService';
import { useAuth } from './AuthContext';
interface WebSocketContextType {
  isConnected: boolean;
  messages: WebSocketMessage[];
  error: Error | null;
  sendMessage: (message: any) => void;
  cargoUpdates: WebSocketMessage[];
  areaUpdates: WebSocketMessage[];
}
const WebSocketContext = createContext<WebSocketContextType | null>(null);
export const useWebSocketContext = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocketContext must be used within a WebSocketProvider');
  }
  return context;
};
interface WebSocketProviderProps {
  children: React.ReactNode;
}
export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({
  children
}) => {
  const {
    isAuthenticated,
    user
  } = useAuth();
  const [options, setOptions] = useState<WebSocketOptions>({
    url: 'wss://api.cargoviz.com/ws',
    reconnectAttempts: 5,
    reconnectDelay: 1000,
    maxHistorySize: 100,
    throttleDelay: 200
  });
  // Update WebSocket URL from environment if available
  useEffect(() => {
    if (typeof window !== 'undefined' && window._env_?.REACT_APP_CARGOVIZ_WS_URL) {
      setOptions(prev => ({
        ...prev,
        url: window._env_.REACT_APP_CARGOVIZ_WS_URL!
      }));
    }
  }, []);
  // Only connect to WebSocket if user is authenticated
  const {
    isConnected,
    messages,
    error,
    sendMessage
  } = useWebSocket(isAuthenticated ? options : {
    ...options,
    url: ''
  });
  // Join organization channel when connected
  useEffect(() => {
    if (isConnected && user?.organizationId) {
      sendMessage({
        type: 'join_organization',
        organizationId: user.organizationId
      });
    }
  }, [isConnected, user, sendMessage]);
  // Filter messages by type
  const cargoUpdates = messages.filter(msg => msg.type === 'cargo_status');
  const areaUpdates = messages.filter(msg => msg.type === 'area_update');
  return <WebSocketContext.Provider value={{
    isConnected,
    messages,
    error,
    sendMessage,
    cargoUpdates,
    areaUpdates
  }}>
      {children}
    </WebSocketContext.Provider>;
};