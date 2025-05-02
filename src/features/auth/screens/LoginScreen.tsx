import React, {useState} from 'react';
import {View, StyleSheet, Alert} from 'react-native';
import {Button, TextInput, Title} from 'react-native-paper';
import {useAuth} from '../../../app/providers/AuthContext';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../../types/navigation';

type LoginScreenProps = NativeStackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen: React.FC<LoginScreenProps> = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const {login} = useAuth();

  const handleLogin = async () => {
    if (!email || !email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    if (!password) {
      Alert.alert('Error', 'Please enter your password');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Login to QuickCart</Title>

      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />

      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <Button
        mode="text"
        onPress={() => navigation.navigate('ForgotPassword')}
        style={styles.forgotPasswordButton}>
        Forgot Password?
      </Button>

      <Button
        mode="contained"
        onPress={handleLogin}
        loading={loading}
        style={styles.button}>
        Login
      </Button>

      <Button
        mode="text"
        onPress={() => navigation.navigate('Register')}
        style={styles.button}>
        Don't have an account? Register
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 4,
  },
  button: {
    marginTop: 20,
  },
  forgotPasswordButton: {
    marginTop: 8,
    alignSelf: 'flex-end',
  },
});

export default LoginScreen;
