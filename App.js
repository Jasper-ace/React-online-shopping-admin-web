// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider } from './screen/AuthContext'; // Adjust the path accordingly
import RegistrationScreen from './screen/RegistrationScreen';
import LoginScreen from './screen/LoginScreen';
import GetStartedScreen from './screen/GetStartedScreen';
import HomeScreen from './screen/HomeScreen';
import ProductDetailScreen from './screen/ProductDetailScreen';
import CartScreen from './screen/CartScreen';
import OrderHistory from './screen/OrderHistory';
import Profile from './screen/Profile';
import Checkout from './screen/checkout'; // Fix the import path
import Receipt from './screen/Receipt';
import { UserProvider } from './screen/userContext';

const Stack = createStackNavigator();

const App = () => {
  return (
    <UserProvider>
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="GetStarted">
          <Stack.Screen
            name="GetStarted"
            component={GetStartedScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Register"
            component={RegistrationScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="prod"
            component={ProductDetailScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Cart"
            component={CartScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="OrderHistory"
            component={OrderHistory}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Profile"
            component={Profile}
            options={{ headerShown: false }}
          />
          <Stack.Screen
              name="Checkout"
              component={Checkout}
              options={{ headerShown: false }}
            />

          <Stack.Screen
              name="Receipt"
              component={Receipt}
              options={{ headerShown: false }}
            />

        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
    </UserProvider>
  );
};

export default App;
