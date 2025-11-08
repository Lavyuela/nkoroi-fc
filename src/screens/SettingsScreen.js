import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Card, List, Divider, Appbar, TextInput, Button, Switch, Chip } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingsScreen = ({ navigation, route }) => {
  const { isAdmin } = useAuth();
  const { isDarkMode, setIsDarkMode } = route.params || {};
  const [adminEmails, setAdminEmails] = useState([]);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAdminList();
  }, []);

  const loadAdminList = async () => {
    try {
      const adminUsers = await AsyncStorage.getItem('adminUsers');
      const admins = adminUsers ? JSON.parse(adminUsers) : [];
      setAdminEmails(admins);
    } catch (error) {
      console.log('Error loading admin list:', error);
    }
  };

  const addAdmin = async () => {
    if (!newAdminEmail.trim()) {
      Alert.alert('Error', 'Please enter an email address');
      return;
    }

    if (!newAdminEmail.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    if (adminEmails.includes(newAdminEmail.toLowerCase())) {
      Alert.alert('Info', 'This user is already an admin');
      return;
    }

    setLoading(true);
    try {
      const updatedAdmins = [...adminEmails, newAdminEmail.toLowerCase()];
      await AsyncStorage.setItem('adminUsers', JSON.stringify(updatedAdmins));
      setAdminEmails(updatedAdmins);
      setNewAdminEmail('');
      Alert.alert('Success', `${newAdminEmail} has been granted admin privileges`);
    } catch (error) {
      Alert.alert('Error', 'Failed to add admin');
    } finally {
      setLoading(false);
    }
  };

  const removeAdmin = async (email) => {
    if (adminEmails.length === 1) {
      Alert.alert('Error', 'Cannot remove the last admin. There must be at least one admin.');
      return;
    }

    Alert.alert(
      'Remove Admin',
      `Remove admin privileges from ${email}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              const updatedAdmins = adminEmails.filter(e => e !== email);
              await AsyncStorage.setItem('adminUsers', JSON.stringify(updatedAdmins));
              setAdminEmails(updatedAdmins);
              Alert.alert('Success', `Admin privileges removed from ${email}`);
            } catch (error) {
              Alert.alert('Error', 'Failed to remove admin');
            }
          },
        },
      ]
    );
  };

  const clearAllData = () => {
    Alert.alert(
      'Clear All Data',
      'This will delete all matches, updates, and user data. This action cannot be undone!',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.multiRemove([
                'demoMatches',
                'teamUpdates',
                'userPredictions',
                'favoriteMatches'
              ]);
              Alert.alert('Success', 'All data has been cleared');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear data');
            }
          },
        },
      ]
    );
  };

  if (!isAdmin) {
    return (
      <View style={styles.container}>
        <Appbar.Header style={styles.header}>
          <Appbar.BackAction onPress={() => navigation.goBack()} color="#fff" />
          <Appbar.Content title="Settings" titleStyle={styles.headerTitle} />
        </Appbar.Header>
        <View style={styles.noAccessContainer}>
          <Text style={styles.noAccessText}>🔒</Text>
          <Text style={styles.noAccessTitle}>Admin Access Required</Text>
          <Text style={styles.noAccessSubtitle}>
            Only administrators can access settings
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={() => navigation.goBack()} color="#fff" />
        <Appbar.Content title="Settings" titleStyle={styles.headerTitle} />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Admin Management */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>👑 Admin Management</Text>
            <Text style={styles.sectionDescription}>
              Manage who has admin privileges in the app
            </Text>

            {/* Add New Admin */}
            <View style={styles.addAdminContainer}>
              <TextInput
                label="Email Address"
                value={newAdminEmail}
                onChangeText={setNewAdminEmail}
                mode="outlined"
                style={styles.emailInput}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="user@example.com"
              />
              <Button
                mode="contained"
                onPress={addAdmin}
                loading={loading}
                disabled={loading}
                style={styles.addButton}
                icon="plus"
              >
                Add Admin
              </Button>
            </View>

            <Divider style={styles.divider} />

            {/* Current Admins List */}
            <Text style={styles.listTitle}>Current Administrators ({adminEmails.length})</Text>
            {adminEmails.length === 0 ? (
              <Text style={styles.emptyText}>No administrators yet</Text>
            ) : (
              adminEmails.map((email, index) => (
                <View key={index} style={styles.adminItem}>
                  <View style={styles.adminInfo}>
                    <Text style={styles.adminEmail}>{email}</Text>
                    <Chip mode="flat" style={styles.adminChip}>Admin</Chip>
                  </View>
                  <Button
                    mode="text"
                    onPress={() => removeAdmin(email)}
                    textColor="#d32f2f"
                    compact
                  >
                    Remove
                  </Button>
                </View>
              ))
            )}
          </Card.Content>
        </Card>

        {/* App Settings */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>⚙️ App Settings</Text>
            
            {setIsDarkMode && (
              <>
                <List.Item
                  title="Dark Mode"
                  description={isDarkMode ? "Dark theme enabled" : "Light theme enabled"}
                  left={props => <List.Icon {...props} icon={isDarkMode ? "weather-night" : "weather-sunny"} />}
                  right={() => (
                    <Switch
                      value={isDarkMode}
                      onValueChange={async (value) => {
                        setIsDarkMode(value);
                        await AsyncStorage.setItem('theme_preference', value ? 'dark' : 'light');
                      }}
                    />
                  )}
                />
                <Divider />
              </>
            )}
            
            <List.Item
              title="App Version"
              description="1.0.1"
              left={props => <List.Icon {...props} icon="information" />}
            />
            <Divider />
            <List.Item
              title="Storage Mode"
              description="Offline Mode (Local Storage)"
              left={props => <List.Icon {...props} icon="database" />}
            />
            <Divider />
            <List.Item
              title="Total Admins"
              description={`${adminEmails.length} administrator(s)`}
              left={props => <List.Icon {...props} icon="account-supervisor" />}
            />
          </Card.Content>
        </Card>

        {/* Danger Zone */}
        <Card style={[styles.card, styles.dangerCard]}>
          <Card.Content>
            <Text style={styles.dangerTitle}>⚠️ Danger Zone</Text>
            <Text style={styles.dangerDescription}>
              These actions are permanent and cannot be undone
            </Text>
            
            <Button
              mode="outlined"
              onPress={clearAllData}
              style={styles.dangerButton}
              textColor="#d32f2f"
              icon="delete-forever"
            >
              Clear All Data
            </Button>
          </Card.Content>
        </Card>

        <Text style={styles.footer}>
          🌍 Nkoroi to the World 🌍
        </Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#1a472a',
  },
  headerTitle: {
    color: '#fff',
    fontWeight: 'bold',
  },
  content: {
    padding: 15,
  },
  card: {
    marginBottom: 15,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#1a472a',
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  addAdminContainer: {
    marginBottom: 15,
  },
  emailInput: {
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#1a472a',
  },
  divider: {
    marginVertical: 15,
  },
  listTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 10,
  },
  adminItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  adminInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  adminEmail: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  adminChip: {
    backgroundColor: '#ffd700',
    marginLeft: 10,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontStyle: 'italic',
    paddingVertical: 20,
  },
  dangerCard: {
    borderColor: '#d32f2f',
    borderWidth: 1,
  },
  dangerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#d32f2f',
    marginBottom: 5,
  },
  dangerDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  dangerButton: {
    borderColor: '#d32f2f',
    marginTop: 10,
  },
  footer: {
    textAlign: 'center',
    color: '#999',
    fontSize: 12,
    marginTop: 10,
    marginBottom: 20,
  },
  noAccessContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  noAccessText: {
    fontSize: 80,
    marginBottom: 20,
  },
  noAccessTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  noAccessSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default SettingsScreen;
