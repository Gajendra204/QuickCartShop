import React, {useState} from 'react';
import {View, StyleSheet, Alert} from 'react-native';
import {Button, TextInput, Title} from 'react-native-paper';
import {shopkeeperService} from '../../../services/api';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../../types/navigation';

type ForgotPasswordScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'ForgotPassword'
>;

const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({
  navigation,
}) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!email || !email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      await shopkeeperService.forgotPassword({
        email: email,
      });

      Alert.alert(
        'Success',
        'If an account exists with this email, you will receive password reset instructions.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Login'),
          },
        ],
      );
    } catch (error: any) {
      // Use a generic message for security
      Alert.alert(
        'Notice',
        'If an account exists with this email, you will receive password reset instructions.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Reset Password</Title>

      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />

      <Button
        mode="contained"
        onPress={handleResetPassword}
        loading={loading}
        style={styles.button}>
        Reset Password
      </Button>

      <Button
        mode="text"
        onPress={() => navigation.navigate('Login')}
        style={styles.button}>
        Back to Login
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
});

export default ForgotPasswordScreen;
