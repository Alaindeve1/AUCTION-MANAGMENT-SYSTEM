import { createContext, useContext, useEffect, useRef, useCallback, useState } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { toast } from 'react-hot-toast';

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const stompClient = useRef(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;
  const reconnectDelay = 3000; // 3 seconds
  const [isConnected, setIsConnected] = useState(false);
  const pendingSubscriptions = useRef([]);
  const isConnecting = useRef(false);
  const activeSubscriptions = useRef(new Map());

  const connect = useCallback(() => {
    if (stompClient.current?.connected || isConnecting.current) {
      console.log('WebSocket already connected or connecting');
      return;
    }

    try {
      isConnecting.current = true;
      console.log('Opening Web Socket...');
      const socket = new SockJS('/ws');
      stompClient.current = new Client({
        webSocketFactory: () => socket,
        debug: (str) => {
          console.log(str);
        },
        reconnectDelay: reconnectDelay,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        onStompError: (frame) => {
          console.error('STOMP error:', frame);
          setIsConnected(false);
          isConnecting.current = false;
      if (reconnectAttempts.current < maxReconnectAttempts) {
        reconnectAttempts.current += 1;
        const delay = reconnectDelay * reconnectAttempts.current;
        console.log(`Attempting to reconnect in ${delay / 1000} seconds...`);
        toast.error(`Connection lost. Reconnecting in ${delay / 1000} seconds...`);
            setTimeout(connect, delay);
      } else {
        console.error('Max reconnection attempts reached');
        toast.error('Failed to connect to real-time updates. Please refresh the page.');
          }
        },
        onConnect: () => {
          console.log('WebSocket connected');
          setIsConnected(true);
          isConnecting.current = false;
          reconnectAttempts.current = 0;
          toast.success('Connected to real-time updates');

          // Process any pending subscriptions
          pendingSubscriptions.current.forEach(({ destination, callback }) => {
            try {
              const subscription = stompClient.current.subscribe(destination, (message) => {
                try {
                  const data = JSON.parse(message.body);
                  callback(data);
                } catch (error) {
                  console.error(`Error in subscription handler for ${destination}:`, error);
                }
              });
              activeSubscriptions.current.set(destination, subscription);
              pendingSubscriptions.current = pendingSubscriptions.current.filter(
                sub => sub.destination !== destination
              );
            } catch (error) {
              console.error(`Error subscribing to ${destination}:`, error);
            }
          });
        },
        onDisconnect: () => {
          console.log('WebSocket disconnected');
          setIsConnected(false);
          isConnecting.current = false;
          // Clear active subscriptions on disconnect
          activeSubscriptions.current.clear();
        },
      });

      stompClient.current.activate();
    } catch (error) {
      console.error('Error initializing WebSocket:', error);
      toast.error('Failed to initialize WebSocket connection');
      setIsConnected(false);
      isConnecting.current = false;
    }
  }, []);

  useEffect(() => {
    connect();
    return () => {
      if (stompClient.current?.connected) {
        stompClient.current.deactivate();
      }
    };
  }, [connect]);

  const subscribeToBidUpdates = useCallback((callback) => {
    const destination = '/topic/bidUpdates';
    
    if (!stompClient.current?.connected) {
      console.log('WebSocket not connected, adding to pending subscriptions');
      pendingSubscriptions.current.push({ destination, callback });
      return () => {
        pendingSubscriptions.current = pendingSubscriptions.current.filter(
          sub => sub.destination !== destination
        );
      };
    }
    
    try {
      // Unsubscribe if already subscribed
      if (activeSubscriptions.current.has(destination)) {
        activeSubscriptions.current.get(destination).unsubscribe();
        activeSubscriptions.current.delete(destination);
      }

      const subscription = stompClient.current.subscribe(destination, (message) => {
        try {
          const data = JSON.parse(message.body);
        callback(data);
      } catch (error) {
        console.error('Error in bid update handler:', error);
      }
      });
      
      activeSubscriptions.current.set(destination, subscription);
      return () => {
        if (activeSubscriptions.current.has(destination)) {
          activeSubscriptions.current.get(destination).unsubscribe();
          activeSubscriptions.current.delete(destination);
        }
      };
    } catch (error) {
      console.error('Error subscribing to bid updates:', error);
      return () => {};
    }
  }, []);

  const subscribeToItemBidUpdates = useCallback((itemId, callback) => {
    if (!itemId) {
      console.warn('Cannot subscribe to bid updates: itemId is undefined or null');
      return () => {};
    }

    // Ensure itemId is a string
    const validItemId = String(itemId);
    if (!validItemId || validItemId === 'undefined' || validItemId === 'null') {
      console.warn('Invalid itemId format:', itemId);
      return () => {};
    }
    
    const destination = `/topic/bid/${validItemId}`;
    console.log(`Subscribing to bid updates for item ${validItemId}`);
    
    if (!stompClient.current?.connected) {
      console.log('WebSocket not connected, adding to pending subscriptions');
      pendingSubscriptions.current.push({ destination, callback });
      return () => {
        pendingSubscriptions.current = pendingSubscriptions.current.filter(
          sub => sub.destination !== destination
        );
      };
    }
    
    try {
      // Unsubscribe if already subscribed
      if (activeSubscriptions.current.has(destination)) {
        activeSubscriptions.current.get(destination).unsubscribe();
        activeSubscriptions.current.delete(destination);
      }

      const subscription = stompClient.current.subscribe(destination, (message) => {
        try {
          const data = JSON.parse(message.body);
          console.log(`Received bid update for item ${validItemId}:`, data);
          callback(data);
        } catch (error) {
          console.error(`Error in item ${validItemId} bid update handler:`, error);
        }
      });
      
      activeSubscriptions.current.set(destination, subscription);
      return () => {
        if (activeSubscriptions.current.has(destination)) {
          activeSubscriptions.current.get(destination).unsubscribe();
          activeSubscriptions.current.delete(destination);
        }
      };
    } catch (error) {
      console.error(`Error subscribing to item ${validItemId} bid updates:`, error);
      return () => {};
    }
  }, []);

  const placeBid = useCallback((bidData) => {
    if (!stompClient.current?.connected) {
      console.error('Cannot place bid: WebSocket not connected');
      toast.error('Connection lost. Please refresh the page and try again.');
      return false;
    }
    
    if (!bidData.itemId) {
      console.error('Cannot place bid: itemId is undefined or null');
      toast.error('Invalid item ID');
      return false;
    }

    // Ensure itemId is a string
    const validItemId = String(bidData.itemId);
    if (!validItemId || validItemId === 'undefined' || validItemId === 'null') {
      console.error('Invalid itemId format:', bidData.itemId);
      toast.error('Invalid item ID format');
      return false;
    }
    
    try {
      const destination = `/app/bid/${validItemId}`;
      console.log(`Placing bid for item ${validItemId}:`, bidData);
      
      // Subscribe to the response topic
      const responseSubscription = stompClient.current.subscribe(`/topic/bid/${validItemId}`, (message) => {
        try {
          const response = JSON.parse(message.body);
          console.log('Received bid response:', response);
          
          // Unsubscribe after receiving the response
          responseSubscription.unsubscribe();
          
          if (response.amount) {
            toast.success(`Bid placed successfully! Amount: $${response.amount}`);
          } else {
            toast.error('Failed to place bid. Please try again.');
          }
        } catch (error) {
          console.error('Error processing bid response:', error);
          toast.error('Error processing bid response');
        }
      });

      // Send the bid
      stompClient.current.publish({
        destination,
        body: JSON.stringify({
          itemId: validItemId,
          amount: bidData.amount
        })
      });

      return true;
    } catch (error) {
      console.error('Error placing bid:', error);
      toast.error('Failed to place bid. Please try again.');
      return false;
    }
  }, []);

  const contextValue = {
    subscribeToBidUpdates,
    subscribeToItemBidUpdates,
    placeBid,
    isConnected,
  };

  return (
    <WebSocketContext.Provider value={contextValue}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};

export default WebSocketContext;
