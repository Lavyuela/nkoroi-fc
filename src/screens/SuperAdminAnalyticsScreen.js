import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, RefreshControl } from 'react-native';
import { Text, Card, Appbar, Chip, Avatar, ProgressBar } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';
import firestore from '@react-native-firebase/firestore';

const { width } = Dimensions.get('window');

const SuperAdminAnalyticsScreen = ({ navigation }) => {
  const { isSuperAdmin } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [analytics, setAnalytics] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalAdmins: 0,
    totalMatches: 0,
    liveMatches: 0,
    upcomingMatches: 0,
    finishedMatches: 0,
    totalPredictions: 0,
    correctPredictions: 0,
    totalPlayers: 0,
    activePlayers: 0,
    totalGoals: 0,
    totalCards: 0,
    avgMatchDuration: 0,
    userGrowth: [],
    matchStats: {},
    topPredictors: [],
  });

  useEffect(() => {
    if (!isSuperAdmin) {
      navigation.replace('Home');
      return;
    }
    loadAnalytics();
  }, [isSuperAdmin]);

  const loadAnalytics = async () => {
    try {
      // Users Analytics
      const usersSnapshot = await firestore().collection('users').get();
      const users = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const totalUsers = users.length;
      const totalAdmins = users.filter(u => u.isAdmin || u.isSuperAdmin).length;
      const activeUsers = users.filter(u => u.lastActive && 
        (Date.now() - u.lastActive.toMillis()) < 7 * 24 * 60 * 60 * 1000).length;

      // Matches Analytics
      const matchesSnapshot = await firestore().collection('matches').get();
      const matches = matchesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const totalMatches = matches.length;
      const liveMatches = matches.filter(m => m.status === 'live').length;
      const upcomingMatches = matches.filter(m => m.status === 'upcoming').length;
      const finishedMatches = matches.filter(m => m.status === 'finished').length;

      // Calculate total goals and cards from match events
      let totalGoals = 0;
      let totalCards = 0;
      matches.forEach(match => {
        if (match.events && Array.isArray(match.events)) {
          totalGoals += match.events.filter(e => e.type === 'goal').length;
          totalCards += match.events.filter(e => e.type === 'yellow_card' || e.type === 'red_card').length;
        }
      });

      // Players Analytics
      const playersSnapshot = await firestore().collection('players').get();
      const players = playersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const totalPlayers = players.length;
      const activePlayers = players.filter(p => p.active !== false).length;

      // Predictions Analytics
      const predictionsSnapshot = await firestore().collection('predictions').get();
      const predictions = predictionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const totalPredictions = predictions.length;
      const correctPredictions = predictions.filter(p => p.correct === true).length;

      // Top Predictors
      const predictionsByUser = {};
      predictions.forEach(pred => {
        if (!predictionsByUser[pred.userId]) {
          predictionsByUser[pred.userId] = { correct: 0, total: 0 };
        }
        predictionsByUser[pred.userId].total++;
        if (pred.correct) predictionsByUser[pred.userId].correct++;
      });

      const topPredictors = Object.entries(predictionsByUser)
        .map(([userId, stats]) => ({
          userId,
          accuracy: (stats.correct / stats.total) * 100,
          total: stats.total,
        }))
        .sort((a, b) => b.accuracy - a.accuracy)
        .slice(0, 5);

      setAnalytics({
        totalUsers,
        activeUsers,
        totalAdmins,
        totalMatches,
        liveMatches,
        upcomingMatches,
        finishedMatches,
        totalPredictions,
        correctPredictions,
        totalPlayers,
        activePlayers,
        totalGoals,
        totalCards,
        topPredictors,
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

  const MetricCard = ({ title, value, subtitle, icon, color, progress }) => (
    <Card style={[styles.metricCard, { borderTopColor: color, borderTopWidth: 4 }]}>
      <Card.Content>
        <View style={styles.metricHeader}>
          <Avatar.Icon size={48} icon={icon} style={{ backgroundColor: color }} />
          <View style={styles.metricValues}>
            <Text style={styles.metricValue}>{value}</Text>
            <Text style={styles.metricTitle}>{title}</Text>
          </View>
        </View>
        {subtitle && <Text style={styles.metricSubtitle}>{subtitle}</Text>}
        {progress !== undefined && (
          <View style={styles.progressContainer}>
            <ProgressBar progress={progress} color={color} style={styles.progressBar} />
            <Text style={styles.progressText}>{Math.round(progress * 100)}%</Text>
          </View>
        )}
      </Card.Content>
    </Card>
  );

  const StatRow = ({ label, value, color = '#4FC3F7' }) => (
    <View style={styles.statRow}>
      <Text style={styles.statLabel}>{label}</Text>
      <Chip style={[styles.statChip, { backgroundColor: color }]} textStyle={{ color: '#fff' }}>
        {value}
      </Chip>
    </View>
  );

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Advanced Analytics" titleStyle={styles.headerTitle} />
        <Appbar.Action icon="refresh" onPress={onRefresh} />
      </Appbar.Header>

      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header Card */}
        <Card style={styles.headerCard}>
          <Card.Content>
            <Text style={styles.headerTitle}>📊 Business Intelligence Dashboard</Text>
            <Text style={styles.headerSubtitle}>
              Real-time insights and performance metrics
            </Text>
          </Card.Content>
        </Card>

        {/* User Metrics */}
        <Text style={styles.sectionTitle}>👥 User Analytics</Text>
        <View style={styles.metricsGrid}>
          <MetricCard
            title="Total Users"
            value={analytics.totalUsers}
            subtitle={`${analytics.activeUsers} active in last 7 days`}
            icon="account-group"
            color="#4FC3F7"
            progress={analytics.activeUsers / analytics.totalUsers}
          />
          <MetricCard
            title="Admins"
            value={analytics.totalAdmins}
            subtitle={`${((analytics.totalAdmins / analytics.totalUsers) * 100).toFixed(1)}% of users`}
            icon="shield-account"
            color="#f44336"
          />
        </View>

        {/* Match Metrics */}
        <Text style={styles.sectionTitle}>⚽ Match Analytics</Text>
        <View style={styles.metricsGrid}>
          <MetricCard
            title="Total Matches"
            value={analytics.totalMatches}
            subtitle={`${analytics.finishedMatches} completed`}
            icon="soccer"
            color="#66bb6a"
            progress={analytics.finishedMatches / analytics.totalMatches}
          />
          <MetricCard
            title="Live Now"
            value={analytics.liveMatches}
            subtitle={`${analytics.upcomingMatches} upcoming`}
            icon="play-circle"
            color="#ff9800"
          />
        </View>

        {/* Match Events */}
        <Card style={styles.eventsCard}>
          <Card.Content>
            <Text style={styles.cardTitle}>🎯 Match Events Overview</Text>
            <StatRow label="Total Goals Scored" value={analytics.totalGoals} color="#66bb6a" />
            <StatRow label="Cards Issued" value={analytics.totalCards} color="#fbc02d" />
            <StatRow label="Avg Goals per Match" value={(analytics.totalGoals / analytics.finishedMatches || 0).toFixed(1)} color="#4FC3F7" />
          </Card.Content>
        </Card>

        {/* Player Metrics */}
        <Text style={styles.sectionTitle}>🏃 Player Analytics</Text>
        <View style={styles.metricsGrid}>
          <MetricCard
            title="Total Players"
            value={analytics.totalPlayers}
            subtitle={`${analytics.activePlayers} active`}
            icon="account-multiple"
            color="#9c27b0"
            progress={analytics.activePlayers / analytics.totalPlayers}
          />
          <MetricCard
            title="Avg Goals/Player"
            value={(analytics.totalGoals / analytics.activePlayers || 0).toFixed(1)}
            subtitle="Active players only"
            icon="soccer-field"
            color="#00acc1"
          />
        </View>

        {/* Predictions Analytics */}
        <Text style={styles.sectionTitle}>🔮 Prediction Analytics</Text>
        <Card style={styles.predictionsCard}>
          <Card.Content>
            <Text style={styles.cardTitle}>Prediction Accuracy</Text>
            <View style={styles.predictionStats}>
              <View style={styles.predictionItem}>
                <Text style={styles.predictionValue}>{analytics.totalPredictions}</Text>
                <Text style={styles.predictionLabel}>Total</Text>
              </View>
              <View style={styles.predictionItem}>
                <Text style={[styles.predictionValue, { color: '#66bb6a' }]}>
                  {analytics.correctPredictions}
                </Text>
                <Text style={styles.predictionLabel}>Correct</Text>
              </View>
              <View style={styles.predictionItem}>
                <Text style={[styles.predictionValue, { color: '#4FC3F7' }]}>
                  {((analytics.correctPredictions / analytics.totalPredictions) * 100 || 0).toFixed(1)}%
                </Text>
                <Text style={styles.predictionLabel}>Accuracy</Text>
              </View>
            </View>
            <ProgressBar 
              progress={analytics.correctPredictions / analytics.totalPredictions || 0} 
              color="#66bb6a" 
              style={styles.predictionProgress} 
            />
          </Card.Content>
        </Card>

        {/* Top Predictors */}
        {analytics.topPredictors.length > 0 && (
          <Card style={styles.topPredictorsCard}>
            <Card.Content>
              <Text style={styles.cardTitle}>🏆 Top Predictors</Text>
              {analytics.topPredictors.map((predictor, index) => (
                <View key={index} style={styles.predictorItem}>
                  <View style={styles.predictorRank}>
                    <Text style={styles.rankNumber}>#{index + 1}</Text>
                  </View>
                  <View style={styles.predictorInfo}>
                    <Text style={styles.predictorId}>User {predictor.userId.substring(0, 8)}</Text>
                    <Text style={styles.predictorStats}>
                      {predictor.total} predictions • {predictor.accuracy.toFixed(1)}% accuracy
                    </Text>
                  </View>
                  <Chip style={styles.accuracyChip} textStyle={{ color: '#fff' }}>
                    {predictor.accuracy.toFixed(0)}%
                  </Chip>
                </View>
              ))}
            </Card.Content>
          </Card>
        )}

        {/* Footer */}
        <Card style={styles.footerCard}>
          <Card.Content>
            <Text style={styles.footerText}>🌍 Nkoroi to the World 🌍</Text>
            <Text style={styles.footerSubtext}>Last updated: {new Date().toLocaleString()}</Text>
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
    backgroundColor: '#00acc1',
  },
  headerTitle: {
    color: '#fff',
    fontWeight: 'bold',
  },
  content: {
    padding: 15,
    paddingBottom: 30,
  },
  headerCard: {
    marginBottom: 20,
    elevation: 4,
    backgroundColor: '#00acc1',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#e0f7fa',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 15,
  },
  metricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  metricCard: {
    flex: 1,
    marginHorizontal: 5,
    elevation: 3,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  metricValues: {
    marginLeft: 15,
    flex: 1,
  },
  metricValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  metricTitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  metricSubtitle: {
    fontSize: 11,
    color: '#999',
    marginTop: 5,
  },
  progressContainer: {
    marginTop: 10,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 10,
    color: '#666',
    textAlign: 'right',
    marginTop: 4,
  },
  eventsCard: {
    marginBottom: 15,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  statChip: {
    height: 28,
  },
  predictionsCard: {
    marginBottom: 15,
    elevation: 3,
  },
  predictionStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  predictionItem: {
    alignItems: 'center',
  },
  predictionValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  predictionLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  predictionProgress: {
    height: 10,
    borderRadius: 5,
  },
  topPredictorsCard: {
    marginBottom: 15,
    elevation: 3,
  },
  predictorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  predictorRank: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4FC3F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  rankNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  predictorInfo: {
    flex: 1,
  },
  predictorId: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  predictorStats: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  accuracyChip: {
    backgroundColor: '#66bb6a',
  },
  footerCard: {
    marginTop: 20,
    marginBottom: 30,
    backgroundColor: '#E3F2FD',
    elevation: 2,
  },
  footerText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0277BD',
  },
  footerSubtext: {
    textAlign: 'center',
    fontSize: 11,
    color: '#666',
    marginTop: 5,
  },
});

export default SuperAdminAnalyticsScreen;
