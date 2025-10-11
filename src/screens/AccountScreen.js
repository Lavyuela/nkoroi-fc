import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Card, Avatar, List, Divider, Button, Appbar, Chip } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';
import { logoutUser } from '../services/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { USER_ROLES, getRoleDisplayName, getRoleColor } from '../services/userRoles';

const AccountScreen = ({ navigation }) => {
  const { user, userRole, isAdmin, isSuperAdmin, clearUserSession } = useAuth();
  const [adminToggle, setAdminToggle] = useState(isAdmin);

  const toggleAdminStatus = async () => {
    const newAdminStatus = !adminToggle;
    
    Alert.alert(
      newAdminStatus ? 'Grant Admin Access' : 'Remove Admin Access',
      newAdminStatus 
        ? 'Grant yourself administrator privileges?' 
        : 'Remove your administrator privileges?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: newAdminStatus ? 'Grant' : 'Remove',
          onPress: async () => {
            try {
              const adminUsers = await AsyncStorage.getItem('adminUsers');
              let admins = adminUsers ? JSON.parse(adminUsers) : [];
              
              if (newAdminStatus) {
                // Add to admin list
                if (!admins.includes(user?.email)) {
                  admins.push(user?.email);
                }
              } else {
                // Remove from admin list
                admins = admins.filter(email => email !== user?.email);
              }
              
              await AsyncStorage.setItem('adminUsers', JSON.stringify(admins));
              setAdminToggle(newAdminStatus);
              setIsAdmin(newAdminStatus);
              
              Alert.alert(
                'Success',
                newAdminStatus 
                  ? 'You now have administrator privileges!' 
                  : 'Administrator privileges removed'
              );
            } catch (error) {
              Alert.alert('Error', 'Failed to update admin status');
            }
          },
        },
      ]
    );
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logoutUser();
            setUser(null);
            setIsAdmin(false);
          },
        },
      ]
    );
  };

  const getInitials = (email) => {
    if (!email) return '?';
    return email.substring(0, 2).toUpperCase();
  };

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={() => navigation.goBack()} color="#fff" />
        <Appbar.Content title="My Account" titleStyle={styles.headerTitle} />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Profile Section */}
        <Card style={styles.profileCard}>
          <Card.Content style={styles.profileContent}>
            <Avatar.Text 
              size={80} 
              label={getInitials(user?.email)} 
              style={styles.avatar}
            />
            <Text style={styles.email}>{user?.email || 'Guest'}</Text>
            <Chip 
              mode="flat" 
              icon={isSuperAdmin ? 'shield-crown' : isAdmin ? 'shield-account' : 'account'}
              style={[styles.roleChip, { backgroundColor: getRoleColor(userRole) }]}
              textStyle={styles.roleChipText}
            >
              {isSuperAdmin ? '👑 Super Admin' : isAdmin ? '🛡️ Admin' : '⚽ Fan'}
            </Chip>
          </Card.Content>
        </Card>

        {/* Account Info */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Account Information</Text>
            <List.Item
              title="Email"
              description={user?.email || 'Not logged in'}
              left={props => <List.Icon {...props} icon="email" />}
            />
            <Divider />
            <List.Item
              title="Account Type"
              description={getRoleDisplayName(userRole)}
              left={props => <List.Icon {...props} icon={isSuperAdmin ? 'shield-crown' : isAdmin ? 'shield-account' : 'account'} />}
            />
            <Divider />
            {isAdmin && (
              <>
                <List.Item
                  title="Administrator Privileges"
                  description="Enabled"
                  left={props => <List.Icon {...props} icon="shield-crown" />}
                  right={props => (
                    <Switch
                      value={true}
                      onValueChange={toggleAdminStatus}
                      color="#1a472a"
                    />
                  )}
                />
                <Divider />
              </>
            )}
            {!isAdmin && (
              <>
                <List.Item
                  title="Administrator Privileges"
                  description="Contact an admin to request access"
                  left={props => <List.Icon {...props} icon="shield-lock" />}
                />
                <Divider />
              </>
            )}
            <List.Item
              title="User ID"
              description={user?.uid || 'N/A'}
              left={props => <List.Icon {...props} icon="identifier" />}
            />
          </Card.Content>
        </Card>

        {/* Admin Features */}
        {isAdmin && (
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.sectionTitle}>Admin Features</Text>
              <List.Item
                title="Create Matches"
                description="Add new matches to the schedule"
                left={props => <List.Icon {...props} icon="plus-circle" color="#1a472a" />}
              />
              <Divider />
              <List.Item
                title="Manage Live Scores"
                description="Update scores and match events"
                left={props => <List.Icon {...props} icon="scoreboard" color="#1a472a" />}
              />
              <Divider />
              <List.Item
                title="Post Team Updates"
                description="Share news and announcements"
                left={props => <List.Icon {...props} icon="newspaper" color="#1a472a" />}
              />
              <Divider />
              <List.Item
                title="Delete Matches"
                description="Remove matches from the system"
                left={props => <List.Icon {...props} icon="delete" color="#1a472a" />}
              />
            </Card.Content>
          </Card>
        )}

        {/* Fan Features */}
        {!isAdmin && (
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.sectionTitle}>Fan Features</Text>
              <List.Item
                title="View Live Scores"
                description="Watch matches in real-time"
                left={props => <List.Icon {...props} icon="eye" color="#1a472a" />}
              />
              <Divider />
              <List.Item
                title="Make Predictions"
                description="Predict match outcomes"
                left={props => <List.Icon {...props} icon="target" color="#1a472a" />}
              />
              <Divider />
              <List.Item
                title="Follow Matches"
                description="Get notifications for your favorite matches"
                left={props => <List.Icon {...props} icon="heart" color="#1a472a" />}
              />
              <Divider />
              <List.Item
                title="View Team Stats"
                description="Check team performance and statistics"
                left={props => <List.Icon {...props} icon="chart-bar" color="#1a472a" />}
              />
            </Card.Content>
          </Card>
        )}

        {/* App Info */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>App Information</Text>
            <List.Item
              title="Version"
              description="1.0.0"
              left={props => <List.Icon {...props} icon="information" />}
            />
            <Divider />
            <List.Item
              title="App Name"
              description="Nkoroi FC Live Score"
              left={props => <List.Icon {...props} icon="soccer" />}
            />
            <Divider />
            <List.Item
              title="Mode"
              description="Offline Mode (Local Storage)"
              left={props => <List.Icon {...props} icon="database" />}
            />
          </Card.Content>
        </Card>

        {/* Settings Button (Admin Only) */}
        {isAdmin && (
          <Button
            mode="contained"
            onPress={() => navigation.navigate('Settings')}
            style={styles.settingsButton}
            icon="cog"
            contentStyle={styles.settingsButtonContent}
          >
            Settings
          </Button>
        )}

        {/* Logout Button */}
        <Button
          mode="contained"
          onPress={handleLogout}
          style={styles.logoutButton}
          icon="logout"
          contentStyle={styles.logoutButtonContent}
        >
          Logout
        </Button>

        <Text style={styles.footer}>
          Made with ❤️ for Nkoroi FC
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
    backgroundColor: '#4FC3F7',
  },
  headerTitle: {
    color: '#fff',
    fontWeight: 'bold',
  },
  content: {
    padding: 15,
  },
  profileCard: {
    marginBottom: 15,
    elevation: 3,
    backgroundColor: '#4FC3F7',
  },
  profileContent: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  avatar: {
    backgroundColor: '#fff',
    marginBottom: 15,
  },
  email: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  roleChip: {
    marginTop: 10,
  },
  roleChipText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  adminBadge: {
    backgroundColor: '#ffd700',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 5,
  },
  adminBadgeText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 14,
  },
  fanBadge: {
    backgroundColor: '#4FC3F7',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 5,
  },
  fanBadgeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  card: {
    marginBottom: 15,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#0288D1',
  },
  settingsButton: {
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: '#4FC3F7',
  },
  settingsButtonContent: {
    paddingVertical: 8,
  },
  logoutButton: {
    marginTop: 10,
    marginBottom: 20,
    backgroundColor: '#d32f2f',
  },
  logoutButtonContent: {
    paddingVertical: 8,
  },
  footer: {
    textAlign: 'center',
    color: '#999',
    fontSize: 12,
    marginBottom: 20,
  },
});

export default AccountScreen;
