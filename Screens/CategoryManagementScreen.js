import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  Button,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CategoryManagementScreen = ({route, navigation}) => {
  const {storeId} = route.params; // Get storeId from navigation params
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch categories for the store
  const fetchCategories = async () => {
    try {
      const token = await AsyncStorage.getItem('token'); // Retrieve the token
      const response = await axios.get(
        `http://192.168.1.13:6000/api/categories/${storeId}`, // Use the correct endpoint
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the headers
          },
        },
      );
      console.log('Categories:', response.data);
      setCategories(response.data); // Set the fetched categories
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError(error.response?.data?.message || 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories(); // Fetch categories when the screen loads
  }, []);

  // Show a loading spinner while fetching data
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // Show an error message if something went wrong
  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  // Render the list of categories
  return (
    <View style={styles.container}>
      <FlatList
        data={categories}
        keyExtractor={item => item._id}
        renderItem={({item}) => (
          <View style={styles.categoryItem}>
            <Text style={styles.categoryName}>{item.name}</Text>
            <Button
              title="Add Item"
              onPress={() =>
                navigation.navigate('ItemManagement', {
                  storeId,
                  categoryId: item._id, // Pass the category ID to the next screen
                })
              }
            />
          </View>
        )}
      />
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  categoryItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  categoryName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CategoryManagementScreen;
