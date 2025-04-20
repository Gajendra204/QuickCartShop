import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Button, Card, Title} from 'react-native-paper';
import {useAuth} from '../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DashboardScreen = ({navigation}: any) => {
  const {logout} = useAuth();

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
  return (
    <View style={styles.container}>
      <Title style={styles.title}>Shopkeeper Dashboard</Title>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Manage Your Business</Title>
        </Card.Content>
      </Card>

      <Button
        mode="contained"
        onPress={() => navigation.navigate('Stores')}
        style={styles.button}>
        View All Stores
      </Button>

      <Button
        mode="contained"
        onPress={() => navigation.navigate('CreateStore')}
        style={styles.button}>
        Create New Store
      </Button>

      <Button
        mode="contained"
        onPress={() => navigation.navigate('CreateCategory')}
        style={styles.button}>
        Create Category
      </Button>

      <Button
        mode="contained"
        onPress={() => navigation.navigate('CreateItem')}
        style={styles.button}>
        Create Item
      </Button>

      <Button
        mode="contained"
        onPress={() => navigation.navigate('Orders')}
        style={styles.button}>
        View Orders
      </Button>

      <Button mode="outlined" onPress={handleLogout} style={styles.button}>
        Logout
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    marginBottom: 20,
  },
  button: {
    marginTop: 10,
  },
});

export default DashboardScreen;
