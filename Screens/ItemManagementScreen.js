import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ItemManagementScreen = ({ route, navigation }) => {
  const { storeId, categoryId } = route.params; // Get storeId and categoryId from navigation params
  const [itemName, setItemName] = useState('');
  const [itemDescription, setItemDescription] = useState('');
  const [itemMRP, setItemMRP] = useState('');
  const [itemDiscount, setItemDiscount] = useState('');

  const handleAddItem = async () => {
    try {
      const token = await AsyncStorage.getItem('token'); // Retrieve the token
      const response = await axios.post(
        'http://192.168.1.13:6000/api/shopkeeper/items',
        {
          name: itemName,
          description: itemDescription,
          mrp: itemMRP,
          discount: itemDiscount,
          category: categoryId,
          store: storeId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the headers
          },
        }
      );
      Alert.alert('Success', 'Item added successfully!');
      navigation.goBack(); // Go back to the previous screen
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to add item');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput placeholder="Item Name" value={itemName} onChangeText={setItemName} style={styles.input} />
      <TextInput placeholder="Description" value={itemDescription} onChangeText={setItemDescription} style={styles.input} />
      <TextInput placeholder="MRP" value={itemMRP} onChangeText={setItemMRP} keyboardType="numeric" style={styles.input} />
      <TextInput placeholder="Discount" value={itemDiscount} onChangeText={setItemDiscount} keyboardType="numeric" style={styles.input} />
      <Button title="Add Item" onPress={handleAddItem} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    marginBottom: 16,
    padding: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
  },
});

export default ItemManagementScreen;