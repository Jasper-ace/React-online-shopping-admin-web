import React from 'react';
import { View, StyleSheet, ImageBackground } from 'react-native';
import { Title, Button } from 'react-native-paper';

const GetStartedScreen = ({ navigation }) => {
  const handleGetStarted = () => {
    // Handle the action when the user clicks "Get Started"
    // For example, navigate to the next screen
    navigation.navigate('Register'); // Replace 'Home' with the actual home screen name
  };

  return (
    <ImageBackground
      source={require('../image/getstarted.jpg')}
      style={styles.backgroundImage}
    >
      <View style={styles.overlay}>
        <Title style={styles.title}>Welcome</Title>
        <View style={styles.container}>
          {/* Other content can go here */}
        </View>
        <Button
          mode="contained"
          style={styles.button}
          onPress={handleGetStarted}
        >
          Get Started
        </Button>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'flex-end', // Align content to the bottom of the screen
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black overlay
    justifyContent: 'space-between', // Align content to the top and bottom of the screen
    padding: 16,
  },
  container: {
    // Other content styles go here
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    alignSelf: 'center',
  },
  button: {
    margin: 16,
    backgroundColor: '#2196F3', // Material Blue color
  },
});

export default GetStartedScreen;
