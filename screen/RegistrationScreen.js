import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Text, TextInput as PaperTextInput, Button, RadioButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const RegistrationScreen = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [gender, setGender] = useState('male');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const navigation = useNavigation();

  const handleRegister = async () => {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    formData.append('gender', gender);
    formData.append('address', address);
    formData.append('phoneNumber', phoneNumber);

    // Log serialized data
    console.log('Serialized data to be sent:', formData);

    try {
      console.log('Attempting registration...');

      // Validate password and confirm password match
      if (password !== confirmPassword) {
        Alert.alert('Registration Failed', 'Passwords do not match.');
        return;
      }

      const response = await axios.post(
        'http://192.168.1.18/MyReactNative1/register.php',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log('Server responded:', response.data);

      const responseData = response.data;

      if (responseData.success) {
        // Clear form fields on successful registration
        setFirstName('');
        setLastName('');
        setUsername('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setGender('male');
        setAddress('');
        setPhoneNumber('');

        navigation.navigate('Login');
      } else {
        Alert.alert('Registration Failed', responseData.message);
      }
    } catch (error) {
      console.error('Registration failed:', error.message);
      Alert.alert('Registration Failed', 'Please try again later.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Register</Text>

        <View style={styles.row}>
          <View style={styles.column}>
            <PaperTextInput
              label="First Name"
              value={firstName}
              onChangeText={(text) => setFirstName(text)}
              style={styles.smallInput}
            />
          </View>
          <View style={styles.column}>
            <PaperTextInput
              label="Last Name"
              value={lastName}
              onChangeText={(text) => setLastName(text)}
              style={styles.smallInput}
            />
          </View>
        </View>

        <PaperTextInput
          label="Username"
          value={username}
          onChangeText={(text) => setUsername(text)}
          style={styles.smallInput}
        />

        <View style={styles.row}>
          <View style={styles.column}>
            <Text>Gender:</Text>
            <View style={styles.radioButtonContainer}>
              <RadioButton.Group
                onValueChange={(value) => setGender(value)}
                value={gender}
              >
                <View style={styles.radioButton}>
                  <RadioButton value="male" />
                  <Text>MALE</Text>
                </View>
                <View style={styles.radioButton}>
                  <RadioButton value="female" />
                  <Text>FEMALE</Text>
                </View>
              </RadioButton.Group>
            </View>
          </View>
        </View>

        <PaperTextInput
          label="Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
          keyboardType="email-address"
          style={styles.smallInput}
        />

        <PaperTextInput
          label="Password"
          value={password}
          onChangeText={(text) => setPassword(text)}
          secureTextEntry
          style={styles.smallInput}
        />

        <PaperTextInput
          label="Confirm Password"
          value={confirmPassword}
          onChangeText={(text) => setConfirmPassword(text)}
          secureTextEntry
          style={styles.smallInput}
        />

        <PaperTextInput
          label="Address"
          value={address}
          onChangeText={(text) => setAddress(text)}
          style={styles.smallInput}
        />

        <PaperTextInput
          label="Phone Number"
          value={phoneNumber}
          onChangeText={(text) => setPhoneNumber(text)}
          keyboardType="phone-pad"
          style={styles.smallInput}
        />

        <Button mode="contained" style={styles.button} onPress={handleRegister}>
          Register
        </Button>

        <View style={styles.bottomContainer}>
          <Text>Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginText}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
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
  smallInput: {
    marginBottom: 8, // Adjust this value to control the height of the input fields
  },
  button: {
    marginTop: 20,
  },
  bottomContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  loginText: {
    color: '#3498db',
    marginTop: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {
    flex: 1,
    marginRight: 8,
  },
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
});

export default RegistrationScreen;