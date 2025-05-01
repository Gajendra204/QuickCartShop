import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

export type RootStackParamList = {
    Dashboard: undefined;
    Stores: undefined;
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
    CreateStore: undefined;
    CreateCategory: undefined;
    CreateItem: undefined;
    Orders: undefined;
    Login: undefined;
    Register: undefined;
    ForgotPassword: undefined;
  };

  export type MainTabParamList = {
    Dashboard: undefined;
    Stores: undefined;
    Orders: undefined;
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