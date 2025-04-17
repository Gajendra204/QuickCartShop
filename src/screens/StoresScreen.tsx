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
  Paragraph,
  ActivityIndicator,
  Button,
} from 'react-native-paper';
import {shopkeeperService} from '../services/api';
import {useNavigation} from '@react-navigation/native';

type Store = {
  _id: string;
  name: string;
  address: string;
  barcodeImage?: string;
};

const StoresScreen = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
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

    fetchStores();
  }, []);

  // const handleDeleteStore = async (storeId: string) => {
  //   Alert.alert(
  //     'Delete Store',
  //     'Are you sure you want to delete this store and all its contents?',
  //     [
  //       {text: 'Cancel', style: 'cancel'},
  //       {
  //         text: 'Delete',
  //         style: 'destructive',
  //         onPress: async () => {
  //           try {
  //             await shopkeeperService.deleteStore(storeId);
  //             setStores(stores.filter(store => store._id !== storeId));
  //           } catch (error) {
  //             Alert.alert('Error', 'Failed to delete store');
  //           }
  //         },
  //       },
  //     ],
  //   );
  // };

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

  // const renderStoreItem = ({item}: {item: Store}) => (
  //   <Card style={styles.card}>
  //     <Card.Content>
  //       <View style={styles.row}>
  //         <View style={styles.infoContainer}>
  //           <Title>{item.name}</Title>
  //           <Paragraph>{item.address}</Paragraph>
  //         </View>
  //         <Button
  //           mode="text"
  //           icon="delete"
  //           onPress={() => handleDeleteStore(item._id)}
  //           style={styles.deleteButton}
  //           textColor="#d32f2f">
  //           Delete
  //         </Button>
  //       </View>
  //     </Card.Content>
  //   </Card>
  // );

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
                <Title>{item.name}</Title>
                <Paragraph>{item.address}</Paragraph>
              </Card.Content>
            </Card>
          </TouchableOpacity>
        )}
      />
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
  // row: {
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   alignItems: 'center',
  // },
  // infoContainer: {
  //   flex: 1,
  // },
  // deleteButton: {
  //   alignSelf: 'flex-end',
  // },
});

export default StoresScreen;
