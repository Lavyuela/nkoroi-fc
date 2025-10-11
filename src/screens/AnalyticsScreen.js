import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Dimensions } from 'react-native';
import { Text, Card, Appbar, Chip, Avatar, Divider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');

const AnalyticsScreen = ({ navigation }) => {
  const { isAdmin } = useAuth();
  const [analytics, setAnalytics] = useState({
    users: {
      total: 0,
      admins: 0,
      regular: 0,
      newThisWeek: 0,
    },
    matches: {
      total: 0,
      live: 0,
      upcoming: 0,
      finished: 0,
      totalGoals: 0,
      totalEvents: 0,
    },
    engagement: {
      totalPredictions: 0,
      totalFavorites: 0,
      predictionsPerMatch: 0,
      favoritesPerMatch: 0,
    },
    topMatches: [],
    recentActivity: [],
  });
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!isAdmin) {
      navigation.replace('Home');
      return;
    }
    loadAnalytics();
  }, [isAdmin]);

  const loadAnalytics = async () => {
    try {
      // Load users
      const usersData = await AsyncStorage.getItem('registeredUsers');
      const adminData = await AsyncStorage.getItem('adminUsers');
      const usersObj = usersData ? JSON.parse(usersData) : {};
      const adminEmails = adminData ? JSON.parse(adminData) : [];
      
      const totalUsers = Object.keys(usersObj).length;
      const admins = adminEmails.length;
      const regular = totalUsers - admins;
      
      // Calculate new users this week
      const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
      const newThisWeek = Object.values(usersObj).filter(
        user => user.createdAt > oneWeekAgo
      ).length;

      // Load matches
      const matchesData = await AsyncStorage.getItem('demoMatches');
      const matches = matchesData ? JSON.parse(matchesData) : [];
      
      const totalMatches = matches.length;
      const liveMatches = matches.filter(m => m.status === 'live').length;
      const upcomingMatches = matches.filter(m => m.status === 'upcoming').length;
      const finishedMatches = matches.filter(m => m.status === 'finished').length;
      
      // Calculate total goals and events
      const totalGoals = matches.reduce((sum, match) => 
        sum + (match.homeScore || 0) + (match.awayScore || 0), 0
      );
      const totalEvents = matches.reduce((sum, match) => 
        sum + (match.events?.length || 0), 0
      );

      // Load predictions
      const predictionsData = await AsyncStorage.getItem('userPredictions');
      const predictions = predictionsData ? JSON.parse(predictionsData) : {};
      const totalPredictions = Object.keys(predictions).length;

      // Load favorites
      const favoritesData = await AsyncStorage.getItem('favoriteMatches');
      const favorites = favoritesData ? JSON.parse(favoritesData) : [];
      const totalFavorites = favorites.length;

      // Calculate averages
      const predictionsPerMatch = totalMatches > 0 
        ? (totalPredictions / totalMatches).toFixed(1) 
        : 0;
      const favoritesPerMatch = totalMatches > 0 
        ? (totalFavorites / totalMatches).toFixed(1) 
        : 0;

      // Get top matches (by events)
      const topMatches = matches
        .sort((a, b) => (b.events?.length || 0) - (a.events?.length || 0))
        .slice(0, 5)
        .map(match => ({
          id: match.id,
          title: `${match.homeTeam} vs ${match.awayTeam}`,
          events: match.events?.length || 0,
          score: `${match.homeScore || 0} - ${match.awayScore || 0}`,
          status: match.status,
        }));

      // Get recent activity
      const recentActivity = matches
        .filter(m => m.events && m.events.length > 0)
        .flatMap(match => 
          match.events.map(event => ({
            ...event,
            matchTitle: `${match.homeTeam} vs ${match.awayTeam}`,
          }))
        )
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, 10);

      setAnalytics({
        users: {
          total: totalUsers,
          admins,
          regular,
          newThisWeek,
        },
        matches: {
          total: totalMatches,
          live: liveMatches,
          upcoming: upcomingMatches,
          finished: finishedMatches,
          totalGoals,
          totalEvents,
        },
        engagement: {
          totalPredictions,
          totalFavorites,
          predictionsPerMatch,
          favoritesPerMatch,
        },
        topMatches,
        recentActivity,
      });
      setRefreshing(false);
    } catch (error) {
      console.error('Error loading analytics:', error);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadAnalytics();
  };

  const MetricCard = ({ title, value, subtitle, icon, color }) => (
    <Card style={[styles.metricCard, { borderTopColor: color, borderTopWidth: 3 }]}>
      <Card.Content>
        <View style={styles.metricHeader}>
          <Avatar.Icon size={40} icon={icon} style={{ backgroundColor: color }} />
          <Text style={styles.metricValue}>{value}</Text>
        </View>
        <Text style={styles.metricTitle}>{title}</Text>
        {subtitle && <Text style={styles.metricSubtitle}>{subtitle}</Text>}
      </Card.Content>
    </Card>
  );

  const getEventIcon = (type) => {
    const icons = {
      goal: '⚽',
      yellow_card: '🟨',
      red_card: '🟥',
      substitution: '🔄',
      injury: '🏥',
      penalty: '⚠️',
      kickoff: '🏁',
      halftime: '⏸️',
      fulltime: '🏆',
    };
    return icons[type] || '📝';
  };

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Analytics" />
        <Appbar.Action icon="refresh" onPress={onRefresh} />
      </Appbar.Header>

      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Text style={styles.sectionTitle}>👥 User Analytics</Text>
        <View style={styles.metricsGrid}>
          <MetricCard
            title="Total Users"
            value={analytics.users.total}
            subtitle={`${analytics.users.newThisWeek} new this week`}
            icon="account-group"
            color="#4FC3F7"
          />
          <MetricCard
            title="Admins"
            value={analytics.users.admins}
            subtitle={`${analytics.users.regular} regular users`}
            icon="shield-account"
            color="#ff9800"
          />
        </View>

        <Text style={styles.sectionTitle}>⚽ Match Analytics</Text>
        <View style={styles.metricsGrid}>
          <MetricCard
            title="Total Matches"
            value={analytics.matches.total}
            subtitle={`${analytics.matches.live} live now`}
            icon="soccer"
            color="#66bb6a"
          />
          <MetricCard
            title="Total Goals"
            value={analytics.matches.totalGoals}
            subtitle={`${analytics.matches.totalEvents} total events`}
            icon="soccer-field"
            color="#f44336"
          />
        </View>

        <View style={styles.metricsGrid}>
          <MetricCard
            title="Upcoming"
            value={analytics.matches.upcoming}
            icon="calendar-clock"
            color="#2196f3"
          />
          <MetricCard
            title="Finished"
            value={analytics.matches.finished}
            icon="check-circle"
            color="#9e9e9e"
          />
        </View>

        <Text style={styles.sectionTitle}>📊 Engagement</Text>
        <View style={styles.metricsGrid}>
          <MetricCard
            title="Predictions"
            value={analytics.engagement.totalPredictions}
            subtitle={`${analytics.engagement.predictionsPerMatch} per match`}
            icon="crystal-ball"
            color="#9c27b0"
          />
          <MetricCard
            title="Favorites"
            value={analytics.engagement.totalFavorites}
            subtitle={`${analytics.engagement.favoritesPerMatch} per match`}
            icon="star"
            color="#ffc107"
          />
        </View>

        {analytics.topMatches.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>🔥 Top Matches (by activity)</Text>
            <Card style={styles.listCard}>
              <Card.Content>
                {analytics.topMatches.map((match, index) => (
                  <View key={match.id}>
                    <View style={styles.topMatchItem}>
                      <View style={styles.topMatchRank}>
                        <Text style={styles.rankNumber}>#{index + 1}</Text>
                      </View>
                      <View style={styles.topMatchInfo}>
                        <Text style={styles.topMatchTitle}>{match.title}</Text>
                        <View style={styles.topMatchMeta}>
                          <Chip 
                            mode="flat" 
                            style={styles.statusChip}
                            textStyle={styles.chipText}
                          >
                            {match.status}
                          </Chip>
                          <Text style={styles.topMatchScore}>{match.score}</Text>
                          <Text style={styles.topMatchEvents}>
                            {match.events} events
                          </Text>
                        </View>
                      </View>
                    </View>
                    {index < analytics.topMatches.length - 1 && (
                      <Divider style={styles.divider} />
                    )}
                  </View>
                ))}
              </Card.Content>
            </Card>
          </>
        )}

        {analytics.recentActivity.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>📅 Recent Activity</Text>
            <Card style={styles.listCard}>
              <Card.Content>
                {analytics.recentActivity.map((activity, index) => (
                  <View key={index}>
                    <View style={styles.activityItem}>
                      <Text style={styles.activityIcon}>
                        {getEventIcon(activity.type)}
                      </Text>
                      <View style={styles.activityInfo}>
                        <Text style={styles.activityTitle}>
                          {activity.type.toUpperCase().replace('_', ' ')}
                        </Text>
                        <Text style={styles.activityMatch}>
                          {activity.matchTitle}
                        </Text>
                        <Text style={styles.activityDescription}>
                          {activity.description}
                        </Text>
                        <Text style={styles.activityTime}>
                          {new Date(activity.timestamp).toLocaleString()}
                        </Text>
                      </View>
                    </View>
                    {index < analytics.recentActivity.length - 1 && (
                      <Divider style={styles.divider} />
                    )}
                  </View>
                ))}
              </Card.Content>
            </Card>
          </>
        )}
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a472a',
    marginBottom: 12,
    marginTop: 8,
  },
  metricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  metricCard: {
    flex: 1,
    marginHorizontal: 4,
    elevation: 2,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  metricValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a472a',
  },
  metricTitle: {
    fontSize: 14,
    color: '#666',
    fontWeight: 'bold',
  },
  metricSubtitle: {
    fontSize: 11,
    color: '#999',
    marginTop: 4,
  },
  listCard: {
    marginBottom: 16,
    elevation: 2,
  },
  topMatchItem: {
    flexDirection: 'row',
    paddingVertical: 12,
  },
  topMatchRank: {
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4FC3F7',
  },
  topMatchInfo: {
    flex: 1,
  },
  topMatchTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1a472a',
    marginBottom: 8,
  },
  topMatchMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusChip: {
    height: 24,
    backgroundColor: '#4FC3F7',
    marginRight: 8,
  },
  chipText: {
    fontSize: 10,
    color: '#fff',
  },
  topMatchScore: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1a472a',
    marginRight: 8,
  },
  topMatchEvents: {
    fontSize: 12,
    color: '#666',
  },
  activityItem: {
    flexDirection: 'row',
    paddingVertical: 12,
  },
  activityIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#4FC3F7',
    marginBottom: 4,
  },
  activityMatch: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1a472a',
    marginBottom: 4,
  },
  activityDescription: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 11,
    color: '#999',
  },
  divider: {
    marginVertical: 4,
  },
});

export default AnalyticsScreen;
