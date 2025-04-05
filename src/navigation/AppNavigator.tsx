import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import DashboardScreen from '../screens/DashboardScreen';
import CreateStoreScreen from '../screens/CreateStoreScreen';
import CreateCategoryScreen from '../screens/CreateCategoryScreen';
import CreateItemScreen from '../screens/CreateItemScreen';
import ProtectedRoute from './ProtectedRoute';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Dashboard">
          {() => (
            <ProtectedRoute>
              <DashboardScreen />
            </ProtectedRoute>
          )}
        </Stack.Screen>
        <Stack.Screen name="CreateStore">
          {() => (
            <ProtectedRoute>
              <CreateStoreScreen />
            </ProtectedRoute>
          )}
        </Stack.Screen>
        <Stack.Screen name="CreateCategory">
          {() => (
            <ProtectedRoute>
              <CreateCategoryScreen />
            </ProtectedRoute>
          )}
        </Stack.Screen>
        <Stack.Screen name="CreateItem">
          {() => (
            <ProtectedRoute>
              <CreateItemScreen />
            </ProtectedRoute>
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;