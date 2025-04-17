import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Card, Title, Paragraph, ActivityIndicator } from 'react-native-paper';
import { shopkeeperService } from '../services/api';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackNavigationProp, RootStackParamList } from '../types/navigation';
import { RootStackRouteProp } from '../types/navigation';


type CategoriesScreenProps = {
  route: RootStackRouteProp<'Categories'>;
  navigation: RootStackNavigationProp<'Categories'>;
};


type Category = {
  _id: string;
  name: string;
  store: string;
};

const CategoriesScreen = ({ navigation, route }: CategoriesScreenProps) =>{
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const { storeId, storeName } = route.params;

  useEffect(() => {
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

    fetchCategories();
  }, [storeId]);

  const navigateToItems = (categoryId: string, categoryName: string) => {
    navigation.navigate('Items', { 
      categoryId, 
      categoryName,
      storeId,
      storeName 
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
      <Title style={styles.title}>
        Categories in {storeName}
      </Title>
      <FlatList
        data={categories}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigateToItems(item._id, item.name)}>
            <Card style={styles.card}>
              <Card.Content>
                <Title>{item.name}</Title>
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
    fontSize: 20,
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

export default CategoriesScreen;