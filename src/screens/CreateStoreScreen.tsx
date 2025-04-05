import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Button, TextInput, Title } from 'react-native-paper';
import { shopkeeperService } from '../services/api';

const CreateStoreScreen = ({ navigation }: any) => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreateStore = async () => {
    if (!name || !address) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      // In a real app, you'd get the shopkeeper ID from your auth state
      const shopkeeperId = '67d3f8c0e073e713ac829b50'; // This should come from your auth context
      await shopkeeperService.createStore({ 
        name, 
        address, 
        shopkeeper: { id: shopkeeperId } 
      });
      Alert.alert('Success', 'Store created successfully!');
      navigation.navigate('CreateCategory');
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to create store');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Create New Store</Title>
      <TextInput
        label="Store Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        label="Address"
        value={address}
        onChangeText={setAddress}
        style={styles.input}
      />
      <Button 
        mode="contained" 
        onPress={handleCreateStore}
        loading={loading}
        style={styles.button}
      >
        Create Store
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

export default CreateStoreScreen;