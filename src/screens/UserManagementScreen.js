import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Alert, RefreshControl } from 'react-native';
import { Text, Card, Appbar, Avatar, Chip, IconButton, Searchbar, Menu, Button, Dialog, Portal } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../context/AuthContext';

const UserManagementScreen = ({ navigation }) => {
  const { user: currentUser, isAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [menuVisible, setMenuVisible] = useState({});
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogAction, setDialogAction] = useState(null);

  useEffect(() => {
    if (!isAdmin) {
      navigation.replace('Home');
      return;
    }
    loadUsers();
  }, [isAdmin]);

  const loadUsers = async () => {
    try {
      const usersData = await AsyncStorage.getItem('registeredUsers');
      const adminData = await AsyncStorage.getItem('adminUsers');
      
      const usersObj = usersData ? JSON.parse(usersData) : {};
      const adminEmails = adminData ? JSON.parse(adminData) : [];

      const usersList = Object.entries(usersObj).map(([email, userData]) => ({
        email,
        ...userData,
        isAdmin: adminEmails.includes(email),
        isCurrentUser: email === currentUser?.email,
      }));

      // Sort: current user first, then admins, then regular users
      usersList.sort((a, b) => {
        if (a.isCurrentUser) return -1;
        if (b.isCurrentUser) return 1;
        if (a.isAdmin && !b.isAdmin) return -1;
        if (!a.isAdmin && b.isAdmin) return 1;
        return a.email.localeCompare(b.email);
      });

      setUsers(usersList);
      setFilteredUsers(usersList);
      setRefreshing(false);
    } catch (error) {
      console.error('Error loading users:', error);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadUsers();
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user =>
        user.email.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  };

  const openMenu = (email) => {
    setMenuVisible({ ...menuVisible, [email]: true });
  };

  const closeMenu = (email) => {
    setMenuVisible({ ...menuVisible, [email]: false });
  };

  const showDialog = (user, action) => {
    setSelectedUser(user);
    setDialogAction(action);
    setDialogVisible(true);
    closeMenu(user.email);
  };

  const hideDialog = () => {
    setDialogVisible(false);
    setSelectedUser(null);
    setDialogAction(null);
  };

  const handleMakeAdmin = async (user) => {
    try {
      const adminData = await AsyncStorage.getItem('adminUsers');
      const adminEmails = adminData ? JSON.parse(adminData) : [];
      
      if (!adminEmails.includes(user.email)) {
        adminEmails.push(user.email);
        await AsyncStorage.setItem('adminUsers', JSON.stringify(adminEmails));
        Alert.alert('Success', `${user.email} is now an admin`);
        loadUsers();
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to make user admin');
    }
    hideDialog();
  };

  const handleRemoveAdmin = async (user) => {
    try {
      if (user.isCurrentUser) {
        Alert.alert('Error', 'You cannot remove your own admin access');
        return;
      }

      const adminData = await AsyncStorage.getItem('adminUsers');
      const adminEmails = adminData ? JSON.parse(adminData) : [];
      
      const updatedAdmins = adminEmails.filter(email => email !== user.email);
      await AsyncStorage.setItem('adminUsers', JSON.stringify(updatedAdmins));
      Alert.alert('Success', `${user.email} is no longer an admin`);
      loadUsers();
    } catch (error) {
      Alert.alert('Error', 'Failed to remove admin access');
    }
    hideDialog();
  };

  const handleDeleteUser = async (user) => {
    try {
      if (user.isCurrentUser) {
        Alert.alert('Error', 'You cannot delete your own account');
        return;
      }

      const usersData = await AsyncStorage.getItem('registeredUsers');
      const usersObj = usersData ? JSON.parse(usersData) : {};
      
      delete usersObj[user.email];
      await AsyncStorage.setItem('registeredUsers', JSON.stringify(usersObj));

      // Also remove from admin list if present
      if (user.isAdmin) {
        const adminData = await AsyncStorage.getItem('adminUsers');
        const adminEmails = adminData ? JSON.parse(adminData) : [];
        const updatedAdmins = adminEmails.filter(email => email !== user.email);
        await AsyncStorage.setItem('adminUsers', JSON.stringify(updatedAdmins));
      }

      Alert.alert('Success', `User ${user.email} has been deleted`);
      loadUsers();
    } catch (error) {
      Alert.alert('Error', 'Failed to delete user');
    }
    hideDialog();
  };

  const confirmAction = () => {
    if (!selectedUser || !dialogAction) return;

    switch (dialogAction) {
      case 'makeAdmin':
        handleMakeAdmin(selectedUser);
        break;
      case 'removeAdmin':
        handleRemoveAdmin(selectedUser);
        break;
      case 'delete':
        handleDeleteUser(selectedUser);
        break;
    }
  };

  const getDialogContent = () => {
    if (!selectedUser || !dialogAction) return {};

    switch (dialogAction) {
      case 'makeAdmin':
        return {
          title: 'Make Admin',
          content: `Grant admin privileges to ${selectedUser.email}?`,
          confirmText: 'Make Admin',
          confirmColor: '#4FC3F7',
        };
      case 'removeAdmin':
        return {
          title: 'Remove Admin',
          content: `Remove admin privileges from ${selectedUser.email}?`,
          confirmText: 'Remove Admin',
          confirmColor: '#ff9800',
        };
      case 'delete':
        return {
          title: 'Delete User',
          content: `Permanently delete ${selectedUser.email}? This action cannot be undone.`,
          confirmText: 'Delete',
          confirmColor: '#f44336',
        };
      default:
        return {};
    }
  };

  const renderUser = ({ item }) => (
    <Card style={styles.userCard}>
      <Card.Content>
        <View style={styles.userRow}>
          <Avatar.Icon 
            size={48} 
            icon={item.isAdmin ? 'shield-account' : 'account'} 
            style={[
              styles.avatar,
              item.isAdmin && styles.adminAvatar,
              item.isCurrentUser && styles.currentUserAvatar,
            ]}
          />
          
          <View style={styles.userInfo}>
            <View style={styles.userHeader}>
              <Text style={styles.userEmail}>{item.email}</Text>
              {item.isCurrentUser && (
                <Chip mode="flat" style={styles.youChip} textStyle={styles.chipText}>
                  You
                </Chip>
              )}
            </View>
            
            <View style={styles.userMeta}>
              {item.isAdmin && (
                <Chip 
                  mode="flat" 
                  icon="shield-check" 
                  style={styles.adminChip}
                  textStyle={styles.chipText}
                >
                  Admin
                </Chip>
              )}
              <Text style={styles.userDate}>
                Joined: {new Date(item.createdAt).toLocaleDateString()}
              </Text>
            </View>
          </View>

          <Menu
            visible={menuVisible[item.email] || false}
            onDismiss={() => closeMenu(item.email)}
            anchor={
              <IconButton
                icon="dots-vertical"
                onPress={() => openMenu(item.email)}
              />
            }
          >
            {!item.isAdmin && (
              <Menu.Item
                leadingIcon="shield-plus"
                onPress={() => showDialog(item, 'makeAdmin')}
                title="Make Admin"
              />
            )}
            {item.isAdmin && !item.isCurrentUser && (
              <Menu.Item
                leadingIcon="shield-remove"
                onPress={() => showDialog(item, 'removeAdmin')}
                title="Remove Admin"
              />
            )}
            {!item.isCurrentUser && (
              <Menu.Item
                leadingIcon="delete"
                onPress={() => showDialog(item, 'delete')}
                title="Delete User"
                titleStyle={{ color: '#f44336' }}
              />
            )}
          </Menu>
        </View>
      </Card.Content>
    </Card>
  );

  const dialogContent = getDialogContent();

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="User Management" />
        <Appbar.Action icon="refresh" onPress={onRefresh} />
      </Appbar.Header>

      <View style={styles.content}>
        <Searchbar
          placeholder="Search users..."
          onChangeText={handleSearch}
          value={searchQuery}
          style={styles.searchBar}
        />

        <View style={styles.statsRow}>
          <Chip icon="account-group" style={styles.statChip}>
            Total: {users.length}
          </Chip>
          <Chip icon="shield-account" style={styles.statChip}>
            Admins: {users.filter(u => u.isAdmin).length}
          </Chip>
          <Chip icon="account" style={styles.statChip}>
            Users: {users.filter(u => !u.isAdmin).length}
          </Chip>
        </View>

        <FlatList
          data={filteredUsers}
          renderItem={renderUser}
          keyExtractor={(item) => item.email}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <Card style={styles.emptyCard}>
              <Card.Content>
                <Text style={styles.emptyText}>No users found</Text>
              </Card.Content>
            </Card>
          }
        />
      </View>

      <Portal>
        <Dialog visible={dialogVisible} onDismiss={hideDialog}>
          <Dialog.Title>{dialogContent.title}</Dialog.Title>
          <Dialog.Content>
            <Text>{dialogContent.content}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>Cancel</Button>
            <Button 
              onPress={confirmAction}
              textColor={dialogContent.confirmColor}
            >
              {dialogContent.confirmText}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
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
  content: {
    flex: 1,
    padding: 16,
  },
  searchBar: {
    marginBottom: 16,
    elevation: 2,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statChip: {
    flex: 1,
    marginHorizontal: 4,
  },
  userCard: {
    marginBottom: 12,
    elevation: 2,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    backgroundColor: '#4FC3F7',
  },
  adminAvatar: {
    backgroundColor: '#ff9800',
  },
  currentUserAvatar: {
    backgroundColor: '#1a472a',
  },
  userInfo: {
    flex: 1,
    marginLeft: 16,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  userEmail: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a472a',
    marginRight: 8,
  },
  youChip: {
    backgroundColor: '#1a472a',
    height: 24,
  },
  userMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  adminChip: {
    backgroundColor: '#ff9800',
    marginRight: 8,
    height: 24,
  },
  chipText: {
    fontSize: 10,
    color: '#fff',
  },
  userDate: {
    fontSize: 12,
    color: '#666',
  },
  emptyCard: {
    marginTop: 32,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
  },
});

export default UserManagementScreen;
