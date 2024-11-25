import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { useUser } from './userContext';
import { useAuth } from './AuthContext';

const OrderHistory = ({ navigation }) => {
  const [orderHistory, setOrderHistory] = useState([]);
  const { user } = useUser();
  const { authenticatedUserId, setAuthUsername } = useAuth();

  useEffect(() => {
    if (user && user.username) {
      setAuthUsername(user.username);
    }
  }, [user, setAuthUsername]);

  useEffect(() => {
    if (authenticatedUserId) {
      fetchOrderHistory(authenticatedUserId);
    }
  }, [authenticatedUserId]);

  const fetchOrderHistory = async (user_id) => {
    try {
      const response = await fetch(`http://192.168.1.18/MyReactNative1/fetchOrderHistory.php?user_id=${user_id}`);
      const data = await response.json();

      if (response.ok) {
        setOrderHistory(data.orderHistory);
      } else {
        console.error('Failed to fetch order history:', data.message || 'Unknown error');
      }
    } catch (error) {
      console.error('Error fetching order history:', error.message || 'Unknown error');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order History</Text>

      <FlatList
        data={orderHistory}
        keyExtractor={(item) => item.order_id.toString()}
        renderItem={({ item }) => (
          <View style={styles.orderItem}>
            <Text>Product Name: {item.ProductName}</Text>
            <Text>Quantity: {item.quantity}</Text>
            <Text>Total Price: ${item.total_price}</Text>
            <Text>Order Date: {item.order_date}</Text>
          </View>
        )}
      />

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
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  orderItem: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    width: 380,
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
  footerIcon: {
    width: 30,
    height: 30,
  },
  footerItem: {
    alignItems: 'center',
  },
  footerLabel: {
    marginTop: 5,
    fontSize: 12,
    color: '#555',
  },
});

export default OrderHistory;
