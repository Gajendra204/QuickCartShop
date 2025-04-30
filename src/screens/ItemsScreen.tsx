import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { Card, Title, Paragraph, ActivityIndicator, Button, Portal, Dialog, TextInput } from 'react-native-paper';
import { shopkeeperService } from '../services/api';
import { RootStackRouteProp, RootStackNavigationProp } from '../types/navigation';

type ItemsScreenProps = {
  route: RootStackRouteProp<'Items'>;
  navigation: RootStackNavigationProp<'Items'>;
};

type Item = {
  _id: string;
  name: string;
  description: string;
  mrp: number;
  discount: number;
  category: string;
  store: string;
  image?: string;
};

const ItemsScreen = ({ navigation, route }: ItemsScreenProps) => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [editDialogVisible, setEditDialogVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editMrp, setEditMrp] = useState('');
  const [editDiscount, setEditDiscount] = useState('');

  const { categoryId, categoryName, storeId, storeName } = route.params;

  useEffect(() => {
    fetchItems();
  }, [categoryId]);

  const fetchItems = async () => {
    try {
      const response = await shopkeeperService.getItemsByCategory(categoryId);
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this item?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await shopkeeperService.deleteItem(itemId);
              setItems(items.filter(item => item._id !== itemId));
              Alert.alert('Success', 'Item deleted successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete item');
            }
          },
        },
      ],
    );
  };

  const handleEditItem = (item: Item) => {
    setEditingItem(item);
    setEditName(item.name);
    setEditDescription(item.description);
    setEditMrp(item.mrp.toString());
    setEditDiscount(item.discount.toString());
    setEditDialogVisible(true);
  };

  const handleUpdateItem = async () => {
    if (!editingItem) return;

    try {
      const updatedItem = {
        name: editName,
        description: editDescription,
        mrp: parseFloat(editMrp),
        discount: parseFloat(editDiscount),
        category: categoryId,
        store: storeId,
      };

      await shopkeeperService.updateItem(editingItem._id, updatedItem);

      setItems(items.map(item =>
        item._id === editingItem._id
          ? { ...item, ...updatedItem }
          : item
      ));

      Alert.alert('Success', 'Item updated successfully');
      setEditDialogVisible(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to update item');
    }
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
      <Title style={styles.title}>
        Items in {categoryName} ({storeName})
      </Title>
      <FlatList
        data={items}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Content>
              <View style={styles.row}>
                <View style={styles.infoContainer}>
                  <Title>{item.name}</Title>
                  <Paragraph>{item.description}</Paragraph>
                  <Paragraph>
                    Price: ₹{item.mrp - item.discount}
                    (MRP: ₹{item.mrp}, Discount: ₹{item.discount})
                  </Paragraph>
                </View>
                <View style={styles.buttonContainer}>
                  <Button
                    icon="pencil"
                    mode="text"
                    onPress={() => handleEditItem(item)}
                    style={styles.actionButton}>
                    Edit
                  </Button>
                  <Button
                    icon="delete"
                    mode="text"
                    onPress={() => handleDeleteItem(item._id)}
                    style={styles.actionButton}
                    textColor="#d32f2f">
                    Delete
                  </Button>
                </View>
              </View>
            </Card.Content>
          </Card>
        )}
      />

      <Portal>
        <Dialog visible={editDialogVisible} onDismiss={() => setEditDialogVisible(false)}>
          <Dialog.Title>Edit Item</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Item Name"
              value={editName}
              onChangeText={setEditName}
              style={styles.input}
            />
            <TextInput
              label="Description"
              value={editDescription}
              onChangeText={setEditDescription}
              style={styles.input}
            />
            <TextInput
              label="MRP"
              value={editMrp}
              onChangeText={setEditMrp}
              keyboardType="numeric"
              style={styles.input}
            />
            <TextInput
              label="Discount"
              value={editDiscount}
              onChangeText={setEditDiscount}
              keyboardType="numeric"
              style={styles.input}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setEditDialogVisible(false)}>Cancel</Button>
            <Button onPress={handleUpdateItem}>Save</Button>
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
    alignItems: 'flex-start',
  },
  infoContainer: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  actionButton: {
    marginBottom: 4,
  },
  input: {
    marginBottom: 10,
  },
});

export default ItemsScreen;