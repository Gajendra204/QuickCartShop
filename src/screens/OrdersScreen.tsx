// src/screens/OrdersScreen.tsx
import React, {useEffect, useState} from 'react';
import {View, StyleSheet, FlatList, Alert} from 'react-native';
import {
  Button,
  Card,
  Title,
  Paragraph,
  ActivityIndicator,
} from 'react-native-paper';
import {shopkeeperService} from '../services/api';
import {Order} from '../types/order';
import { useAuth } from '../context/AuthContext';

const OrdersScreen = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  //   const fetchOrders = async () => {
  //     try {
  //       const response = await shopkeeperService.getAllOrders();
  //       setOrders(response.data);
  //     } catch (error) {
  //       Alert.alert('Error', 'Failed to fetch orders');
  //       console.error(error);
  //     } finally {
  //       setLoading(false);
  //       setRefreshing(false);
  //     }
  //   };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      console.log('Fetching orders...'); // Debug log
      
      const response = await shopkeeperService.getAllOrders();
      console.log('Raw API Response:', JSON.stringify(response, null, 2)); // Full response
      
      if (!response) {
        console.error('No response received from API');
        Alert.alert('Error', 'No response from server');
        return;
      }
  
      if (!response.data) {
        console.error('Response missing data property:', response);
        Alert.alert('Error', 'Invalid response format');
        return;
      }
  
      if (Array.isArray(response.data)) {
        console.log('Number of orders received:', response.data.length);
        setOrders(response.data);
      } else {
        console.error('Response data is not an array:', typeof response.data);
        Alert.alert('Error', 'Invalid data format received');
      }
    } catch (error: any) {
      console.error('Fetch orders error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        stack: error.stack
      });
      Alert.alert('Error', 'Failed to fetch orders');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      await shopkeeperService.updateOrderStatus(orderId, newStatus);
      await fetchOrders(); // Refresh orders after update
      Alert.alert('Success', 'Order status updated');
    } catch (error) {
      Alert.alert('Error', 'Failed to update order status');
      console.error(error);
    }
  };

  const renderOrderItem = ({item}: {item: Order}) => (
    <Card style={styles.card}>
      <Card.Content>
        <Title>Order #{item._id.slice(-6)}</Title>
        <Paragraph>Mobile: {item.mobile}</Paragraph>
        <Paragraph>Status: {item.status}</Paragraph>
        <Paragraph>Date: {new Date(item.createdAt).toLocaleString()}</Paragraph>

        <Title style={styles.itemsTitle}>Items:</Title>
        {item.items.map((orderItem, index) => (
          <Paragraph key={index}>
            {orderItem.item.name} - {orderItem.quantity} × ₹
            {orderItem.item.mrp - orderItem.item.discount}
          </Paragraph>
        ))}

        <View style={styles.statusButtons}>
          <Button
            mode={item.status === 'Pending' ? 'contained' : 'outlined'}
            onPress={() => handleUpdateStatus(item._id, 'Pending')}
            style={styles.button}>
            Pending
          </Button>
          <Button
            mode={item.status === 'Processing' ? 'contained' : 'outlined'}
            onPress={() => handleUpdateStatus(item._id, 'Processing')}
            style={styles.button}>
            Processing
          </Button>
          <Button
            mode={item.status === 'Completed' ? 'contained' : 'outlined'}
            onPress={() => handleUpdateStatus(item._id, 'Completed')}
            style={styles.button}>
            Complete
          </Button>
          <Button
            mode={item.status === 'Cancelled' ? 'contained' : 'outlined'}
            onPress={() => handleUpdateStatus(item._id, 'Cancelled')}
            style={styles.button}>
            Cancelled
          </Button>
        </View>
      </Card.Content>
    </Card>
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
      {orders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Title>No Orders Found</Title>
          <Button 
            mode="contained" 
            onPress={fetchOrders}
            style={styles.refreshButton}
          >
            Refresh Orders
          </Button>
        </View>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrderItem}
          keyExtractor={item => item._id}
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            fetchOrders();
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  card: {
    marginBottom: 15,
  },
  itemsTitle: {
    marginTop: 10,
    fontSize: 16,
  },
  statusButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    flexWrap: 'wrap',
  },
  button: {
    margin: 5,
    flexGrow: 1,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  refreshButton: {
    marginTop: 20,
  },
});

export default OrdersScreen;
