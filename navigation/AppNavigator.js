import {createStackNavigator} from '@react-navigation/stack';
import RegistrationScreen from '../Screens/RegistrationScreen';
import LoginScreen from '../Screens/LoginScreen';
import StoreCreationScreen from '../Screens/StoreCreationScreen';
import CategoryManagementScreen from '../Screens/CategoryManagementScreen';
import ItemManagementScreen from '../Screens/ItemManagementScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Registration">
      <Stack.Screen name="Registration" component={RegistrationScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="StoreCreation" component={StoreCreationScreen} />
      <Stack.Screen
        name="CategoryManagement"
        component={CategoryManagementScreen}
      />
      <Stack.Screen name="ItemManagement" component={ItemManagementScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
