import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { Text, Card, Appbar, Chip, Avatar, Divider, Button } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';
import firestore from '@react-native-firebase/firestore';

const AdminDashboardScreen = ({ navigation }) => {
  const { isSuperAdmin } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalMatches: 0,
    liveMatches: 0,
    upcomingMatches: 0,
    finishedMatches: 0,
    totalPredictions: 0,
    totalFavorites: 0,
  });
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!isSuperAdmin) {
      navigation.replace('Home');
      return;
    }
    loadDashboardData();
  }, [isSuperAdmin]);

  const loadDashboardData = async () => {
    try {
      // Load users from Firebase
      const usersSnapshot = await firestore().collection('users').get();
      const totalUsers = usersSnapshot.size;

      // Load matches from Firebase
      const matchesSnapshot = await firestore().collection('matches').get();
      const matches = matchesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const totalMatches = matches.length;
      const liveMatches = matches.filter(m => m.status === 'live').length;
      const upcomingMatches = matches.filter(m => m.status === 'upcoming').length;
      const finishedMatches = matches.filter(m => m.status === 'finished').length;

      // Load predictions from Firebase
      const predictionsSnapshot = await firestore().collection('predictions').get();
      const totalPredictions = predictionsSnapshot.size;

      // Load favorites from Firebase
      const favoritesSnapshot = await firestore().collection('favorites').get();
      const totalFavorites = favoritesSnapshot.size;

      setStats({
        totalUsers,
        totalMatches,
        liveMatches,
        upcomingMatches,
        finishedMatches,
        totalPredictions,
        totalFavorites,
      });
      setRefreshing(false);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
  };

  const StatCard = ({ title, value, icon, color, onPress }) => (
    <TouchableOpacity onPress={onPress} disabled={!onPress}>
      <Card style={[styles.statCard, { borderLeftColor: color, borderLeftWidth: 4 }]}>
        <Card.Content>
          <View style={styles.statContent}>
            <View>
              <Text style={styles.statValue}>{value}</Text>
              <Text style={styles.statTitle}>{title}</Text>
            </View>
            <Avatar.Icon size={48} icon={icon} style={{ backgroundColor: color }} />
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Admin Dashboard" />
        <Appbar.Action icon="refresh" onPress={onRefresh} />
      </Appbar.Header>

      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Card style={styles.welcomeCard}>
          <Card.Content>
            <Text variant="headlineSmall" style={styles.welcomeTitle}>
              👑 Welcome, Super Admin!
            </Text>
            <Text style={styles.welcomeText}>
              Full system control: Manage users, view analytics, and oversee all operations
            </Text>
          </Card.Content>
        </Card>

        <Text style={styles.sectionTitle}>📊 Quick Stats</Text>

        <View style={styles.statsGrid}>
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            icon="account-group"
            color="#4FC3F7"
            onPress={() => navigation.navigate('UserManagement')}
          />
          <StatCard
            title="Total Matches"
            value={stats.totalMatches}
            icon="soccer"
            color="#66bb6a"
          />
        </View>

        <View style={styles.statsGrid}>
          <StatCard
            title="Live Matches"
            value={stats.liveMatches}
            icon="play-circle"
            color="#f44336"
          />
          <StatCard
            title="Upcoming"
            value={stats.upcomingMatches}
            icon="calendar-clock"
            color="#ff9800"
          />
        </View>

        <View style={styles.statsGrid}>
          <StatCard
            title="Finished"
            value={stats.finishedMatches}
            icon="check-circle"
            color="#9e9e9e"
          />
          <StatCard
            title="Predictions"
            value={stats.totalPredictions}
            icon="crystal-ball"
            color="#9c27b0"
          />
        </View>

        <Text style={styles.sectionTitle}>🛠️ Admin Tools</Text>

        <Card style={styles.toolCard}>
          <Card.Content>
            <TouchableOpacity 
              style={styles.toolItem}
              onPress={() => navigation.navigate('UserManagement')}
            >
              <Avatar.Icon size={40} icon="account-cog" style={styles.toolIcon} />
              <View style={styles.toolText}>
                <Text style={styles.toolTitle}>User Management</Text>
                <Text style={styles.toolDescription}>
                  View users, grant admin access, manage accounts
                </Text>
              </View>
              <Avatar.Icon size={24} icon="chevron-right" style={styles.chevron} />
            </TouchableOpacity>

            <Divider style={styles.divider} />

            <TouchableOpacity 
              style={styles.toolItem}
              onPress={() => navigation.navigate('PlayerManagement')}
            >
              <Avatar.Icon size={40} icon="account-multiple" style={styles.toolIcon} />
              <View style={styles.toolText}>
                <Text style={styles.toolTitle}>Player Management</Text>
                <Text style={styles.toolDescription}>
                  Add and manage team players
                </Text>
              </View>
              <Avatar.Icon size={24} icon="chevron-right" style={styles.chevron} />
            </TouchableOpacity>

            <Divider style={styles.divider} />

            <TouchableOpacity 
              style={styles.toolItem}
              onPress={() => navigation.navigate('Analytics')}
            >
              <Avatar.Icon size={40} icon="chart-line" style={styles.toolIcon} />
              <View style={styles.toolText}>
                <Text style={styles.toolTitle}>Analytics</Text>
                <Text style={styles.toolDescription}>
                  View detailed statistics and user engagement
                </Text>
              </View>
              <Avatar.Icon size={24} icon="chevron-right" style={styles.chevron} />
            </TouchableOpacity>

            <Divider style={styles.divider} />

            <TouchableOpacity 
              style={styles.toolItem}
              onPress={() => navigation.navigate('CreateMatch')}
            >
              <Avatar.Icon size={40} icon="plus-circle" style={styles.toolIcon} />
              <View style={styles.toolText}>
                <Text style={styles.toolTitle}>Create Match</Text>
                <Text style={styles.toolDescription}>
                  Add new matches to the schedule
                </Text>
              </View>
              <Avatar.Icon size={24} icon="chevron-right" style={styles.chevron} />
            </TouchableOpacity>

            <Divider style={styles.divider} />

            <TouchableOpacity 
              style={styles.toolItem}
              onPress={() => navigation.navigate('TestNotification')}
            >
              <Avatar.Icon size={40} icon="bell-ring" style={styles.toolIcon} />
              <View style={styles.toolText}>
                <Text style={styles.toolTitle}>Test Notifications</Text>
                <Text style={styles.toolDescription}>
                  Test push notification system
                </Text>
              </View>
              <Avatar.Icon size={24} icon="chevron-right" style={styles.chevron} />
            </TouchableOpacity>
          </Card.Content>
        </Card>

        <Card style={styles.infoCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.infoTitle}>
              ℹ️ Admin Tips
            </Text>
            <Text style={styles.infoText}>
              • Pull down to refresh dashboard data{'\n'}
              • Tap on stat cards to view details{'\n'}
              • Use User Management to grant admin access{'\n'}
              • Check Analytics for user engagement{'\n'}
              • Test notifications before match events
            </Text>
          </Card.Content>
        </Card>
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
  content: {
    flex: 1,
    padding: 16,
  },
  welcomeCard: {
    marginBottom: 24,
    backgroundColor: '#1a472a',
  },
  welcomeTitle: {
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  welcomeText: {
    color: '#e0e0e0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a472a',
    marginBottom: 12,
    marginTop: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 4,
    elevation: 2,
  },
  statContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a472a',
  },
  statTitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  toolCard: {
    marginBottom: 16,
    elevation: 2,
  },
  toolItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  toolIcon: {
    backgroundColor: '#4FC3F7',
  },
  toolText: {
    flex: 1,
    marginLeft: 16,
  },
  toolTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a472a',
  },
  toolDescription: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  chevron: {
    backgroundColor: 'transparent',
  },
  divider: {
    marginVertical: 8,
  },
  infoCard: {
    marginBottom: 24,
    backgroundColor: '#e3f2fd',
  },
  infoTitle: {
    color: '#1a472a',
    fontWeight: 'bold',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 24,
  },
});

export default AdminDashboardScreen;
