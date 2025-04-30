import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  ActivityIndicator,
  Button,
  Portal,
  Dialog,
  TextInput,
} from 'react-native-paper';
import {shopkeeperService} from '../services/api';

type Store = {
  _id: string;
  name: string;
  address: string;
};

const StoresScreen = ({navigation}: any) => {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [editDialogVisible, setEditDialogVisible] = useState(false);
  const [editingStore, setEditingStore] = useState<Store | null>(null);
  const [editName, setEditName] = useState('');
  const [editAddress, setEditAddress] = useState('');

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      const response = await shopkeeperService.getStores();
      setStores(response.data);
    } catch (error) {
      console.error('Error fetching stores:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStore = async (storeId: string) => {
    Alert.alert(
      'Delete Store',
      'Are you sure you want to delete this store and all its contents?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await shopkeeperService.deleteStore(storeId);
              setStores(stores.filter(store => store._id !== storeId));
              Alert.alert('Success', 'Store deleted successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete store');
            }
          },
        },
      ],
    );
  };

  const handleEditStore = (store: Store) => {
    setEditingStore(store);
    setEditName(store.name);
    setEditAddress(store.address);
    setEditDialogVisible(true);
  };

  const handleUpdateStore = async () => {
    if (!editingStore) return;

    try {
      await shopkeeperService.updateStore(editingStore._id, {
        name: editName,
        address: editAddress,
      });

      setStores(
        stores.map(store =>
          store._id === editingStore._id
            ? {...store, name: editName, address: editAddress}
            : store,
        ),
      );

      Alert.alert('Success', 'Store updated successfully');
      setEditDialogVisible(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to update store');
    }
  };

  const navigateToCategories = (storeId: string, storeName: string) => {
    navigation.navigate('Categories', {storeId, storeName});
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
      <Title style={styles.title}>Your Stores</Title>
      <FlatList
        data={stores}
        keyExtractor={item => item._id}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() => navigateToCategories(item._id, item.name)}>
            <Card style={styles.card}>
              <Card.Content>
                <View style={styles.row}>
                  <View style={styles.infoContainer}>
                    <Title>{item.name}</Title>
                    <Paragraph>{item.address}</Paragraph>
                  </View>
                  <View style={styles.buttonContainer}>
                    <Button
                      icon="pencil"
                      mode="text"
                      onPress={() => handleEditStore(item)}
                      style={styles.actionButton}>
                      Edit
                    </Button>
                    <Button
                      icon="delete"
                      mode="text"
                      onPress={() => handleDeleteStore(item._id)}
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
          <Dialog.Title>Edit Store</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Store Name"
              value={editName}
              onChangeText={setEditName}
              style={styles.input}
            />
            <TextInput
              label="Address"
              value={editAddress}
              onChangeText={setEditAddress}
              style={styles.input}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setEditDialogVisible(false)}>Cancel</Button>
            <Button onPress={handleUpdateStore}>Save</Button>
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

export default StoresScreen;
