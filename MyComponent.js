// MyComponent.js
import React, { useState } from 'react';
import { View, Text, Button, TextInput } from 'react-native';
import { useAuth } from './AuthContext';

const MyComponent = () => {
  const { authenticatedUsername, setAuthUsername } = useAuth();
  const [usernameInput, setUsernameInput] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = () => {
    // Simulate a login process (replace this with your actual authentication logic)
    setIsLoggingIn(true);
    setTimeout(() => {
      setAuthUserId(usernameInput); // Change setAuthUsername to setAuthUserId
      setIsLoggingIn(false);
    }, 2000); // Simulating an asynchronous login process
  };

  const handleLogout = () => {
    // Simulating a logout process
    setAuthUserId(''); // Change setAuthUsername to setAuthUserId
  };

  return (
    <View>
      <Text>Authenticated User: {authenticatedUserId}</Text>

      {authenticatedUserId ? (
        <Button title="Logout" onPress={handleLogout} />
      ) : (
        <>
          <TextInput
            placeholder="Enter username"
            value={usernameInput}
            onChangeText={(text) => setUsernameInput(text)}
            style={{ borderBottomWidth: 1, marginBottom: 10 }}
          />
          <Button title={isLoggingIn ? 'Logging in...' : 'Login'} onPress={handleLogin} disabled={isLoggingIn} />
        </>
      )}
    </View>
  );
};

export default MyComponent;
