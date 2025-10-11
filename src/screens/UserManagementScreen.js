import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Alert, RefreshControl } from 'react-native';
import { Text, Card, Appbar, Avatar, Chip, IconButton, Searchbar, Menu, Button, Dialog, Portal } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';
import { getAllUsers, updateUserRole, deleteUser as deleteUserFromFirebase } from '../services/firebaseService';

const UserManagementScreen = ({ navigation }) => {
  const { user: currentUser, isSuperAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [menuVisible, setMenuVisible] = useState({});
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogAction, setDialogAction] = useState(null);

  useEffect(() => {
    if (!isSuperAdmin) {
      navigation.replace('Home');
      return;
    }
    loadUsers();
  }, [isSuperAdmin]);

  const loadUsers = async () => {
    try {
      const usersList = await getAllUsers();
      
      // Add isCurrentUser flag
      const usersWithFlags = usersList.map(user => ({
        ...user,
        isCurrentUser: user.uid === currentUser?.uid,
      }));

      // Sort: current user first, then super admins, then admins, then fans
      usersWithFlags.sort((a, b) => {
        if (a.isCurrentUser) return -1;
        if (b.isCurrentUser) return 1;
        if (a.isSuperAdmin && !b.isSuperAdmin) return -1;
        if (!a.isSuperAdmin && b.isSuperAdmin) return 1;
        if (a.isAdmin && !b.isAdmin) return -1;
        if (!a.isAdmin && b.isAdmin) return 1;
        return a.email.localeCompare(b.email);
      });

      setUsers(usersWithFlags);
      setFilteredUsers(usersWithFlags);
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

  const handleMakeSuperAdmin = async (user) => {
    try {
      const result = await updateUserRole(user.uid, 'super_admin');
      if (result.success) {
        Alert.alert('Success', `${user.email} is now a Super Admin with full system access`);
        loadUsers();
      } else {
        Alert.alert('Error', result.error || 'Failed to make user super admin');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to make user super admin');
    }
    hideDialog();
  };

  const handleRemoveSuperAdmin = async (user) => {
    try {
      if (user.isCurrentUser) {
        Alert.alert('Error', 'You cannot remove your own super admin access');
        return;
      }

      const result = await updateUserRole(user.uid, 'admin');
      if (result.success) {
        Alert.alert('Success', `${user.email} is no longer a Super Admin`);
        loadUsers();
      } else {
        Alert.alert('Error', result.error || 'Failed to remove super admin access');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to remove super admin access');
    }
    hideDialog();
  };

  const handleMakeAdmin = async (user) => {
    try {
      const result = await updateUserRole(user.uid, 'admin');
      if (result.success) {
        Alert.alert('Success', `${user.email} is now an Admin`);
        loadUsers();
      } else {
        Alert.alert('Error', result.error || 'Failed to make user admin');
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

      const result = await updateUserRole(user.uid, 'fan');
      if (result.success) {
        Alert.alert('Success', `${user.email} is no longer an admin`);
        loadUsers();
      } else {
        Alert.alert('Error', result.error || 'Failed to remove admin access');
      }
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

      const result = await deleteUserFromFirebase(user.uid);
      if (result.success) {
        Alert.alert('Success', `User ${user.email} has been deleted`);
        loadUsers();
      } else {
        Alert.alert('Error', result.error || 'Failed to delete user');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to delete user');
    }
    hideDialog();
  };

  const confirmAction = () => {
    if (!selectedUser || !dialogAction) return;

    switch (dialogAction) {
      case 'makeSuperAdmin':
        handleMakeSuperAdmin(selectedUser);
        break;
      case 'removeSuperAdmin':
        handleRemoveSuperAdmin(selectedUser);
        break;
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
      case 'makeSuperAdmin':
        return {
          title: 'Make Super Admin',
          content: `Grant FULL SYSTEM ACCESS to ${selectedUser.email}? Super Admins can manage all users and access analytics.`,
          confirmText: 'Make Super Admin',
          confirmColor: '#f44336',
        };
      case 'removeSuperAdmin':
        return {
          title: 'Remove Super Admin',
          content: `Remove super admin privileges from ${selectedUser.email}? They will become a regular admin.`,
          confirmText: 'Remove Super Admin',
          confirmColor: '#ff9800',
        };
      case 'makeAdmin':
        return {
          title: 'Make Admin',
          content: `Grant admin privileges to ${selectedUser.email}? Admins can create and manage matches.`,
          confirmText: 'Make Admin',
          confirmColor: '#4FC3F7',
        };
      case 'removeAdmin':
        return {
          title: 'Remove Admin',
          content: `Remove admin privileges from ${selectedUser.email}? They will become a regular fan.`,
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
            icon={item.isSuperAdmin ? 'shield-crown' : item.isAdmin ? 'shield-account' : 'account'} 
            style={[
              styles.avatar,
              item.isSuperAdmin && styles.superAdminAvatar,
              item.isAdmin && !item.isSuperAdmin && styles.adminAvatar,
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
              {item.isSuperAdmin && (
                <Chip 
                  mode="flat" 
                  icon="shield-crown" 
                  style={styles.superAdminChip}
                  textStyle={styles.chipText}
                >
                  Super Admin
                </Chip>
              )}
              {item.isAdmin && !item.isSuperAdmin && (
                <Chip 
                  mode="flat" 
                  icon="shield-check" 
                  style={styles.adminChip}
                  textStyle={styles.chipText}
                >
                  Admin
                </Chip>
              )}
              {!item.isAdmin && !item.isSuperAdmin && (
                <Chip 
                  mode="flat" 
                  icon="account" 
                  style={styles.fanChip}
                  textStyle={styles.chipText}
                >
                  Fan
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
            {!item.isSuperAdmin && !item.isAdmin && (
              <Menu.Item
                leadingIcon="shield-plus"
                onPress={() => showDialog(item, 'makeAdmin')}
                title="Make Admin"
              />
            )}
            {!item.isSuperAdmin && item.isAdmin && (
              <Menu.Item
                leadingIcon="shield-crown"
                onPress={() => showDialog(item, 'makeSuperAdmin')}
                title="Make Super Admin"
              />
            )}
            {item.isSuperAdmin && !item.isCurrentUser && (
              <Menu.Item
                leadingIcon="shield-remove"
                onPress={() => showDialog(item, 'removeSuperAdmin')}
                title="Remove Super Admin"
              />
            )}
            {item.isAdmin && !item.isSuperAdmin && !item.isCurrentUser && (
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
          <Chip icon="shield-crown" style={styles.statChip}>
            Super: {users.filter(u => u.isSuperAdmin).length}
          </Chip>
          <Chip icon="shield-account" style={styles.statChip}>
            Admins: {users.filter(u => u.isAdmin && !u.isSuperAdmin).length}
          </Chip>
          <Chip icon="account" style={styles.statChip}>
            Fans: {users.filter(u => !u.isAdmin && !u.isSuperAdmin).length}
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
  superAdminAvatar: {
    backgroundColor: '#f44336',
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
  superAdminChip: {
    backgroundColor: '#f44336',
    marginRight: 8,
    height: 24,
  },
  adminChip: {
    backgroundColor: '#ff9800',
    marginRight: 8,
    height: 24,
  },
  fanChip: {
    backgroundColor: '#4FC3F7',
    marginRight: 8,
    height: 24,
  },
  chipText: {
    fontSize: 12,
    fontWeight: 'bold',
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
