import React, {useEffect} from 'react';
import {ActivityIndicator, View} from 'react-native';
import {useAuth} from '../context/AuthContext';
import {useNavigation} from '@react-navigation/native';
import {RootStackNavigationProp} from '../types/navigation';

const ProtectedRoute = ({children}: {children: React.ReactNode}) => {
  const {token, isLoading} = useAuth();
  const navigation = useNavigation<RootStackNavigationProp<'Login'>>();

  useEffect(() => {
    if (!isLoading && !token) {
      navigation.reset({
        index: 0,
        routes: [{name: 'Login'}],
      });
    }
  }, [isLoading, token, navigation]);

  if (isLoading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!token) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
