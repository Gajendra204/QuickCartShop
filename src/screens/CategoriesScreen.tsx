import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  Card,
  Title,
  ActivityIndicator,
  Button,
  Portal,
  Dialog,
  TextInput,
} from 'react-native-paper';
import {shopkeeperService} from '../services/api';
import {useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackNavigationProp, RootStackParamList} from '../types/navigation';
import {RootStackRouteProp} from '../types/navigation';

type CategoriesScreenProps = {
  route: RootStackRouteProp<'Categories'>;
  navigation: RootStackNavigationProp<'Categories'>;
};

type Category = {
  _id: string;
  name: string;
  store: string;
};

const CategoriesScreen = ({navigation, route}: CategoriesScreenProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editDialogVisible, setEditDialogVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editName, setEditName] = useState('');
  const {storeId, storeName} = route.params;

  useEffect(() => {
    fetchCategories();
  }, [storeId]);

  const fetchCategories = async () => {
    try {
      const response = await shopkeeperService.getCategoriesByStore(storeId);
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    Alert.alert(
      'Delete Category',
      'Are you sure you want to delete this category and all its items?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await shopkeeperService.deleteCategory(categoryId);
              setCategories(categories.filter(cat => cat._id !== categoryId));
              Alert.alert('Success', 'Category deleted successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete category');
            }
          },
        },
      ],
    );
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setEditName(category.name);
    setEditDialogVisible(true);
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory) return;

    try {
      await shopkeeperService.updateCategory(editingCategory._id, {
        name: editName,
        store: storeId,
      });

      setCategories(
        categories.map(category =>
          category._id === editingCategory._id
            ? {...category, name: editName}
            : category,
        ),
      );

      Alert.alert('Success', 'Category updated successfully');
      setEditDialogVisible(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to update category');
    }
  };

  const navigateToItems = (categoryId: string, categoryName: string) => {
    navigation.navigate('Items', {
      categoryId,
      categoryName,
      storeId,
      storeName,
    });
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Categories in {storeName}</Title>
      <FlatList
        data={categories}
        keyExtractor={item => item._id}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() => navigateToItems(item._id, item.name)}>
            <Card style={styles.card}>
              <Card.Content>
                <View style={styles.row}>
                  <View style={styles.infoContainer}>
                    <Title>{item.name}</Title>
                  </View>
                  <View style={styles.buttonContainer}>
                    <Button
                      icon="pencil"
                      mode="text"
                      onPress={() => handleEditCategory(item)}
                      style={styles.actionButton}>
                      Edit
                    </Button>
                    <Button
                      icon="delete"
                      mode="text"
                      onPress={() => handleDeleteCategory(item._id)}
                      style={styles.actionButton}
                      textColor="#d32f2f">
                      Delete
                    </Button>
                  </View>
                </View>
              </Card.Content>
            </Card>
          </TouchableOpacity>
        )}
      />

      <Portal>
        <Dialog
          visible={editDialogVisible}
          onDismiss={() => setEditDialogVisible(false)}>
          <Dialog.Title>Edit Category</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Category Name"
              value={editName}
              onChangeText={setEditName}
              style={styles.input}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setEditDialogVisible(false)}>Cancel</Button>
            <Button onPress={handleUpdateCategory}>Save</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    fontWeight: 'bold',
  },
  card: {
    marginBottom: 16,
    elevation: 3,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoContainer: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    marginLeft: 8,
  },
  input: {
    marginBottom: 10,
  },
});

export default CategoriesScreen;
