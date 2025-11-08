import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Text, Card, Appbar, Chip, Avatar, Divider, List } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';
import firestore from '@react-native-firebase/firestore';

const ActiveUsersScreen = ({ navigation }) => {
  const { isSuperAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    admins: 0,
    superAdmins: 0,
  });

  useEffect(() => {
    if (!isSuperAdmin) {
      navigation.replace('Home');
      return;
    }
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      
      // Get all users
      const usersSnapshot = await firestore()
        .collection('users')
        .orderBy('lastActive', 'desc')
        .get();

      const usersList = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Get roles
      const rolesSnapshot = await firestore().collection('roles').get();
      const rolesMap = {};
      rolesSnapshot.docs.forEach(doc => {
        rolesMap[doc.id] = doc.data().role;
      });

      // Merge roles with users
      const usersWithRoles = usersList.map(user => ({
        ...user,
        role: rolesMap[user.id] || 'fan',
      }));

      setUsers(usersWithRoles);

      // Calculate stats
      const now = Date.now();
      const activeThreshold = 24 * 60 * 60 * 1000; // 24 hours

      const statistics = {
        total: usersWithRoles.length,
        active: usersWithRoles.filter(u => 
          u.lastActive && (now - u.lastActive.toMillis()) < activeThreshold
        ).length,
        admins: usersWithRoles.filter(u => u.role === 'admin').length,
        superAdmins: usersWithRoles.filter(u => u.role === 'super_admin').length,
      };

      setStats(statistics);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadUsers();
  };

  const getLastActiveText = (lastActive) => {
    if (!lastActive) return 'Never';
    
    const now = Date.now();
    const diff = now - lastActive.toMillis();
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return lastActive.toDate().toLocaleDateString();
  };

  const getStatusColor = (lastActive) => {
    if (!lastActive) return '#999';
    
    const now = Date.now();
    const diff = now - lastActive.toMillis();
    
    if (diff < 300000) return '#4caf50'; // 5 min - online
    if (diff < 3600000) return '#ff9800'; // 1 hour - recently active
    if (diff < 86400000) return '#2196f3'; // 24 hours - active today
    return '#999'; // inactive
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'super_admin': return '#9c27b0';
      case 'admin': return '#ff9800';
      default: return '#2196f3';
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'super_admin': return '👑 Super Admin';
      case 'admin': return '⚡ Admin';
      default: return '⚽ Fan';
    }
  };

  if (!isSuperAdmin) {
    return (
      <View style={styles.container}>
        <Appbar.Header style={styles.header}>
          <Appbar.BackAction onPress={() => navigation.goBack()} color="#fff" />
          <Appbar.Content title="Active Users" titleStyle={styles.headerTitle} />
        </Appbar.Header>
        <View style={styles.noAccessContainer}>
          <Text style={styles.noAccessText}>🔒</Text>
          <Text style={styles.noAccessTitle}>Super Admin Only</Text>
          <Text style={styles.noAccessSubtitle}>
            Only super administrators can view active users
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={() => navigation.goBack()} color="#fff" />
        <Appbar.Content title="Active Users" titleStyle={styles.headerTitle} />
        <Appbar.Action icon="refresh" onPress={onRefresh} color="#fff" />
      </Appbar.Header>

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Statistics Cards */}
        <View style={styles.statsContainer}>
          <Card style={[styles.statCard, { backgroundColor: '#2196f3' }]}>
            <Card.Content>
              <Text style={styles.statNumber}>{stats.total}</Text>
              <Text style={styles.statLabel}>Total Users</Text>
            </Card.Content>
          </Card>

          <Card style={[styles.statCard, { backgroundColor: '#4caf50' }]}>
            <Card.Content>
              <Text style={styles.statNumber}>{stats.active}</Text>
              <Text style={styles.statLabel}>Active (24h)</Text>
            </Card.Content>
          </Card>

          <Card style={[styles.statCard, { backgroundColor: '#ff9800' }]}>
            <Card.Content>
              <Text style={styles.statNumber}>{stats.admins}</Text>
              <Text style={styles.statLabel}>Admins</Text>
            </Card.Content>
          </Card>

          <Card style={[styles.statCard, { backgroundColor: '#9c27b0' }]}>
            <Card.Content>
              <Text style={styles.statNumber}>{stats.superAdmins}</Text>
              <Text style={styles.statLabel}>Super Admins</Text>
            </Card.Content>
          </Card>
        </View>

        {/* Users List */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>👥 All Users ({users.length})</Text>
            
            {loading ? (
              <Text style={styles.loadingText}>Loading users...</Text>
            ) : users.length === 0 ? (
              <Text style={styles.emptyText}>No users found</Text>
            ) : (
              users.map((user, index) => (
                <View key={user.id}>
                  <View style={styles.userItem}>
                    <View style={styles.userLeft}>
                      <View style={[styles.statusDot, { backgroundColor: getStatusColor(user.lastActive) }]} />
                      <Avatar.Text
                        size={40}
                        label={user.email ? user.email.charAt(0).toUpperCase() : '?'}
                        style={styles.avatar}
                      />
                      <View style={styles.userInfo}>
                        <Text style={styles.userEmail}>{user.email || 'Unknown'}</Text>
                        <Text style={styles.lastActive}>
                          {getLastActiveText(user.lastActive)}
                        </Text>
                      </View>
                    </View>
                    
                    <View style={styles.userRight}>
                      <Chip
                        mode="flat"
                        style={[styles.roleChip, { backgroundColor: getRoleBadgeColor(user.role) }]}
                        textStyle={{ color: '#fff', fontSize: 10 }}
                      >
                        {getRoleLabel(user.role)}
                      </Chip>
                      {user.subscribedToTopics?.includes('team_updates') && (
                        <Text style={styles.notifIcon}>🔔</Text>
                      )}
                    </View>
                  </View>
                  
                  {/* Additional Info */}
                  {user.fcmToken && (
                    <View style={styles.additionalInfo}>
                      <Text style={styles.infoText}>
                        📱 Device: {user.fcmToken ? 'Connected' : 'Not connected'}
                      </Text>
                      {user.lastTopicSubscription && (
                        <Text style={styles.infoText}>
                          🔔 Subscribed: {new Date(user.lastTopicSubscription.toMillis()).toLocaleDateString()}
                        </Text>
                      )}
                    </View>
                  )}
                  
                  {index < users.length - 1 && <Divider style={styles.divider} />}
                </View>
              ))
            )}
          </Card.Content>
        </Card>

        {/* Legend */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>📖 Status Legend</Text>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#4caf50' }]} />
              <Text style={styles.legendText}>Online (last 5 minutes)</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#ff9800' }]} />
              <Text style={styles.legendText}>Recently Active (last hour)</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#2196f3' }]} />
              <Text style={styles.legendText}>Active Today (last 24 hours)</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#999' }]} />
              <Text style={styles.legendText}>Inactive</Text>
            </View>
          </Card.Content>
        </Card>

        <Text style={styles.footer}>🌍 Nkoroi to the World 🌍</Text>
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
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  statCard: {
    width: '48%',
    marginBottom: 10,
    elevation: 3,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#fff',
    textAlign: 'center',
    marginTop: 5,
  },
  card: {
    marginBottom: 15,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#1a472a',
  },
  userItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  userLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  avatar: {
    backgroundColor: '#87CEEB',
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userEmail: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  lastActive: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  userRight: {
    alignItems: 'flex-end',
  },
  roleChip: {
    marginBottom: 4,
  },
  notifIcon: {
    fontSize: 12,
  },
  additionalInfo: {
    marginLeft: 62,
    marginTop: 4,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 11,
    color: '#999',
    marginBottom: 2,
  },
  divider: {
    marginVertical: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  legendText: {
    fontSize: 14,
    color: '#666',
  },
  loadingText: {
    textAlign: 'center',
    color: '#666',
    paddingVertical: 20,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontStyle: 'italic',
    paddingVertical: 20,
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
  footer: {
    textAlign: 'center',
    color: '#999',
    fontSize: 12,
    marginTop: 10,
    marginBottom: 20,
  },
});

export default ActiveUsersScreen;
