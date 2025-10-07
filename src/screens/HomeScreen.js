import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import { Text, Card, FAB, Chip, Appbar, ActivityIndicator } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';
import { subscribeToMatches } from '../services/firebase';
import { logoutUser } from '../services/firebase';

const HomeScreen = ({ navigation }) => {
  const { user, isAdmin } = useAuth();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToMatches((matchesData) => {
      // Sort matches: live first, then upcoming, then finished
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
  };

  const handleLogout = async () => {
    await logoutUser();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'live':
        return '#4caf50';
      case 'upcoming':
        return '#2196f3';
      case 'finished':
        return '#757575';
      default:
        return '#757575';
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
        <Appbar.Action icon="logout" onPress={handleLogout} color="#fff" />
      </Appbar.Header>

      {isAdmin && (
        <View style={styles.adminBadge}>
          <Text style={styles.adminText}>👑 Admin Mode</Text>
        </View>
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
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#1a472a',
  },
  headerTitle: {
    color: '#fff',
    fontWeight: 'bold',
  },
  adminBadge: {
    backgroundColor: '#ffd700',
    padding: 10,
    alignItems: 'center',
  },
  adminText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
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
    elevation: 3,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  statusChip: {
    height: 28,
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
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  score: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a472a',
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
    backgroundColor: '#1a472a',
  },
});

export default HomeScreen;
