import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Receipt = ({ route }) => {
  const { userData, fetchedProductData, totalAmount } = route.params;
  const transactionId = generateRandomTransactionId(); // Function to generate a random transaction id
  const timeOrdered = formatTimeOrdered(); // Function to format the order timestamp

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Receipt</Text>

      {/* Display User Information */}
      {userData && (
        <View style={styles.userInfoContainer}>
          <View style={styles.userInfoBox}>
            <Text style={styles.userInfoLabel}>Sold By:</Text>
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
          <View style={styles.userInfoBox}>
            <Text style={styles.userInfoLabel}>Transaction Id:</Text>
            <Text style={styles.userInfo}>{transactionId}</Text>
          </View>
          <View style={styles.userInfoBox}>
            <Text style={styles.userInfoLabel}>Time Ordered:</Text>
            <Text style={styles.userInfo}>{timeOrdered}</Text>
          </View>
        </View>
      )}

      {/* Display Fetched Products in the Receipt */}
      {fetchedProductData && fetchedProductData.map((item) => (
        <View style={styles.productItem} key={item.product_id}>
          <Text style={styles.productName}>{item.productName}</Text>
          <Text style={styles.productPrice}>{`Price: $${item.price}`}</Text>
          <Text style={styles.productQuantity}>{`Quantity: ${item.quantity}`}</Text>
          <Text style={styles.productTotal}>{`Total: $${item.total_price}`}</Text>
        </View>
      ))}

      {/* Display Total Price in the Receipt */}
      <View style={styles.totalPriceContainer}>
        <Text style={styles.totalPriceLabel}>Total Price:</Text>
        <Text style={styles.totalPriceValue}>{`$${totalAmount}`}</Text>
      </View>
    </View>
  );
};

// Function to generate a random transaction id
const generateRandomTransactionId = () => {
  return Math.random().toString(36).substring(7);
};

// Function to format the order timestamp
// Function to format the order timestamp in 12-hour format
const formatTimeOrdered = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12; // Convert 0 to 12 for 12-hour format
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedTime = `${formattedHours}:${formattedMinutes} ${ampm}`;
    const formattedDate = `${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()}`;
    return `${formattedDate} - ${formattedTime}`;
  };


const styles = StyleSheet.create({
  // ... (unchanged styles)
  userInfoLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
  },
  userInfo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    alignSelf: 'center',

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
    fontWeight: 'bold',
    color: '#333',
  },
  productItem: {
    marginBottom: 12,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  productPrice: {
    fontSize: 16,
    marginBottom: 8,
    color: '#555',
  },
  productQuantity: {
    fontSize: 16,
    marginBottom: 8,
    color: '#555',
  },
  productTotal: {
    fontSize: 16,
    color: 'green',
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
});

export default Receipt;
