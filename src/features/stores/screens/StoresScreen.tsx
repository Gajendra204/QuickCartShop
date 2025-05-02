import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Alert,
  TouchableOpacity,
  Dimensions,
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
  Searchbar,
  IconButton,
  Badge,
  FAB,
  useTheme,
  Surface,
} from 'react-native-paper';
import { shopkeeperService } from '../../../services/api';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

type Store = {
  _id: string;
  name: string;
  address: string;
  isOpen?: boolean;
};

const StoresScreen = ({navigation}: any) => {
  const [stores, setStores] = useState<Store[]>([]);
  const [filteredStores, setFilteredStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isGridView, setIsGridView] = useState(true);
  const [editDialogVisible, setEditDialogVisible] = useState(false);
  const [editingStore, setEditingStore] = useState<Store | null>(null);
  const [editName, setEditName] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const theme = useTheme();

  useEffect(() => {
    fetchStores();
  }, []);

  useEffect(() => {
    const filtered = stores.filter(
      store =>
        store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        store.address.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    setFilteredStores(filtered);
  }, [searchQuery, stores]);

  const fetchStores = async () => {
    try {
      const response = await shopkeeperService.getStores();
      // Add isOpen property randomly for demo purposes
      const storesWithStatus = response.data.map((store: Store) => ({
        ...store,
        isOpen: Math.random() > 0.5,
      }));
      setStores(storesWithStatus);
      setFilteredStores(storesWithStatus);
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

  const renderGridItem = ({item}: {item: Store}) => (
    <TouchableOpacity
      style={styles.gridItem}
      onPress={() => navigateToCategories(item._id, item.name)}>
      <Surface style={styles.gridCard}>
        <View style={styles.storeIconContainer}>
          <MaterialCommunityIcons
            name="store"
            size={40}
            color={theme.colors.primary}
          />
          <Badge
            style={[
              styles.statusBadge,
              {backgroundColor: item.isOpen ? '#4CAF50' : '#FF5252'},
            ]}>
            {item.isOpen ? 'Open' : 'Closed'}
          </Badge>
        </View>
        <Title style={styles.gridTitle}>{item.name}</Title>
        <Paragraph numberOfLines={2} style={styles.gridAddress}>
          {item.address}
        </Paragraph>
        <View style={styles.gridActions}>
          <IconButton
            icon="pencil"
            size={20}
            onPress={() => handleEditStore(item)}
          />
          <IconButton
            icon="delete"
            size={20}
            iconColor="#d32f2f"
            onPress={() => handleDeleteStore(item._id)}
          />
        </View>
      </Surface>
    </TouchableOpacity>
  );

  const renderListItem = ({item}: {item: Store}) => (
    <TouchableOpacity onPress={() => navigateToCategories(item._id, item.name)}>
      <Card style={styles.listCard}>
        <Card.Content>
          <View style={styles.row}>
            <View style={styles.infoContainer}>
              <View style={styles.titleRow}>
                <Title>{item.name}</Title>
                <Badge
                  style={[
                    styles.statusBadge,
                    {backgroundColor: item.isOpen ? '#4CAF50' : '#FF5252'},
                  ]}>
                  {item.isOpen ? 'Open' : 'Closed'}
                </Badge>
              </View>
              <Paragraph>{item.address}</Paragraph>
            </View>
            <View style={styles.buttonContainer}>
              <IconButton
                icon="pencil"
                size={20}
                onPress={() => handleEditStore(item)}
              />
              <IconButton
                icon="delete"
                size={20}
                iconColor="#d32f2f"
                onPress={() => handleDeleteStore(item._id)}
              />
            </View>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Searchbar
          placeholder="Search stores..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />
        <IconButton
          icon={isGridView ? 'view-list' : 'view-grid'}
          size={24}
          onPress={() => setIsGridView(!isGridView)}
        />
      </View>

      <FlatList
        data={filteredStores}
        keyExtractor={item => item._id}
        renderItem={isGridView ? renderGridItem : renderListItem}
        numColumns={isGridView ? 2 : 1}
        key={isGridView ? 'grid' : 'list'}
        contentContainerStyle={styles.listContainer}
      />

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('CreateStore')}
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
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    elevation: 2,
  },
  searchBar: {
    flex: 1,
    marginRight: 8,
  },
  listContainer: {
    padding: 8,
  },
  gridItem: {
    width: '50%',
    padding: 8,
  },
  gridCard: {
    padding: 16,
    elevation: 2,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  gridTitle: {
    fontSize: 16,
    marginTop: 8,
  },
  gridAddress: {
    fontSize: 12,
  },
  gridActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  storeIconContainer: {
    alignItems: 'center',
    position: 'relative',
  },
  listCard: {
    marginBottom: 8,
    elevation: 2,
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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoContainer: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    marginBottom: 10,
  },
  statusBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
});

export default StoresScreen;
