import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Card, Title, Paragraph, ActivityIndicator } from 'react-native-paper';
import { shopkeeperService } from '../services/api';
import { useRoute } from '@react-navigation/native';
import { RootStackParamList, RootStackRouteProp } from '../types/navigation';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type ItemsScreenProps = {
  route: RootStackRouteProp<'Items'>;
};

type Item = {
  _id: string;
  name: string;
  description: string;
  mrp: number;
  discount: number;
  image?: string;
};

const ItemsScreen = ({ route }: ItemsScreenProps) =>{
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const { categoryId, categoryName, storeName } = route.params;

  useEffect(() => {
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

    fetchItems();
  }, [categoryId]);

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
              <Title>{item.name}</Title>
              <Paragraph>{item.description}</Paragraph>
              <Paragraph>
                Price: ₹{item.mrp - item.discount} 
                (MRP: ₹{item.mrp}, Discount: ₹{item.discount})
              </Paragraph>
              {item.image && (
                <Paragraph>Image: {item.image}</Paragraph>
              )}
            </Card.Content>
          </Card>
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
    fontSize: 18,
    marginBottom: 16,
    fontWeight: 'bold',
  },
  card: {
    marginBottom: 12,
    elevation: 2,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ItemsScreen;