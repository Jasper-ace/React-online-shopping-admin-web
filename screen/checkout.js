import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList } from 'react-native';
import { useAuth } from './AuthContext';
import { useUser } from './userContext';

const Checkout = ({ navigation, route }) => {
  const { authenticatedUsername, authenticatedUserId, setAuthUsername } = useAuth();
  const { user } = useUser();
  const [userData, setUserData] = useState(null);
  const [fetchedProductData, setFetchedProductData] = useState([]);
  const selectedProducts = route.params?.selectedProducts || [];

  useEffect(() => {
    if (user && user.username) {
      setAuthUsername(user.username);
    }
  }, [user, setAuthUsername]);

  useEffect(() => {
    if (authenticatedUserId) {
      fetchUser(authenticatedUsername);
      fetchProducts(authenticatedUserId, selectedProducts);
    }
  }, [authenticatedUserId, authenticatedUsername, selectedProducts]);

  const fetchUser = (username) => {
    fetch(`http://192.168.1.18/MyReactNative1/fetch.php?username=${username}`)
      .then((response) => response.json())
      .then((data) => {
        setUserData(data);
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
      });
  };

  const fetchProducts = async (user_id, productIds) => {
    try {
      if (!productIds || !productIds.length) {
        console.error('Product IDs are undefined or empty');
        return;
      }

      const response = await fetch(`http://192.168.1.18/MyReactNative1/getCart.php/?user_id=${user_id}`);

      if (response.ok) {
        const fetchedProductData = await response.json();
        console.log('Fetched Product Data:', fetchedProductData);

        // Filter the fetched data based on selected product IDs
        const filteredProducts = fetchedProductData.filter((product) => productIds.includes(product.product_id));
        setFetchedProductData(filteredProducts);
      } else {
        console.error('Failed to fetch product data');
      }
    } catch (error) {
      console.error('Error fetching product data:', error);
    }
  };

  const renderProductItem = ({ item }) => (
    <View style={styles.productItem}>
      <Image source={{ uri: item.image_url }} style={styles.productImage} />
      <Text style={styles.productName}>{item.productName}</Text>
      <Text style={styles.productPrice}>{`Price: $${item.price}`}</Text>
      <Text style={styles.productQuantity}>{`Quantity: ${item.quantity}`}</Text>
      <Text style={styles.productTotal}>{`Total: $${item.total_price}`}</Text>
    </View>
  );

  const calculateTotalPrice = () => {
    return fetchedProductData.reduce((total, product) => total + parseFloat(product.total_price), 0).toFixed(2);
  };
  const handlePayPress = async () => {
    const totalAmount = calculateTotalPrice();
    console.log('Total Amount from handlePayPress:', totalAmount);

    const orderData = {
      user_id: authenticatedUserId,
      products: fetchedProductData.map((product) => ({
        product_id: product.product_id,
        quantity: product.quantity,
        total_price: parseFloat(product.total_price), // Convert to float
      })),
      total_amount: totalAmount,
      error_payload: "Additional payload for error identification", // Add your custom payload here
    };

    try {
      const response = await fetch('http://192.168.1.18/MyReactNative1/saveOrder.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        // Update product stock after a successful order
        fetchedProductData.forEach(async (product) => {
          const updateStockResponse = await fetch('http://192.168.1.18/MyReactNative1/updateStock.php', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              product_id: product.product_id,
              quantity: product.quantity,
            }),
          });

          if (!updateStockResponse.ok) {
            console.error('Failed to update product stock:', updateStockResponse.status);
            // Handle the error as needed
          }
        });

        console.log('Order saved successfully.');
        navigation.navigate('Receipt', {
          userData: userData,
          fetchedProductData: fetchedProductData,
          totalAmount: totalAmount,
        });
      } else {
        // Log detailed error information
        const errorDetails = await response.text();
        console.error('Failed to save order. Server response:', response.status, errorDetails);

        // You can also throw an error to catch it in the catch block
        throw new Error('Failed to save order. Server response:' + response.status + ' ' + errorDetails);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Checkout your finds</Text>
      {userData ? (
        <View style={styles.userDataContainer}>
          {userData.user_image && (
            <Image source={{ uri: userData.user_image }} style={styles.userImage} />
          )}
          <View style={styles.userInfoContainer}>
            <View style={styles.userInfoBox}>
              <Text style={styles.userInfoLabel}>Full Name:</Text>
              <Text style={styles.userInfo}>{`${userData.first_name} ${userData.last_name}`}</Text>
            </View>
            <View style={styles.userInfoBox}>
              <Text style={styles.userInfoLabel}>Address:</Text>
              <Text style={styles.userInfo}>{userData.address}</Text>
            </View>
            <View style={styles.userInfoBox}>
              <Text style={styles.userInfoLabel}>Phone Number:</Text>
              <Text style={styles.userInfo}>{userData.phone_number}</Text>
            </View>
          </View>
        </View>
      ) : (
        <Text>No user data available</Text>
      )}

      {/* Display Fetched Products */}
      <FlatList
        data={fetchedProductData}
        renderItem={renderProductItem}
        keyExtractor={(item) => item.product_id}
        style={styles.productList}
      />

      {/* Display Total Price and Pay Button */}
      <TouchableOpacity onPress={handlePayPress} style={styles.payButton}>
        <Text style={styles.payButtonText}>PAY: {`$${calculateTotalPrice()}`}</Text>
      </TouchableOpacity>
      <View style={styles.totalPriceContainer}>
        <Text style={styles.totalPriceLabel}>Total Price:</Text>
        <Text style={styles.totalPriceValue}>{`$${calculateTotalPrice()}`}</Text>
      </View>



      {/* Footer Navigation */}
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
  userImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 16,
    alignSelf: 'center',
  },
  userDataContainer: {
    width: '100%',
    marginTop: 16,
  },
  userInfoContainer: {
    marginTop: 16,
  },
  userInfoBox: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  userInfoLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
  },
  userInfo: {
    fontSize: 18,
    color: '#333',
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
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    alignSelf: 'center'
  },
  productList: {
    marginTop: 16,
  },
  productItem: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginBottom: 8,
    alignSelf: 'center',
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
    textAlign: 'center',
  },
  productPrice: {
    fontSize: 16,
    marginBottom: 8,
    color: '#555',
    textAlign: 'center',
  },
  productQuantity: {
    fontSize: 16,
    marginBottom: 8,
    color: '#555',
    textAlign: 'center',
  },
  productTotal: {
    fontSize: 16,
    color: 'green',
    textAlign: 'center',
  },
  totalPriceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  totalPriceLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalPriceValue: {
    fontSize: 18,
    color: 'green',
  },
  payButton: {
    backgroundColor: 'orange',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    alignItems: 'center',
    bottom: 20,
  },
  payButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Checkout;
