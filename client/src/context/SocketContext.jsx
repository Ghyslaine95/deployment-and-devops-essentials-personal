import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useSocket } from '../socket/socket';

const SocketContext = createContext();

const initialState = {
  isConnected: false,
  user: null,
  messages: [],
  users: [],
  rooms: [],
  currentRoom: 'general',
  typingUsers: [],
  notifications: [],
  unreadCounts: {},
  error: null,
  loading: false
};

const socketReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    
    case 'SET_CONNECTED':
      return { ...state, isConnected: action.payload };
    
    case 'SET_USER':
      return { ...state, user: action.payload };
    
    case 'SET_MESSAGES':
      return { ...state, messages: action.payload };
    
    case 'ADD_MESSAGE':
      return { 
        ...state, 
        messages: [...state.messages, action.payload],
        unreadCounts: {
          ...state.unreadCounts,
          [action.payload.room]: (state.unreadCounts[action.payload.room] || 0) + 
            (action.payload.room !== state.currentRoom ? 1 : 0)
        }
      };
    
    case 'SET_USERS':
      return { ...state, users: action.payload };
    
    case 'SET_ROOMS':
      return { ...state, rooms: action.payload };
    
    case 'SET_CURRENT_ROOM':
      return { 
        ...state, 
        currentRoom: action.payload,
        unreadCounts: {
          ...state.unreadCounts,
          [action.payload]: 0
        }
      };
    
    case 'SET_TYPING_USERS':
      return { ...state, typingUsers: action.payload };
    
    case 'ADD_NOTIFICATION':
      return { 
        ...state, 
        notifications: [...state.notifications, action.payload].slice(-5) // Keep last 5
      };
    
    case 'CLEAR_NOTIFICATIONS':
      return { ...state, notifications: [] };
    
    case 'USER_JOINED':
      return {
        ...state,
        users: [...state.users, action.payload],
        notifications: [...state.notifications, {
          id: Date.now(),
          type: 'info',
          message: `${action.payload.username} joined the chat`,
          timestamp: new Date()
        }].slice(-5)
      };
    
    case 'USER_LEFT':
      return {
        ...state,
        users: state.users.filter(user => user.id !== action.payload.id),
        notifications: [...state.notifications, {
          id: Date.now(),
          type: 'info',
          message: `${action.payload.username} left the chat`,
          timestamp: new Date()
        }].slice(-5)
      };
    
    default:
      return state;
  }
};

export const SocketProvider = ({ children }) => {
  const [state, dispatch] = useReducer(socketReducer, initialState);
  
  const {
    socket,
    isConnected,
    messages,
    users,
    rooms,
    typingUsers,
    currentRoom,
    connect,
    disconnect,
    sendMessage,
    sendPrivateMessage,
    setTyping,
    joinRoom
  } = useSocket();

  // Sync socket state with context
  useEffect(() => {
    dispatch({ type: 'SET_CONNECTED', payload: isConnected });
  }, [isConnected]);

  useEffect(() => {
    dispatch({ type: 'SET_MESSAGES', payload: messages });
  }, [messages]);

  useEffect(() => {
    dispatch({ type: 'SET_USERS', payload: users });
  }, [users]);

  useEffect(() => {
    dispatch({ type: 'SET_ROOMS', payload: rooms });
  }, [rooms]);

  useEffect(() => {
    dispatch({ type: 'SET_TYPING_USERS', payload: typingUsers });
  }, [typingUsers]);

  useEffect(() => {
    dispatch({ type: 'SET_CURRENT_ROOM', payload: currentRoom });
  }, [currentRoom]);

  const value = {
    ...state,
    socket,
    connect: (username) => {
      dispatch({ type: 'SET_LOADING', payload: true });
      connect(username);
      dispatch({ type: 'SET_USER', payload: { username } });
    },
    disconnect: () => {
      disconnect();
      dispatch({ type: 'SET_USER', payload: null });
    },
    sendMessage: (content) => {
      sendMessage(content);
    },
    sendPrivateMessage: (toUserId, content) => {
      sendPrivateMessage(toUserId, content);
    },
    setTyping: (isTyping) => {
      setTyping(isTyping);
    },
    joinRoom: (roomName) => {
      joinRoom(roomName);
    },
    addNotification: (notification) => {
      dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
    },
    clearNotifications: () => {
      dispatch({ type: 'CLEAR_NOTIFICATIONS' });
    }
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocketContext = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocketContext must be used within a SocketProvider');
  }
  return context;
};