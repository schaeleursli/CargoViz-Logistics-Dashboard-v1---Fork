import { useEffect, useState, useCallback, useRef } from 'react';
// WebSocket message types
export interface BaseMessage {
  type: string;
  timestamp: number;
}
export interface ConvoyUpdateMessage extends BaseMessage {
  type: 'convoy_update';
  convoyId: string;
  status: string;
  vehicles: string[];
}
export interface VehicleLocationMessage extends BaseMessage {
  type: 'vehicle_location';
  vehicleId: string;
  location: [number, number];
  speed: number;
  heading: number;
}
export interface CargoStatusMessage extends BaseMessage {
  type: 'cargo_status';
  cargoId: string;
  status: string;
  location?: [number, number];
}
export interface AreaUpdateMessage extends BaseMessage {
  type: 'area_update';
  areaId: string;
  action: 'create' | 'update' | 'delete';
  data?: any;
}
export type WebSocketMessage = ConvoyUpdateMessage | VehicleLocationMessage | CargoStatusMessage | AreaUpdateMessage;
// WebSocket service options
export interface WebSocketOptions {
  url: string;
  reconnectAttempts?: number;
  reconnectDelay?: number;
  maxHistorySize?: number;
  throttleDelay?: number;
}
// WebSocket hook for real-time updates
export const useWebSocket = (options: WebSocketOptions) => {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<WebSocketMessage[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastMessageTimeRef = useRef<number>(0);
  // Throttle function to prevent too frequent updates
  const throttleMessage = useCallback((message: WebSocketMessage) => {
    const now = Date.now();
    const delay = options.throttleDelay || 200; // Default 200ms throttle
    if (now - lastMessageTimeRef.current >= delay) {
      lastMessageTimeRef.current = now;
      setMessages(prev => {
        const newMessages = [...prev, message];
        // Limit history size to prevent memory issues
        return newMessages.slice(-1 * (options.maxHistorySize || 100));
      });
    }
  }, [options.throttleDelay, options.maxHistorySize]);
  // Connect to WebSocket
  const connect = useCallback(() => {
    try {
      const socket = new WebSocket(options.url);
      socket.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        setError(null);
        reconnectAttemptsRef.current = 0;
      };
      socket.onmessage = event => {
        try {
          const message = JSON.parse(event.data) as WebSocketMessage;
          throttleMessage(message);
        } catch (err) {
          console.error('Failed to parse WebSocket message:', err);
        }
      };
      socket.onerror = event => {
        console.error('WebSocket error:', event);
        setError(new Error('WebSocket connection error'));
      };
      socket.onclose = () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
        // Attempt to reconnect
        if (reconnectAttemptsRef.current < (options.reconnectAttempts || 5)) {
          reconnectAttemptsRef.current += 1;
          const delay = (options.reconnectDelay || 1000) * reconnectAttemptsRef.current;
          console.log(`Attempting to reconnect in ${delay}ms (attempt ${reconnectAttemptsRef.current})`);
          if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
          }
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, delay);
        } else {
          setError(new Error('Maximum reconnection attempts reached'));
        }
      };
      socketRef.current = socket;
    } catch (err) {
      console.error('Failed to connect to WebSocket:', err);
      setError(err instanceof Error ? err : new Error('Failed to connect to WebSocket'));
    }
  }, [options.url, options.reconnectAttempts, options.reconnectDelay, throttleMessage]);
  // Send message to WebSocket
  const sendMessage = useCallback((message: any) => {
    if (socketRef.current && isConnected) {
      socketRef.current.send(JSON.stringify(message));
    } else {
      console.error('Cannot send message: WebSocket not connected');
    }
  }, [isConnected]);
  // Connect on mount, disconnect on unmount
  useEffect(() => {
    connect();
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [connect]);
  return {
    isConnected,
    messages,
    error,
    sendMessage
  };
};
// Specialized hook for convoy tracking
export const useConvoyTracking = (convoyId: string, options: Omit<WebSocketOptions, 'url'> = {}) => {
  const wsUrl = typeof window !== 'undefined' && window._env_ ? window._env_.REACT_APP_CARGOVIZ_WS_URL || 'wss://api.cargoviz.com/ws' : 'wss://api.cargoviz.com/ws';
  const {
    isConnected,
    messages,
    error,
    sendMessage
  } = useWebSocket({
    url: wsUrl,
    ...options
  });
  // Join convoy room on connection
  useEffect(() => {
    if (isConnected) {
      sendMessage({
        type: 'join_convoy',
        convoyId
      });
    }
  }, [isConnected, convoyId, sendMessage]);
  // Filter messages by convoy
  const convoyMessages = messages.filter(msg => msg.type === 'convoy_update' && msg.convoyId === convoyId || msg.type === 'vehicle_location' && messages.some(m => m.type === 'convoy_update' && m.convoyId === convoyId && m.vehicles.includes((msg as VehicleLocationMessage).vehicleId)));
  // Extract vehicle locations
  const vehicleLocations = messages.filter((msg): msg is VehicleLocationMessage => msg.type === 'vehicle_location').reduce((map, msg) => {
    map.set(msg.vehicleId, msg);
    return map;
  }, new Map<string, VehicleLocationMessage>());
  return {
    isConnected,
    convoyMessages,
    vehicleLocations,
    error,
    sendMessage
  };
};