import React, {useState} from 'react';
import {View, StyleSheet, Alert} from 'react-native';
import {Button, TextInput, Title} from 'react-native-paper';
import {shopkeeperService} from '../services/api';
import {useAuth} from '../context/AuthContext';

const CreateStoreScreen = ({navigation}: any) => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const {userId} = useAuth();

  const handleCreateStore = async () => {
    if (!name || !address) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    if (!userId) {
      Alert.alert('Error', 'User ID not found. Please log in again.');
      return;
    }

    setLoading(true);
    try {
      const response = await shopkeeperService.createStore({
        name,
        address,
        shopkeeper: {id: userId},
      });
      Alert.alert('Success', 'Store created successfully!');
      navigation.navigate('CreateCategory', {storeId: response.data._id}); // Pass the new store ID
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to create store',
      );
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
        style={styles.button}>
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
