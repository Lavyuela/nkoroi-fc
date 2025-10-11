import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Card, Avatar, List, Divider, Button, Appbar, Chip } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';
import { logoutUser } from '../services/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { USER_ROLES, getRoleDisplayName, getRoleColor } from '../services/userRoles';

const AccountScreen = ({ navigation }) => {
  const { user, userRole, isAdmin, isSuperAdmin, clearUserSession } = useAuth();

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
            await clearUserSession();
            navigation.replace('Login');
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

        {/* Permissions Management (Super Admin Only) */}
        {isSuperAdmin && (
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.sectionTitle}>👑 Permissions Management</Text>
              <Text style={styles.permissionDescription}>
                As a Super Admin, you can manage user roles and permissions from the Dashboard.
              </Text>
              <Button
                mode="contained"
                onPress={() => navigation.navigate('UserManagement')}
                style={styles.permissionButton}
                icon="account-cog"
                contentStyle={styles.buttonContent}
              >
                Manage User Roles
              </Button>
              <Divider style={styles.divider} />
              <List.Item
                title="Super Admin"
                description="Full system access - Dashboard, User Management, Analytics"
                left={props => <List.Icon {...props} icon="shield-crown" color="#f44336" />}
              />
              <Divider />
              <List.Item
                title="Admin"
                description="Match management - Create, update, and manage matches"
                left={props => <List.Icon {...props} icon="shield-account" color="#ff9800" />}
              />
              <Divider />
              <List.Item
                title="Fan"
                description="View matches, make predictions, favorite matches"
                left={props => <List.Icon {...props} icon="account" color="#4FC3F7" />}
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
  permissionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
    lineHeight: 20,
  },
  permissionButton: {
    marginBottom: 15,
    backgroundColor: '#f44336',
  },
  divider: {
    marginVertical: 10,
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
