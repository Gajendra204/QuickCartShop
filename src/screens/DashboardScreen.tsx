import React, {useState, useEffect} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {
  Button,
  Card,
  Title,
  Text,
  Surface,
  Avatar,
  IconButton,
  useTheme,
  Portal,
  Modal,
} from 'react-native-paper';
import { useAuth } from '../app/providers/AuthContext';
import { shopkeeperService } from '../services/api';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface Order {
  _id: string;
  status: string;
  total: number;
  createdAt: string;
}

const DashboardScreen = ({navigation}: {navigation: any}) => {
  const {logout, userId} = useAuth();
  const theme = useTheme();
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    totalStores: 0,
    todayRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const [storesResponse, ordersResponse] = await Promise.all([
        shopkeeperService.getStores(),
        shopkeeperService.getAllOrders(),
      ]);

      const orders: Order[] = ordersResponse.data || [];
      const pendingOrders = orders.filter(
        (order: Order) => order.status === 'Pending',
      );
      const todayOrders = orders.filter((order: Order) => {
        const orderDate = new Date(order.createdAt).toDateString();
        const today = new Date().toDateString();
        return orderDate === today;
      });

      setStats({
        totalOrders: orders.length,
        pendingOrders: pendingOrders.length,
        totalStores: storesResponse.data.length,
        todayRevenue: todayOrders.reduce(
          (acc: number, order: Order) => acc + order.total,
          0,
        ),
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigation.reset({
        index: 0,
        routes: [{name: 'Login'}],
      });
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const StatCard = ({
    title,
    value,
    icon,
    color,
  }: {
    title: string;
    value: string | number;
    icon: string;
    color: string;
  }) => (
    <Surface style={[styles.statCard, {backgroundColor: color}]}>
      <MaterialCommunityIcons name={icon} size={24} color="#fff" />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </Surface>
  );

  const QuickAction = ({
    title,
    icon,
    onPress,
  }: {
    title: string;
    icon: string;
    onPress: () => void;
  }) => (
    <Button
      mode="contained"
      icon={icon}
      onPress={onPress}
      style={styles.quickActionButton}
      labelStyle={styles.quickActionLabel}>
      {title}
    </Button>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Title style={styles.welcomeTitle}>Welcome back!</Title>
          <Text style={styles.subtitle}>Here's your business overview</Text>
        </View>
        <IconButton
          icon="logout"
          size={24}
          onPress={() => setShowLogoutModal(true)}
        />
      </View>

      <View style={styles.statsGrid}>
        <StatCard
          title="Today's Orders"
          value={stats.totalOrders}
          icon="shopping"
          color={theme.colors.primary}
        />
        <StatCard
          title="Pending Orders"
          value={stats.pendingOrders}
          icon="clock-outline"
          color="#FF9800"
        />
        <StatCard
          title="Total Stores"
          value={stats.totalStores}
          icon="store"
          color="#4CAF50"
        />
        <StatCard
          title="Today's Revenue"
          value={`₹${stats.todayRevenue}`}
          icon="currency-inr"
          color="#2196F3"
        />
      </View>

      <Card style={styles.quickActionsCard}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Quick Actions</Title>
          <View style={styles.quickActions}>
            <QuickAction
              title="Add New Item"
              icon="plus-circle"
              onPress={() => navigation.navigate('CreateItem')}
            />
            <QuickAction
              title="View Orders"
              icon="clipboard-list"
              onPress={() => navigation.navigate('Orders')}
            />
            <QuickAction
              title="Manage Stores"
              icon="store"
              onPress={() => navigation.navigate('Stores')}
            />
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.recentActivityCard}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Recent Activity</Title>
          <Text>No recent activity to show</Text>
        </Card.Content>
      </Card>

      <Portal>
        <Modal
          visible={showLogoutModal}
          onDismiss={() => setShowLogoutModal(false)}
          contentContainerStyle={styles.logoutModal}>
          <Title>Logout</Title>
          <Text style={styles.logoutText}>
            Are you sure you want to logout?
          </Text>
          <View style={styles.modalButtons}>
            <Button
              mode="outlined"
              onPress={() => setShowLogoutModal(false)}
              style={styles.modalButton}>
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={handleLogout}
              style={styles.modalButton}>
              Logout
            </Button>
          </View>
        </Modal>
      </Portal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    elevation: 2,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    opacity: 0.7,
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    elevation: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginVertical: 5,
  },
  statTitle: {
    color: '#fff',
    opacity: 0.9,
  },
  quickActionsCard: {
    margin: 10,
    elevation: 2,
  },
  recentActivityCard: {
    margin: 10,
    marginTop: 0,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 15,
  },
  quickActions: {
    gap: 10,
  },
  quickActionButton: {
    marginBottom: 10,
  },
  quickActionLabel: {
    fontSize: 16,
  },
  logoutModal: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 10,
  },
  logoutText: {
    marginVertical: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  modalButton: {
    minWidth: 100,
  },
});

export default DashboardScreen;
