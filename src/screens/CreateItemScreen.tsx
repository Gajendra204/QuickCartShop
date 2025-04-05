import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Button, TextInput, Title } from 'react-native-paper';
import { shopkeeperService } from '../services/api';

const CreateItemScreen = ({ navigation }: any) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [mrp, setMrp] = useState('');
  const [discount, setDiscount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreateItem = async () => {
    if (!name || !description || !mrp || !discount) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      // These IDs should come from navigation params or state management
      const storeId = '67b17fc5b9ef7445674e715c'; // Replace with actual store ID
      const categoryId = '67b70a1a9d7a9e5be49cea6c'; // Replace with actual category ID
      
      await shopkeeperService.createItem({ 
        name,
        description,
        mrp: parseFloat(mrp),
        discount: parseFloat(discount),
        category: categoryId,
        store: storeId
      });
      
      Alert.alert('Success', 'Item created successfully!');
      navigation.navigate('Dashboard');
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to create item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Create New Item</Title>
      <TextInput
        label="Item Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        label="Description"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
      />
      <TextInput
        label="MRP"
        value={mrp}
        onChangeText={setMrp}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        label="Discount"
        value={discount}
        onChangeText={setDiscount}
        keyboardType="numeric"
        style={styles.input}
      />
      <Button 
        mode="contained" 
        onPress={handleCreateItem}
        loading={loading}
        style={styles.button}
      >
        Create Item
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 10,
  },
  button: {
    marginTop: 10,
  },
});

export default CreateItemScreen;