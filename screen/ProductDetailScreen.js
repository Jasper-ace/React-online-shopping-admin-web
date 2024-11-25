import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Modal, Image, TouchableWithoutFeedback } from 'react-native';
import axios from 'axios';
import { useAuth } from './AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProductDetailScreen = ({ route }) => {
  const { product } = route.params;
  const [isQuantityModalVisible, setQuantityModalVisible] = useState(false);
  const [isCheckoutModalVisible, setCheckoutModalVisible] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [user_id, setUserId] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { authenticatedUsername, setAuthUsername } = useAuth();

  useEffect(() => {
    const retrieveUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('user_id');

        if (storedUserId) {
          setUserId(storedUserId);
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
          console.warn('User ID not found in AsyncStorage. User may not be logged in.');
        }
      } catch (error) {
        console.error('Error retrieving user ID:', error.message);
      }
    };

    retrieveUserId();
  }, []);

  const hideQuantityModal = () => {
    setQuantityModalVisible(false);
  };

  const hideCheckoutModal = () => {
    setCheckoutModalVisible(false);
  };

  const handleCheckout = () => {
    hideQuantityModal(); // Close the quantity modal if it's open
    setCheckoutModalVisible(true); // Show the checkout modal
  };

  const handleAddToCart = async () => {
    if (!user_id) {
      console.error('User ID not available. Ensure the user is authenticated.');
      return;
    }

    const numericUserId = await fetchNumericUserId(user_id);

    if (!numericUserId) {
      console.error('Numeric user ID not found for the given username.');
      return;
    }

    const payload = {
      user_id: numericUserId,
      product_id: product.ProductId,
      quantity: quantity,
      total_price: product.Price * quantity,
    };

    console.log('Request Payload:', payload);

    const headers = {
      'Content-Type': 'application/json',
    };

    try {
      const response = await axios.post('http://192.168.1.18/MyReactNative1/addToCart.php', JSON.stringify(payload), { headers });

      if (response.status === 200) {
        const responseData = response.data;

        if (responseData.success) {
          console.log('Product added to cart successfully');
          setQuantityModalVisible(false); // Close the quantity modal after adding to cart
        } else {
          console.error('Error:', responseData.message);
        }
      } else {
        console.error('Error:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  const fetchNumericUserId = async (username) => {
    try {
      const response = await axios.get(`http://192.168.1.18/MyReactNative1/fetchNumericUserId.php?username=${username}`);

      if (response.status === 200) {
        return response.data.numericUserId;
      } else {
        console.error('Error fetching numeric user ID:', response.statusText);
        return null;
      }
    } catch (error) {
      console.error('Error fetching numeric user ID:', error.message);
      return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.productInfo}>
        {product.Images && product.Images.length > 0 && (
          <Image
            source={{ uri: product.Images[0].ImageUrl }}
            style={styles.productImage}
          />
        )}
        <Text style={styles.productName}>{product.ProductName}</Text>
        <Text style={styles.productPrice}>{`$${product.Price}`}</Text>
        <Text style={styles.productStock}>{`Stock: ${product.Stocks}`}</Text>
      </View>

      <View style={styles.space} />

      <TouchableOpacity
        style={styles.button}
        onPress={() => setQuantityModalVisible(true)}
      >
        <Text style={styles.buttonText}>Add to Cart</Text>
      </TouchableOpacity>

      <View style={styles.space} />

      <TouchableOpacity
        style={[styles.button, { backgroundColor: 'orange' }]}
        onPress={handleCheckout}
      >
        <Text style={styles.buttonText}>Checkout</Text>
      </TouchableOpacity>

      <Modal
        transparent
        animationType="slide"
        visible={isQuantityModalVisible}
        onRequestClose={hideQuantityModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{product.ProductName}</Text>
            <Text style={styles.greenText}>{`Price: $${product.Price}`}</Text>
            <Text style={styles.greenText}>{`Stocks: ${product.Stocks}`}</Text>
            <View style={styles.quantityContainer}>
              <Text>Quantity</Text>
              <View style={styles.quantityInputContainer}>
                <TouchableOpacity
                  style={[styles.quantityButton, { backgroundColor: 'red' }]}
                  onPress={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Text style={styles.buttonText}>-</Text>
                </TouchableOpacity>
                <TextInput
                  style={[
                    styles.quantityInput,
                    { textAlign: 'center', flex: 0, marginLeft: 8, marginRight: 8, marginBottom: 3 },
                  ]}
                  keyboardType="numeric"
                  value={quantity.toString()}
                  onChangeText={(text) => setQuantity(parseInt(text, 10))}
                />
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => setQuantity(Math.min(product.Stocks, quantity + 1))}
                >
                  <Text style={styles.buttonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: 'blue' }]}
              onPress={handleAddToCart}
            >
              <Text style={styles.buttonText}>Add to Cart</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: 'red' }]}
              onPress={hideQuantityModal}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Checkout Modal */}
      <Modal
        transparent
        animationType="slide"
        visible={isCheckoutModalVisible}
        onRequestClose={hideCheckoutModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>

            <Text style={styles.modalTitle}>{product.ProductName}</Text>
            <Text style={styles.greenText}>{`Price: $${product.Price}`}</Text>
            <Text style={styles.greenText}>{`Stocks: ${product.Stocks}`}</Text>
            <View style={styles.quantityContainer}>
              <Text>Quantity</Text>
              <View style={styles.quantityInputContainer}>
                <TouchableOpacity
                  style={[styles.quantityButton, { backgroundColor: 'red' }]}
                  onPress={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Text style={styles.buttonText}>-</Text>
                </TouchableOpacity>
                <TextInput
                  style={[
                    styles.quantityInput,
                    { textAlign: 'center', flex: 0, marginLeft: 8, marginRight: 8, marginBottom: 3 },
                  ]}
                  keyboardType="numeric"
                  value={quantity.toString()}
                  onChangeText={(text) => setQuantity(parseInt(text, 10))}
                />
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => setQuantity(Math.min(product.Stocks, quantity + 1))}
                >
                  <Text style={styles.buttonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: 'blue' }]}
              onPress={hideCheckoutModal}
            >
              <Text style={styles.buttonText}>Checkout</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: 'red' }]}
              onPress={hideCheckoutModal}
            >
              <Text style={styles.buttonText}>Cancel</Text>

            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'flex-end',
  },
  productInfo: {
    marginBottom: 16,
  },
  productImage: {
    width: '100%',
    height: 500,
    resizeMode: 'cover',
    borderRadius: 8,
    marginBottom: 8,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  productPrice: {
    fontSize: 18,
    color: 'green',
    marginTop: 8,
  },
  productStock: {
    fontSize: 16,
    color: 'blue',
    marginTop: 8,
  },
  button: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: 'blue',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  space: {
    height: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  quantityInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  modalButton: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: 'blue',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  greenText: {
    color: 'green',
  },
  quantityContainer: {
    marginBottom: 16,
  },
  quantityInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginRight: 'auto',
  },
  quantityButton: {
    backgroundColor: 'blue',
    borderRadius: 4,
    padding: 8,
  },
});

export default ProductDetailScreen;
