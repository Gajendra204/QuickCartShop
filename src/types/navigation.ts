import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  MainTabs: undefined;
  Categories: {
    storeId: string;
    storeName: string;
  };
  Items: {
    categoryId: string;
    categoryName: string;
    storeId: string;
    storeName: string;
  };
  CreateCategory: {
    storeId: string;
  };
  CreateItem: {
    categoryId: string;
  };
};

export type BottomTabParamList = {
  Home: undefined;
  Stores: undefined;
  AddStore: undefined;
  Orders: undefined;
  Profile: undefined;
};

// Type for useNavigation hook
export type RootStackNavigationProp<T extends keyof RootStackParamList> = StackNavigationProp<RootStackParamList, T>;

// Type for route.params
export type RootStackRouteProp<T extends keyof RootStackParamList> = RouteProp<RootStackParamList, T>;

// This helps with type checking the route names
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}