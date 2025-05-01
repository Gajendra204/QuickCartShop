import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Button, TextInput, Title } from 'react-native-paper';
import { shopkeeperService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Picker } from '@react-native-picker/picker';

interface Store {
  _id: string;
  name: string;
}

const CreateCategoryScreen = ({ navigation, route }: any) => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [stores, setStores] = useState<Store[]>([]);
  const [selectedStore, setSelectedStore] = useState('');
  const { userId } = useAuth();

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      const response = await shopkeeperService.getStores();
      setStores(response.data);
      if (response.data.length > 0) {
        setSelectedStore(response.data[0]._id);
      }
    } catch (error) {
      console.error('Error fetching stores:', error);
      Alert.alert('Error', 'Failed to fetch stores');
    }
  };

  const handleCreateCategory = async () => {
    if (!name) {
      Alert.alert('Error', 'Please enter a category name');
      return;
    }

    if (!selectedStore) {
      Alert.alert('Error', 'Please select a store');
      return;
    }

    if (!userId) {
      Alert.alert('Error', 'User ID not found. Please log in again.');
      return;
    }

    setLoading(true);
    try {
      const response = await shopkeeperService.createCategory({
        name,
        store: selectedStore,
      });
      Alert.alert('Success', 'Category created successfully!');
      navigation.navigate('CreateItem', {
        storeId: selectedStore,
        categoryId: response.data._id,
      });
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to create category',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Create New Category</Title>

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedStore}
          onValueChange={itemValue => setSelectedStore(itemValue)}
          style={styles.picker}>
          {stores.map(store => (
            <Picker.Item
              key={store._id}
              label={store.name}
              value={store._id}
            />
          ))}
        </Picker>
      </View>

      <TextInput
        label="Category Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      <Button
        mode="contained"
        onPress={handleCreateCategory}
        loading={loading}
        style={styles.button}>
        Create Category
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
  pickerContainer: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
  },
  picker: {
    height: 50,
  },
});

export default CreateCategoryScreen;