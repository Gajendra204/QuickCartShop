import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTheme} from 'react-native-paper';

import DashboardScreen from '../../screens/DashboardScreen';
import StoresScreen from '../../features/stores/screens/StoresScreen';
import CreateStoreScreen from '../../features/stores/screens/CreateStoreScreen';
import OrdersScreen from '../../features/orders/screens/OrdersScreen';
import ProfileScreen from '../../features/profile/screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  const theme = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: theme.colors.primary,
        headerShown: false,
      }}>
      <Tab.Screen
        name="Home"
        component={DashboardScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Stores"
        component={StoresScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons name="store" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="AddStore"
        component={CreateStoreScreen}
        options={{
          tabBarLabel: 'Add Store',
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons name="plus-box" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Orders"
        component={OrdersScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons
              name="clipboard-list"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons name="account" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
