import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Button, TextInput, Title } from 'react-native-paper';
import { shopkeeperService } from '../services/api';

const CreateCategoryScreen = ({ navigation }: any) => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreateCategory = async () => {
    if (!name) {
      Alert.alert('Error', 'Please enter a category name');
      return;
    }

    setLoading(true);
    try {
      // Store ID should come from navigation params or state management
      const storeId = '67b17fc5b9ef7445674e715c'; // Replace with actual store ID
      await shopkeeperService.createCategory({ name, store: storeId });
      Alert.alert('Success', 'Category created successfully!');
      navigation.navigate('CreateItem');
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