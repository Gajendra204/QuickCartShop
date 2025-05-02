import React, {useState} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {
  Avatar,
  Title,
  Text,
  List,
  Switch,
  Button,
  Portal,
  Modal,
  Surface,
  useTheme,
} from 'react-native-paper';
import { useAuth } from '../../../app/providers/AuthContext';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const ProfileScreen = ({navigation}: any) => {
  const {logout, userId} = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const theme = useTheme();

  const handleLogout = async () => {
    try {
      await logout();
      navigation.reset({
        index: 0,
        routes: [{name: 'Login'}],
      });
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  return (
    <ScrollView style={styles.container}>
      <Surface style={styles.header}>
        <Avatar.Text
          size={80}
          label={getInitials('Shop Owner')}
          style={styles.avatar}
        />
        <Title style={styles.name}>Shop Owner</Title>
        <Text style={styles.email}>owner@example.com</Text>
      </Surface>

      <View style={styles.section}>
        <Title style={styles.sectionTitle}>Account</Title>
        <List.Item
          title="Personal Information"
          left={props => <List.Icon {...props} icon="account" />}
          right={props => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => {}}
        />
        <List.Item
          title="Change Password"
          left={props => <List.Icon {...props} icon="lock" />}
          right={props => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => {}}
        />
        <List.Item
          title="Notifications"
          left={props => <List.Icon {...props} icon="bell" />}
          right={() => (
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
            />
          )}
        />
      </View>

      <View style={styles.section}>
        <Title style={styles.sectionTitle}>Business</Title>
        <List.Item
          title="Subscription Status"
          description="Free Plan"
          left={props => <List.Icon {...props} icon="star" />}
          right={props => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => {}}
        />
        <List.Item
          title="Payment Methods"
          left={props => <List.Icon {...props} icon="credit-card" />}
          right={props => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => {}}
        />
        <List.Item
          title="Business Documents"
          left={props => <List.Icon {...props} icon="file-document" />}
          right={props => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => {}}
        />
      </View>

      <View style={styles.section}>
        <Title style={styles.sectionTitle}>Support</Title>
        <List.Item
          title="Help Center"
          left={props => <List.Icon {...props} icon="help-circle" />}
          right={props => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => {}}
        />
        <List.Item
          title="Contact Support"
          left={props => <List.Icon {...props} icon="message" />}
          right={props => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => {}}
        />
        <List.Item
          title="App Feedback"
          left={props => <List.Icon {...props} icon="star" />}
          right={props => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => {}}
        />
      </View>

      <Button
        mode="outlined"
        onPress={() => setShowLogoutModal(true)}
        style={styles.logoutButton}
        icon="logout">
        Logout
      </Button>

      <Portal>
        <Modal
          visible={showLogoutModal}
          onDismiss={() => setShowLogoutModal(false)}
          contentContainerStyle={styles.logoutModal}>
          <Title>Logout</Title>
          <Text style={styles.logoutText}>
            Are you sure you want to logout?
          </Text>
          <View style={styles.modalButtons}>
            <Button
              mode="outlined"
              onPress={() => setShowLogoutModal(false)}
              style={styles.modalButton}>
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={handleLogout}
              style={styles.modalButton}>
              Logout
            </Button>
          </View>
        </Modal>
      </Portal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    alignItems: 'center',
    elevation: 2,
  },
  avatar: {
    marginBottom: 10,
  },
  name: {
    fontSize: 24,
    marginBottom: 4,
  },
  email: {
    opacity: 0.7,
  },
  section: {
    marginTop: 20,
    backgroundColor: '#fff',
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 16,
    marginLeft: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  logoutButton: {
    margin: 16,
    marginTop: 32,
  },
  logoutModal: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 10,
  },
  logoutText: {
    marginVertical: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  modalButton: {
    minWidth: 100,
  },
});

export default ProfileScreen;
