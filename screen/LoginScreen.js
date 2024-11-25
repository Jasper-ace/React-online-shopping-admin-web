// LoginScreen.js
import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, TextInput as PaperTextInput, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext'; // Adjust the path accordingly

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const navigation = useNavigation();
  const { setAuthUsername, setUserId } = useAuth();

  const handleLogin = async () => {
    const apiUrl = 'http://192.168.1.18/MyReactNative1/login.php';

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`,
      });

      const result = await response.text();

      console.log(result);

      if (result === 'Login successful') {
        // Set authenticated username in the context
        setAuthUsername(username);

        // Store user ID in AsyncStorage
        await AsyncStorage.setItem('user_id', username);

        // Log the stored user ID to ensure it's set correctly
        const storedUserId = await AsyncStorage.getItem('user_id');
        console.log('Stored User ID:', storedUserId);

        // Set the authenticated user ID in the context
        setUserId(storedUserId);

        navigation.navigate('Home');
      } else {
        console.log('Login failed');
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  const navigateToRegister = () => {
    navigation.navigate('Register');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <PaperTextInput
        style={styles.input}
        label="Username"
        value={username}
        onChangeText={(text) => setUsername(text)}
        placeholder="Enter your username"
      />

      <PaperTextInput
        style={styles.input}
        label="Password"
        value={password}
        onChangeText={(text) => setPassword(text)}
        secureTextEntry
        placeholder="Enter your password"
      />

      <Button mode="contained" style={styles.button} onPress={handleLogin}>
        Login
      </Button>

      <TouchableOpacity onPress={navigateToRegister}>
        <Text style={styles.linkText}>Don't have an account? Register</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 32,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 12,
  },
  button: {
    marginTop: 16,
  },
  linkText: {
    marginTop: 20,
    textAlign: 'center',
    color: 'blue',
  },
});

export default LoginScreen;
