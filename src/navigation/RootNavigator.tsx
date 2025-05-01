import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {useAuth} from '../context/AuthContext';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import DashboardScreen from '../screens/DashboardScreen';
import CreateStoreScreen from '../screens/CreateStoreScreen';
import CreateCategoryScreen from '../screens/CreateCategoryScreen';
import CreateItemScreen from '../screens/CreateItemScreen';
import OrdersScreen from '../screens/OrdersScreen';
import StoresScreen from '../screens/StoresScreen';
import CategoriesScreen from '../screens/CategoriesScreen';
import ItemsScreen from '../screens/ItemsScreen';
import {ActivityIndicator, View} from 'react-native';
import {RootStackParamList} from '../types/navigation';

const Stack = createStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  const {isAuthenticated, isLoading} = useAuth();

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
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Stores"
              component={StoresScreen}
              options={{title: 'Your Stores'}}
            />
            <Stack.Screen
              name="Categories"
              component={CategoriesScreen}
              options={({route}) => ({
                title: `Categories in ${route.params.storeName}`,
              })}
            />
            <Stack.Screen
              name="Items"
              component={ItemsScreen}
              options={({route}) => ({
                title: `${route.params.categoryName} Items`,
              })}
            />
            <Stack.Screen
              name="CreateStore"
              component={CreateStoreScreen}
              options={{title: 'Create New Store'}}
            />
            <Stack.Screen
              name="CreateCategory"
              component={CreateCategoryScreen}
              options={{title: 'Create New Category'}}
            />
            <Stack.Screen
              name="CreateItem"
              component={CreateItemScreen}
              options={{title: 'Create New Item'}}
            />
            <Stack.Screen
              name="Orders"
              component={OrdersScreen}
              options={{title: 'All Orders'}}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="ForgotPassword"
              component={ForgotPasswordScreen}
              options={{headerShown: false}}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
