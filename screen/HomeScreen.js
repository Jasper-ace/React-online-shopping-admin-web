import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  RefreshControl,
  TextInput,
} from 'react-native';

const HomeScreen = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchProducts = useCallback(async () => {
    try {
      const apiUrl = 'http://192.168.1.18/MyReactNative1/products.php';
      const response = await fetch(apiUrl);

      console.log('Response status:', response.status);

      const text = await response.text();
      console.log('Raw response:', text);

      const data = JSON.parse(text);
      console.log('Parsed data:', data);

      // Log information about the Images array for the first product
      if (data.length > 0 && data[0].Images && data[0].Images.length > 0) {
        console.log('First product Images:', data[0].Images);
        console.log('First Image URL:', data[0].Images[0].ImageUrl);
      }

      setProducts(data);
      // Initialize filteredProducts with all products on initial fetch
      setFilteredProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  }, []);


  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchProducts();
    setRefreshing(false);
  }, [fetchProducts]);

  const renderSquareItem = (item) => {
    console.log('Item:', item);

    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => navigation.navigate('prod', { product: item })}
      >
        {item.Images.map((image, index) => (
          <Image
            key={index}
            source={{ uri: image.ImageUrl }}
            style={styles.itemImage}
            onError={(error) => console.error('Image loading error:', error)}
          />
        ))}

        <Text style={styles.itemName}>{item.ProductName}</Text>
        <Text style={styles.itemPrice}>Price: ${item.Price}</Text>
        <Text style={styles.itemStocks}>Stocks: {item.Stocks}</Text>
      </TouchableOpacity>
    );
  };



  const renderTwoItemsPerRow = () => {
    const rows = [];
    for (let i = 0; i < filteredProducts.length; i += 2) {
      const firstItem = filteredProducts[i];
      const secondItem =
        i + 1 < filteredProducts.length ? filteredProducts[i + 1] : null;

      rows.push(
        <View key={i} style={styles.row}>
          {renderSquareItem(firstItem)}
          {secondItem && renderSquareItem(secondItem)}
        </View>
      );
    }
    return rows;
  };

  const handleSearch = (query) => {
    const filtered = products.filter((product) =>
      product.ProductName.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredProducts(filtered);
    setSearchQuery(query);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Clothing Shop</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {filteredProducts.length === 0 ? (
          <View style={styles.noProductContainer}>
            <Text style={styles.noProductText}>
              No products with the name "{searchQuery}" found.
            </Text>
          </View>
        ) : (
          renderTwoItemsPerRow()
        )}
      </ScrollView>

      {/* Footer */}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  searchInput: {
  height: 40,
  borderColor: 'gray',
  borderWidth: 1,
  paddingLeft: 8,
  flex: 1,
  marginLeft: -168, // Adjust this value based on your layout needs
  borderRadius: 10,
  marginTop: 100,
},

  scrollContent: {
    paddingBottom: 60, // Adjust this value to match the height of your footer
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  itemContainer: {
    flex: 1,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    height: 250,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  itemName: {
    fontSize: 18,
    marginTop: 0,
  },
  itemPrice: {
    fontSize: 16,
    color: 'green',
    marginTop: 4,
  },
  itemStocks: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  itemImage: {
    width: '100%',
    height: 150, // Adjust the height as needed
    resizeMode: 'cover', // or 'contain' depending on your preference
    borderRadius: 8,
    marginBottom: 8,
  },


  noProductContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  noProductText: {
    fontSize: 16,
    color: 'gray',
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
  footerLabel: {
    marginTop: 5,
    fontSize: 12,
    color: '#555',
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

export default HomeScreen;





