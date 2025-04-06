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
      const response = await shopkeeperService.getAllOrders();

      if (response && Array.isArray(response.data)) {
        setOrders(response.data);
      } else {
        console.error('Invalid response:', response);
        Alert.alert('Error', 'Invalid data received from server');
      }
    } catch (error: any) {
      console.error('Fetch orders failed:', error.message || error);
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
  },
  button: {
    margin: 2,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default OrdersScreen;
