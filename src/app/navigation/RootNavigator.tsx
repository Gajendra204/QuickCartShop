import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {useAuth} from '../providers/AuthContext';
import LoginScreen from '../../features/auth/screens/LoginScreen';
import RegisterScreen from '../../features/auth/screens/RegisterScreen';
import ForgotPasswordScreen from '../../features/auth/screens/ForgotPasswordScreen';
import CategoriesScreen from '../../features/categories/screens/CategoriesScreen';
import CreateCategoryScreen from '../../features/categories/screens/CreateCategoryScreen';
import CreateItemScreen from '../../features/items/screens/CreateItemScreen';
import ItemsScreen from '../../features/items/screens/ItemsScreen';
import {ActivityIndicator, View} from 'react-native';
import {RootStackParamList} from '../../types/navigation';
import BottomTabNavigator from './BottomTabNavigator';

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
              name="MainTabs"
              component={BottomTabNavigator}
              options={{headerShown: false}}
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
              name="CreateCategory"
              component={CreateCategoryScreen}
              options={{title: 'Create New Category'}}
            />
            <Stack.Screen
              name="CreateItem"
              component={CreateItemScreen}
              options={{title: 'Create New Item'}}
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
