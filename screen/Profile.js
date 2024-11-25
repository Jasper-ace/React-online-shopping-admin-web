import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useAuth } from './AuthContext'; // Adjust the path accordingly

const Profile = ({ navigation }) => {
  const { authenticatedUsername, logout } = useAuth();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (authenticatedUsername) {
      fetch(`http://192.168.1.18/MyReactNative1/fetch.php?username=${authenticatedUsername}`)
        .then((response) => response.json())
        .then((data) => {
          setUserData(data);
        })
        .catch((error) => {
          console.error('Error fetching user data:', error);
        });
    }
  }, [authenticatedUsername]);

  const getProfileImage = () => {
    if (userData && userData.gender) {
      const gender = userData.gender.toLowerCase();
      if (gender === 'male') {
        return require('../image/male.png'); // Adjust the path accordingly
      } else if (gender === 'female') {
        return require('../image/female.png'); // Adjust the path accordingly
      }
    }
    // Default profile picture if gender is not available or not male/female
    return require('../image/profile.png'); // Adjust the path accordingly
  };

  const handleLogout = async () => {
    try {
      // Call the PHP logout script
      const response = await fetch('http://192.168.1.18/MyReactNative1/logout.php');
      const result = await response.json();


      if (result.success) {
        // If the server indicates successful logout, navigate to the 'Login' screen
        navigation.navigate('Login');
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };


  return (
    <View style={styles.container}>
      {userData ? (
        <View style={styles.profileContainer}>
          <Image source={getProfileImage()} style={styles.userImage} />
          <View style={styles.userDataContainer}>
            <Text style={styles.userInfoLabel}>Username:</Text>
            <Text style={styles.userInfo}>{userData.username}</Text>

            <Text style={styles.userInfoLabel}>Full Name:</Text>
            <Text style={styles.userInfo}>{`${userData.first_name} ${userData.last_name}`}</Text>

            <Text style={styles.userInfoLabel}>Gender:</Text>
            <Text style={styles.userInfo}>{userData.gender}</Text>

            <Text style={styles.userInfoLabel}>Email:</Text>
            <Text style={styles.userInfo}>{userData.email}</Text>

            <Text style={styles.userInfoLabel}>Address:</Text>
            <Text style={styles.userInfo}>{userData.address}</Text>

            <Text style={styles.userInfoLabel}>Phone Number:</Text>
            <Text style={styles.userInfo}>{userData.phone_number}</Text>


          </View>
        </View>
      ) : (
        <Text>No user data available</Text>
      )}

      {/* Logout button */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>

      {/* Navigation footer */}
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <View style={styles.footerItem}>
            <Image source={require('../image/home.png')} style={styles.footerIcon} />
            <Text style={styles.footerLabel}>Home</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
          <View style={styles.footerItem}>
            <Image source={require('../image/cart.png')} style={styles.footerIcon} />
            <Text style={styles.footerLabel}>Cart</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('OrderHistory')}>
          <View style={styles.footerItem}>
            <Image source={require('../image/order_history.png')} style={styles.footerIcon} />
            <Text style={styles.footerLabel}>Orders</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <View style={styles.footerItem}>
            <Image source={require('../image/acct.png')} style={styles.footerIcon} />
            <Text style={styles.footerLabel}>Me</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  profileContainer: {
    alignItems: 'center',
  },
  userImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 16,
  },
  userDataContainer: {
    width: '100%',
    marginTop: 16,
  },
  userInfoLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#555',
  },
  userInfo: {
    fontSize: 18,
    marginBottom: 12,
    color: '#333',
  },
  logoutButton: {
    backgroundColor: 'red',
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 16,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    backgroundColor: '#ddd',
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  footerItem: {
    alignItems: 'center',
  },
  footerIcon: {
    width: 30,
    height: 30,
  },
  footerLabel: {
    marginTop: 5,
    fontSize: 12,
    color: '#555',
  },
});

export default Profile;
