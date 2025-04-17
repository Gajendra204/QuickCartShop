import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Button, TextInput, Title } from 'react-native-paper';
import { shopkeeperService } from '../services/api';
import { useAuth } from '../context/AuthContext';


const CreateCategoryScreen = ({ navigation, route }: any) => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const { userId } = useAuth();
  const storeId = route.params?.storeId;


  const handleCreateCategory = async () => {
    if (!name) {
      Alert.alert('Error', 'Please enter a category name');
      return;
    }
    if (!userId) {
      Alert.alert('Error', 'User ID not found. Please log in again.');
      return;
    }
    

    setLoading(true);
    try {
      const response = await shopkeeperService.createCategory({ name, store: storeId }); // Use actual store ID
      Alert.alert('Success', 'Category created successfully!');
      navigation.navigate('CreateItem', { storeId, categoryId: response.data._id }); // Pass both IDs
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to create category');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Create New Category</Title>
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
        style={styles.button}
      >
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
});

export default CreateCategoryScreen;