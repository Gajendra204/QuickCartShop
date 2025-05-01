import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Alert} from 'react-native';
import {Button, TextInput, Title} from 'react-native-paper';
import {shopkeeperService} from '../services/api';
import {Picker} from '@react-native-picker/picker';

interface Store {
  _id: string;
  name: string;
}

interface Category {
  _id: string;
  name: string;
  store: string;
}

const CreateItemScreen = ({navigation}: any) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    mrp: '',
    discount: '',
  });
  const [loading, setLoading] = useState(false);
  const [stores, setStores] = useState<Store[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedStore, setSelectedStore] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loadingCategories, setLoadingCategories] = useState(false);

  useEffect(() => {
    fetchStores();
  }, []);

  useEffect(() => {
    if (selectedStore) {
      fetchCategories(selectedStore);
    }
  }, [selectedStore]);

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

  const fetchCategories = async (storeId: string) => {
    setLoadingCategories(true);
    try {
      const response = await shopkeeperService.getCategoriesByStore(storeId);
      setCategories(response.data);
      if (response.data.length > 0) {
        setSelectedCategory(response.data[0]._id);
      } else {
        setSelectedCategory('');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      Alert.alert('Error', 'Failed to fetch categories');
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({...prev, [name]: value}));
  };

  const validateForm = () => {
    if (!selectedStore) {
      Alert.alert('Error', 'Please select a store');
      return false;
    }
    if (!selectedCategory) {
      Alert.alert('Error', 'Please select a category');
      return false;
    }
    if (!formData.name) {
      Alert.alert('Error', 'Please enter item name');
      return false;
    }
    if (!formData.description) {
      Alert.alert('Error', 'Please enter item description');
      return false;
    }
    if (!formData.mrp || isNaN(Number(formData.mrp))) {
      Alert.alert('Error', 'Please enter a valid MRP');
      return false;
    }
    if (!formData.discount || isNaN(Number(formData.discount))) {
      Alert.alert('Error', 'Please enter a valid discount');
      return false;
    }
    if (Number(formData.discount) > Number(formData.mrp)) {
      Alert.alert('Error', 'Discount cannot be greater than MRP');
      return false;
    }
    return true;
  };

  const handleCreateItem = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await shopkeeperService.createItem({
        name: formData.name,
        description: formData.description,
        mrp: Number(formData.mrp),
        discount: Number(formData.discount),
        category: selectedCategory,
        store: selectedStore,
      });

      Alert.alert('Success', 'Item created successfully!', [
        {
          text: 'Create Another',
          onPress: () => {
            setFormData({
              name: '',
              description: '',
              mrp: '',
              discount: '',
            });
          },
        },
        {
          text: 'View Items',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to create item',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Create New Item</Title>

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedStore}
          onValueChange={itemValue => setSelectedStore(itemValue)}
          style={styles.picker}>
          {stores.map(store => (
            <Picker.Item key={store._id} label={store.name} value={store._id} />
          ))}
        </Picker>
      </View>

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedCategory}
          onValueChange={itemValue => setSelectedCategory(itemValue)}
          style={styles.picker}
          enabled={!loadingCategories}>
          {categories.map(category => (
            <Picker.Item
              key={category._id}
              label={category.name}
              value={category._id}
            />
          ))}
        </Picker>
      </View>

      <TextInput
        label="Item Name"
        value={formData.name}
        onChangeText={value => handleInputChange('name', value)}
        style={styles.input}
      />

      <TextInput
        label="Description"
        value={formData.description}
        onChangeText={value => handleInputChange('description', value)}
        multiline
        numberOfLines={3}
        style={styles.input}
      />

      <TextInput
        label="MRP"
        value={formData.mrp}
        onChangeText={value => handleInputChange('mrp', value)}
        keyboardType="decimal-pad"
        style={styles.input}
      />

      <TextInput
        label="Discount"
        value={formData.discount}
        onChangeText={value => handleInputChange('discount', value)}
        keyboardType="decimal-pad"
        style={styles.input}
      />

      <Button
        mode="contained"
        onPress={handleCreateItem}
        loading={loading}
        style={styles.button}>
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

export default CreateItemScreen;
