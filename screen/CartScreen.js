import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList, RefreshControl } from 'react-native';
import axios from 'axios';
import { RadioButton } from 'react-native-paper';
import { useUser } from './userContext';
import { useAuth } from './AuthContext'; // Update with the correct path

const CartScreen = ({ navigation }) => {
  const { user } = useUser();
  const { authenticatedUserId, setAuthUsername } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user && user.username) {
      setAuthUsername(user.username);
    }
  }, [user, setAuthUsername]);

  useEffect(() => {
    if (authenticatedUserId) {
      fetchCart(authenticatedUserId);
    }
  }, [authenticatedUserId]);

  useEffect(() => {
    const total = selectedProducts.reduce((sum, product) => {
      const cartItem = cartItems.find((item) => item.product_id === product);
      return sum + (cartItem ? parseFloat(cartItem.total_price) : 0);
    }, 0);
    setTotalPrice(total.toFixed(2));
  }, [selectedProducts, cartItems]);

  const handleRadioChange = (product_id) => {
    const updatedSelectedProducts = [...selectedProducts];
    const index = updatedSelectedProducts.indexOf(product_id);
    if (index === -1) {
      updatedSelectedProducts.push(product_id);
    } else {
      updatedSelectedProducts.splice(index, 1);
    }
    setSelectedProducts(updatedSelectedProducts);
  };

  const fetchCart = async (user_id) => {
    try {
      setRefreshing(true);
      const response = await fetch(`http://192.168.1.18/MyReactNative1/getCart.php?user_id=${user_id}`, {
        headers: {
          'Cache-Control': 'no-cache',
        },
      });

      if (response.ok) {
        const fetchedCartItems = await response.json();
        console.log('Fetched Cart Items:', fetchedCartItems);
        setCartItems(fetchedCartItems);
      } else {
        console.error('Failed to fetch cart items');
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleCheckout = () => {
    console.log('Checkout initiated for selected products:', selectedProducts);

    // Pass the selected products to the Checkout screen
    navigation.navigate('Checkout', { selectedProducts });
  };

  const handleDelete = async (product_id) => {
    try {
      const response = await axios.delete(`http://192.168.1.18/MyReactNative1/removeFromCart.php`, {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
        data: {
          user_id: authenticatedUserId,
          product_id: product_id,
        },
      });

      if (response.status === 200) {
        // Product removed successfully, update the cart
        fetchCart(authenticatedUserId);
      } else {
        console.error('Failed to remove product from cart');
      }
    } catch (error) {
      console.error('Error removing product from cart:', error);
    }
  };

  const onRefresh = () => {
    if (authenticatedUserId) {
      fetchCart(authenticatedUserId);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Cart Items</Text>
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.product_id.toString()}
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
            <RadioButton
              value={item.product_id}
              status={selectedProducts.includes(item.product_id) ? 'checked' : 'unchecked'}
              onPress={() => handleRadioChange(item.product_id)}
            />
            <Image source={{ uri: item.image_url }} style={styles.productImage} />
            <Text>{`Product Name: ${item.productName}`}</Text>
            <Text>{`Quantity: ${item.quantity}`}</Text>
            <Text>{`Total Price: $${item.total_price}`}</Text>

            {/* Delete button */}
            <TouchableOpacity onPress={() => handleDelete(item.product_id)}>
              <View style={styles.deleteButton}>
                <Text style={styles.deleteButtonText}>Delete</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyCartContainer}>
            <Text>Cart is empty</Text>
          </View>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />

      {/* Design section */}
      <View style={styles.design}>
        <TouchableOpacity onPress={handleCheckout}>
          <View style={styles.checkoutButton}>
            <Text style={styles.checkoutButtonText}>PAY: ${totalPrice}</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Footer navigation items */}
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
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    alignSelf: 'center',
  },
  emptyCartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartItem: {
    marginBottom: 16,
    borderColor: '#ddd',
    borderWidth: 1,
    padding: 16,
    borderRadius: 8,
  },
  productImage: {
    width: '100%',
    height: 500,
    resizeMode: 'cover',
    borderRadius: 8,
    marginBottom: 8,
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
  checkoutButton: {
    backgroundColor: 'orange',
    padding: 12,
    borderRadius: 8,
    height: 45,
    width: 400,
  },
  checkoutButtonText: {
    color: 'white',
    fontWeight: 'bold',
    alignSelf: 'center',
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
  design: {
    alignItems: 'center',
    marginBottom: 60,
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 8,
    borderRadius: 4,
    marginTop: 8,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default CartScreen;
