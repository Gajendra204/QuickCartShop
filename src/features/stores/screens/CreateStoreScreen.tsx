import React, {useState} from 'react';
import {View, StyleSheet, ScrollView, Alert} from 'react-native';
import {
  Button,
  TextInput,
  Title,
  Surface,
  Text,
  ProgressBar,
  useTheme,
} from 'react-native-paper';
import { shopkeeperService } from '../../../services/api';
import { useAuth } from '../../../app/providers/AuthContext';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const CreateStoreScreen = ({navigation}: any) => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
  });
  const [loading, setLoading] = useState(false);
  const {userId} = useAuth();
  const theme = useTheme();

  const getProgress = () => {
    let progress = 0;
    if (formData.name) progress += 0.5;
    if (formData.address) progress += 0.5;
    return progress;
  };

  const handleInputChange = (field: string) => (value: string) => {
    setFormData(prev => ({...prev, [field]: value}));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Please enter a store name');
      return false;
    }
    if (!formData.address.trim()) {
      Alert.alert('Error', 'Please enter a store address');
      return false;
    }
    return true;
  };

  const handleCreateStore = async () => {
    if (!validateForm()) return;
    if (!userId) {
      Alert.alert('Error', 'User ID not found. Please log in again.');
      return;
    }

    setLoading(true);
    try {
      const response = await shopkeeperService.createStore({
        name: formData.name,
        address: formData.address,
        shopkeeper: {id: userId},
      });

      Alert.alert('Success', 'Store created successfully!', [
        {
          text: 'Add Categories',
          onPress: () =>
            navigation.navigate('CreateCategory', {
              storeId: response.data._id,
            }),
        },
      ]);
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to create store',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Surface style={styles.formContainer}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons
            name="store-plus"
            size={48}
            color={theme.colors.primary}
          />
        </View>

        <Title style={styles.title}>Create New Store</Title>
        <Text style={styles.subtitle}>
          Fill in the details to set up your new store
        </Text>

        <View style={styles.progressContainer}>
          <ProgressBar progress={getProgress()} style={styles.progressBar} />
          <Text style={styles.progressText}>
            {Math.round(getProgress() * 100)}% Complete
          </Text>
        </View>

        <TextInput
          label="Store Name"
          value={formData.name}
          onChangeText={handleInputChange('name')}
          style={styles.input}
          mode="outlined"
          left={<TextInput.Icon icon="store" />}
        />

        <TextInput
          label="Store Address"
          value={formData.address}
          onChangeText={handleInputChange('address')}
          style={styles.input}
          mode="outlined"
          multiline
          numberOfLines={3}
          left={<TextInput.Icon icon="map-marker" />}
        />

        <Button
          mode="contained"
          onPress={handleCreateStore}
          loading={loading}
          style={styles.button}
          contentStyle={styles.buttonContent}>
          Create Store
        </Button>

        <Button
          mode="outlined"
          onPress={() => navigation.goBack()}
          style={styles.cancelButton}>
          Cancel
        </Button>
      </Surface>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  formContainer: {
    margin: 16,
    padding: 16,
    borderRadius: 8,
    elevation: 4,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 24,
    opacity: 0.7,
  },
  progressContainer: {
    marginBottom: 24,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  progressText: {
    textAlign: 'center',
    marginTop: 8,
    fontSize: 12,
    opacity: 0.7,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
  buttonContent: {
    height: 48,
  },
  cancelButton: {
    marginTop: 12,
  },
});

export default CreateStoreScreen;
