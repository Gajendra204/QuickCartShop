import React, {useState} from 'react';
import {View, TextInput, Button, Alert} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const StoreCreationScreen = ({navigation}) => {
  const [storeName, setStoreName] = useState('');
  const [storeAddress, setStoreAddress] = useState('');

  const handleCreateStore = async () => {
    try {
      const token = await AsyncStorage.getItem('token'); // Retrieve the token
      const response = await axios.post(
        'http://192.168.1.13:6000/api/shopkeeper/stores',
        {
          name: storeName,
          address: storeAddress,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the headers
          },
        },
      );
      Alert.alert('Success', 'Store created successfully!');
      navigation.navigate('CategoryManagement', {storeId: response.data._id});
    } catch (error) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Store creation failed',
      );
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Store Name"
        value={storeName}
        onChangeText={setStoreName}
      />
      <TextInput
        placeholder="Store Address"
        value={storeAddress}
        onChangeText={setStoreAddress}
      />
      <Button title="Create Store" onPress={handleCreateStore} />
    </View>
  );
};

export default StoreCreationScreen;
