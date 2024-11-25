// ProductPhotos.js
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const ProductPhotos = ({ photoData }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Product Photos:</Text>
      {photoData.map((photo, index) => (
        <Image key={index} source={{ uri: photo.photo_path }} style={styles.image} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  image: {
    width: 100,
    height: 100,
    marginVertical: 5,
  },
});

export default ProductPhotos;
