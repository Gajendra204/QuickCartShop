// src/screens/OrdersScreen.tsx
import React, {useEffect, useState} from 'react';
import {View, StyleSheet, FlatList, Alert, ScrollView} from 'react-native';
import {
  Button,
  Card,
  Title,
  Paragraph,
  ActivityIndicator,
  Chip,
  Searchbar,
  Text,
  Badge,
  Surface,
  Menu,
  IconButton,
  Portal,
  Dialog,
  useTheme,
} from 'react-native-paper';
import { shopkeeperService } from '../../../services/api';
import { Order } from '../../../types/order';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const ORDER_STATUSES = [
  'All',
  'Pending',
  'Processing',
  'Completed',
  'Cancelled',
];

const OrdersScreen = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortMenuVisible, setSortMenuVisible] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [statusUpdateDialog, setStatusUpdateDialog] = useState<{
    visible: boolean;
    order?: Order;
  }>({visible: false});
  const theme = useTheme();

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [selectedStatus, searchQuery, sortBy, orders]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await shopkeeperService.getAllOrders();
      if (response?.data) {
        setOrders(response.data);
      }
    } catch (error: any) {
      console.error('Fetch orders error:', error);
      Alert.alert('Error', 'Failed to fetch orders');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filterOrders = () => {
    let filtered = [...orders];

    // Filter by status
    if (selectedStatus !== 'All') {
      filtered = filtered.filter(order => order.status === selectedStatus);
    }

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        order =>
          order._id.toLowerCase().includes(query) ||
          order.mobile.toLowerCase().includes(query) ||
          order.items.some(item =>
            item.item.name.toLowerCase().includes(query),
          ),
      );
    }

    // Sort orders
    filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      if (sortBy === 'newest') return dateB - dateA;
      if (sortBy === 'oldest') return dateA - dateB;
      return 0;
    });

    setFilteredOrders(filtered);
  };

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      await shopkeeperService.updateOrderStatus(orderId, newStatus);
      await fetchOrders();
      Alert.alert('Success', 'Order status updated');
      setStatusUpdateDialog({visible: false});
    } catch (error) {
      Alert.alert('Error', 'Failed to update order status');
      console.error(error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return '#FF9800';
      case 'Processing':
        return '#2196F3';
      case 'Completed':
        return '#4CAF50';
      case 'Cancelled':
        return '#F44336';
      default:
        return theme.colors.primary;
    }
  };

  const calculateTotal = (items: any[]) => {
    return items.reduce(
      (sum, item) => sum + (item.item.mrp - item.item.discount) * item.quantity,
      0,
    );
  };

  const renderOrderItem = ({item}: {item: Order}) => (
    <Surface style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <View>
          <Title style={styles.orderId}>Order #{item._id.slice(-6)}</Title>
          <Text style={styles.orderDate}>
            {new Date(item.createdAt).toLocaleString()}
          </Text>
        </View>
        <Badge
          style={[
            styles.statusBadge,
            {backgroundColor: getStatusColor(item.status)},
          ]}>
          {item.status}
        </Badge>
      </View>

      <View style={styles.customerInfo}>
        <MaterialCommunityIcons name="phone" size={16} />
        <Text style={styles.customerPhone}>{item.mobile}</Text>
      </View>

      <View style={styles.itemsList}>
        {item.items.map((orderItem, index) => (
          <View key={index} style={styles.orderItem}>
            <Text style={styles.itemName}>{orderItem.item.name}</Text>
            <Text style={styles.itemQuantity}>×{orderItem.quantity}</Text>
            <Text style={styles.itemPrice}>
              ₹{orderItem.item.mrp - orderItem.item.discount}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.orderFooter}>
        <Text style={styles.totalAmount}>
          Total: ₹{calculateTotal(item.items)}
        </Text>
        <Button
          mode="contained"
          onPress={() => setStatusUpdateDialog({visible: true, order: item})}
          style={styles.updateButton}>
          Update Status
        </Button>
      </View>
    </Surface>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Searchbar
        placeholder="Search orders..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />

      <View style={styles.filterRow}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.statusFilters}>
          {ORDER_STATUSES.map(status => (
            <Chip
              key={status}
              selected={selectedStatus === status}
              onPress={() => setSelectedStatus(status)}
              style={[
                styles.statusChip,
                selectedStatus === status && {
                  backgroundColor: getStatusColor(status),
                },
              ]}
              textStyle={
                selectedStatus === status ? styles.selectedChipText : {}
              }>
              {status}
            </Chip>
          ))}
        </ScrollView>

        <Menu
          visible={sortMenuVisible}
          onDismiss={() => setSortMenuVisible(false)}
          anchor={
            <IconButton
              icon="sort"
              size={24}
              onPress={() => setSortMenuVisible(true)}
            />
          }>
          <Menu.Item
            onPress={() => {
              setSortBy('newest');
              setSortMenuVisible(false);
            }}
            title="Newest First"
            leadingIcon="sort-calendar-descending"
          />
          <Menu.Item
            onPress={() => {
              setSortBy('oldest');
              setSortMenuVisible(false);
            }}
            title="Oldest First"
            leadingIcon="sort-calendar-ascending"
          />
        </Menu>
      </View>
    </View>
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
      {renderHeader()}

      {filteredOrders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons
            name="clipboard-text-outline"
            size={64}
            color={theme.colors.primary}
          />
          <Title style={styles.emptyTitle}>No Orders Found</Title>
          <Text style={styles.emptyText}>
            {searchQuery
              ? 'Try changing your search or filters'
              : 'Your orders will appear here'}
          </Text>
          <Button
            mode="contained"
            onPress={fetchOrders}
            style={styles.refreshButton}>
            Refresh Orders
          </Button>
        </View>
      ) : (
        <FlatList
          data={filteredOrders}
          renderItem={renderOrderItem}
          keyExtractor={item => item._id}
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            fetchOrders();
          }}
          contentContainerStyle={styles.ordersList}
        />
      )}

      <Portal>
        <Dialog
          visible={statusUpdateDialog.visible}
          onDismiss={() => setStatusUpdateDialog({visible: false})}>
          <Dialog.Title>Update Order Status</Dialog.Title>
          <Dialog.Content>
            <View style={styles.statusButtons}>
              {ORDER_STATUSES.filter(status => status !== 'All').map(status => (
                <Button
                  key={status}
                  mode={
                    statusUpdateDialog.order?.status === status
                      ? 'contained'
                      : 'outlined'
                  }
                  onPress={() =>
                    statusUpdateDialog.order &&
                    handleUpdateStatus(statusUpdateDialog.order._id, status)
                  }
                  style={[
                    styles.statusButton,
                    {
                      backgroundColor:
                        statusUpdateDialog.order?.status === status
                          ? getStatusColor(status)
                          : 'transparent',
                    },
                  ]}>
                  {status}
                </Button>
              ))}
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setStatusUpdateDialog({visible: false})}>
              Cancel
            </Button>
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
    backgroundColor: '#fff',
    padding: 16,
    elevation: 2,
  },
  searchBar: {
    marginBottom: 12,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusFilters: {
    flexGrow: 1,
  },
  statusChip: {
    marginRight: 8,
  },
  selectedChipText: {
    color: '#fff',
  },
  ordersList: {
    padding: 16,
  },
  orderCard: {
    marginBottom: 16,
    borderRadius: 8,
    elevation: 2,
    padding: 16,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  orderId: {
    fontSize: 18,
  },
  orderDate: {
    fontSize: 12,
    opacity: 0.7,
  },
  statusBadge: {
    paddingHorizontal: 8,
  },
  customerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  customerPhone: {
    marginLeft: 8,
  },
  itemsList: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemName: {
    flex: 1,
  },
  itemQuantity: {
    marginHorizontal: 16,
  },
  itemPrice: {
    fontWeight: 'bold',
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  updateButton: {
    borderRadius: 20,
  },
  statusButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  statusButton: {
    margin: 4,
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
  emptyTitle: {
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    textAlign: 'center',
    marginBottom: 24,
    opacity: 0.7,
  },
  refreshButton: {
    borderRadius: 20,
  },
});

export default OrdersScreen;
