// AuthContext.js
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authenticatedUsername, setAuthenticatedUsername] = useState('');
  const [authenticatedUserId, setAuthenticatedUserId] = useState(null);

  const setAuthUsername = async (username) => {
    console.log('Setting authenticatedUsername:', username);
    setAuthenticatedUsername(username);

    try {
      // Replace 'http://192.168.1.18/MyReactNative1/fetchusername.php' with the actual URL endpoint
      const response = await fetch(`http://192.168.1.18/MyReactNative1/fetchusername.php?username=${username}`);

      if (response.ok) {
        const { userId } = await response.json();
        setAuthenticatedUserId(userId);
        console.log('Setting authenticatedUserId:', userId);
      } else {
        console.error('Failed to fetch user_id');
      }
    } catch (error) {
      console.error('Error fetching user_id:', error);
    }
  };

  const setUserId = (userId) => {
    console.log('Setting authenticatedUserId:', userId);
    setAuthenticatedUserId(userId);
  };

  return (
    <AuthContext.Provider value={{ authenticatedUsername, setAuthUsername, authenticatedUserId, setUserId }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider. Did you forget to wrap your components with AuthProvider?');
  }
  return context;
};
