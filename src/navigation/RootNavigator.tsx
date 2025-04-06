import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {useAuth} from '../context/AuthContext';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import DashboardScreen from '../screens/DashboardScreen';
import CreateStoreScreen from '../screens/CreateStoreScreen';
import CreateCategoryScreen from '../screens/CreateCategoryScreen';
import CreateItemScreen from '../screens/CreateItemScreen';
import {ActivityIndicator, View} from 'react-native';
import OrdersScreen from '../screens/OrdersScreen';

const Stack = createStackNavigator();

const RootNavigator = () => {
  const {isAuthenticated, token, isLoading} = useAuth();
  console.log(
    `Auth State - isAuthenticated: ${isAuthenticated}, isLoading: ${isLoading}, token: ${token}`,
  );

  if (isLoading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isAuthenticated ? (
          <>
            <Stack.Screen
              name="Dashboard"
              component={DashboardScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="CreateStore"
              component={CreateStoreScreen}
              options={{ headerShown: true }}
            />
            <Stack.Screen
              name="CreateCategory"
              component={CreateCategoryScreen}
              options={{ headerShown: true }}
            />
            <Stack.Screen
              name="CreateItem"
              component={CreateItemScreen}
              options={{ headerShown: true }}
            />
            <Stack.Screen 
        name="Orders" 
        component={OrdersScreen} 
        options={{ title: 'All Orders' }}
      />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{ headerShown: false }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
