import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, TouchableOpacity, Animated } from 'react-native';
import { Text, Card, FAB, Chip, Appbar, ActivityIndicator, Button } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';
import { subscribeToMatches, logoutUser } from '../services/firebase';

const HomeScreen = ({ navigation }) => {
  const { user, isAdmin, clearUserSession } = useAuth();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    // Subscribe to real-time Firebase matches
    const unsubscribe = subscribeToMatches((matchesData) => {
      const sorted = matchesData.sort((a, b) => {
        const statusOrder = { live: 0, upcoming: 1, finished: 2 };
        return statusOrder[a.status] - statusOrder[b.status];
      });
      setMatches(sorted);
      setLoading(false);
      setRefreshing(false);
    });

    return () => unsubscribe();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    // Firebase subscription will auto-update
  };

  const handleLogout = async () => {
    await clearUserSession();
    await logoutUser();
  };


  const getStatusColor = (status) => {
    switch (status) {
      case 'live':
        return '#4caf50';
      case 'upcoming':
        return '#4FC3F7';
      case 'finished':
        return '#9E9E9E';
      default:
        return '#9E9E9E';
    }
  };

  const getStatusGradient = (status) => {
    switch (status) {
      case 'live':
        return ['#4caf50', '#66bb6a'];
      case 'upcoming':
        return ['#4FC3F7', '#29B6F6'];
      case 'finished':
        return ['#9E9E9E', '#BDBDBD'];
      default:
        return ['#9E9E9E', '#BDBDBD'];
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'live':
        return '🔴 LIVE';
      case 'upcoming':
        return '📅 Upcoming';
      case 'finished':
        return '✓ Finished';
      default:
        return status;
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderMatch = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('MatchDetail', { matchId: item.id })}
    >
      <Card style={styles.matchCard}>
        <Card.Content>
          <View style={styles.statusContainer}>
            <Chip
              mode="flat"
              style={[styles.statusChip, { backgroundColor: getStatusColor(item.status) }]}
              textStyle={styles.statusText}
            >
              {getStatusLabel(item.status)}
            </Chip>
            {item.status === 'upcoming' && (
              <Text style={styles.dateText}>{formatDate(item.matchDate)}</Text>
            )}
          </View>

          <View style={styles.scoreContainer}>
            <View style={styles.teamContainer}>
              <Text style={styles.teamName}>{item.homeTeam}</Text>
              <Text style={styles.score}>{item.homeScore}</Text>
            </View>

            <Text style={styles.vs}>VS</Text>

            <View style={styles.teamContainer}>
              <Text style={styles.teamName}>{item.awayTeam}</Text>
              <Text style={styles.score}>{item.awayScore}</Text>
            </View>
          </View>

          {item.venue && (
            <Text style={styles.venue}>📍 {item.venue}</Text>
          )}
          
          {!isAdmin && item.status === 'upcoming' && (
            <Text style={styles.tapHint}>👆 Tap to make your prediction!</Text>
          )}
          
          {!isAdmin && item.status === 'live' && (
            <Text style={styles.tapHint}>👆 Tap to follow live updates!</Text>
          )}
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1a472a" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.Content title="Nkoroi FC Live Score" titleStyle={styles.headerTitle} />
        <Appbar.Action icon="chart-bar" onPress={() => navigation.navigate('TeamStats')} color="#fff" />
        <Appbar.Action icon="newspaper" onPress={() => navigation.navigate('TeamUpdates')} color="#fff" />
        <Appbar.Action icon="account-circle" onPress={() => navigation.navigate('Account')} color="#fff" />
      </Appbar.Header>

      {isAdmin && (
        <View style={styles.adminBadge}>
          <Text style={styles.adminText}>👑 Admin Mode</Text>
          <View style={styles.adminQuickActions}>
            <Button
              mode="outlined"
              onPress={() => navigation.navigate('CreateMatch')}
              icon="plus"
              style={styles.quickActionButton}
              compact
            >
              Match
            </Button>
            <Button
              mode="outlined"
              onPress={() => navigation.navigate('CreateUpdate')}
              icon="newspaper"
              style={styles.quickActionButton}
              compact
            >
              Update
            </Button>
          </View>
        </View>
      )}

      {!isAdmin && (
        <Card style={styles.welcomeCard}>
          <Card.Content>
            <Text style={styles.welcomeTitle}>⚽ Welcome, Fan!</Text>
            <Text style={styles.welcomeText}>Explore team features:</Text>
            <View style={styles.featureRow}>
              <Button
                mode="outlined"
                onPress={() => navigation.navigate('TeamStats')}
                icon="chart-bar"
                style={styles.featureButton}
                compact
              >
                📊 Stats
              </Button>
              <Button
                mode="outlined"
                onPress={() => navigation.navigate('TeamUpdates')}
                icon="newspaper"
                style={styles.featureButton}
                compact
              >
                📰 News
              </Button>
            </View>
          </Card.Content>
        </Card>
      )}


      <FlatList
        data={matches}
        renderItem={renderMatch}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>⚽</Text>
            <Text style={styles.emptyTitle}>No matches yet</Text>
            <Text style={styles.emptySubtitle}>
              {isAdmin ? 'Create your first match!' : 'Check back later for updates'}
            </Text>
          </View>
        }
      />

      {isAdmin && (
        <FAB
          icon="plus"
          style={styles.fab}
          onPress={() => navigation.navigate('CreateMatch')}
          color="#fff"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8',
  },
  header: {
    backgroundColor: '#4FC3F7',
    elevation: 4,
  },
  headerTitle: {
    color: '#fff',
    fontWeight: 'bold',
  },
  adminBadge: {
    backgroundColor: '#E3F2FD',
    padding: 15,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#4FC3F7',
  },
  adminText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0277BD',
    marginBottom: 10,
  },
  adminQuickActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 5,
  },
  quickActionButton: {
    marginHorizontal: 5,
    borderColor: '#4FC3F7',
  },
  welcomeCard: {
    margin: 15,
    marginBottom: 0,
    backgroundColor: '#B3E5FC',
    elevation: 3,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0288D1',
    marginBottom: 5,
  },
  welcomeText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  featureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  featureButton: {
    flex: 1,
    marginHorizontal: 5,
    borderColor: '#0288D1',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 15,
  },
  matchCard: {
    marginBottom: 15,
    elevation: 4,
    borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  statusChip: {
    height: 30,
    borderRadius: 15,
  },
  statusText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  dateText: {
    fontSize: 12,
    color: '#666',
  },
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: 10,
  },
  teamContainer: {
    alignItems: 'center',
    flex: 1,
  },
  teamName: {
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
    color: '#1E293B',
  },
  score: {
    fontSize: 36,
    fontWeight: '800',
    color: '#0277BD',
  },
  vs: {
    fontSize: 14,
    color: '#999',
    fontWeight: 'bold',
    marginHorizontal: 10,
  },
  venue: {
    fontSize: 12,
    color: '#666',
    marginTop: 10,
    textAlign: 'center',
  },
  tapHint: {
    fontSize: 12,
    color: '#0288D1',
    marginTop: 10,
    textAlign: 'center',
    fontWeight: 'bold',
    fontStyle: 'italic',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    fontSize: 80,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#666',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#4FC3F7',
    elevation: 6,
  },
});

export default HomeScreen;
