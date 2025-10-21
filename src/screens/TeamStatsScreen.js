import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Image, RefreshControl } from 'react-native';
import { Text, Card, Appbar, Avatar, ProgressBar } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';

const TeamStatsScreen = ({ navigation }) => {
  const [stats, setStats] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    // Set up real-time listener for matches
    const unsubscribe = firestore()
      .collection('matches')
      .onSnapshot((snapshot) => {
        const matches = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        calculateStats(matches);
        console.log('✅ Team stats updated automatically');
      }, (error) => {
        console.log('Error loading stats:', error);
        setStats(getDefaultStats());
      });
    
    return () => unsubscribe();
  }, []);

  const loadStats = async () => {
    try {
      setRefreshing(true);
      const matchesSnapshot = await firestore().collection('matches').get();
      const matches = matchesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      calculateStats(matches);
      setRefreshing(false);
    } catch (error) {
      console.log('Error loading stats:', error);
      setStats(getDefaultStats());
      setRefreshing(false);
    }
  };

  const getDefaultStats = () => ({
    totalMatches: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    goalsScored: 0,
    goalsConceded: 0,
    winRate: 0,
  });

  const calculateStats = (matches) => {
    const finishedMatches = matches.filter(m => m.status === 'finished');
    let wins = 0, draws = 0, losses = 0, goalsScored = 0, goalsConceded = 0;

    finishedMatches.forEach(match => {
      // Check if Nkoroi FC is home or away team
      const isHome = match.homeTeam?.toLowerCase().includes('nkoroi');
      const isAway = match.awayTeam?.toLowerCase().includes('nkoroi');
      
      if (isHome) {
        // Nkoroi FC is home team
        goalsScored += match.homeScore || 0;
        goalsConceded += match.awayScore || 0;
        
        if (match.homeScore > match.awayScore) wins++;
        else if (match.homeScore === match.awayScore) draws++;
        else losses++;
      } else if (isAway) {
        // Nkoroi FC is away team
        goalsScored += match.awayScore || 0;
        goalsConceded += match.homeScore || 0;
        
        if (match.awayScore > match.homeScore) wins++;
        else if (match.awayScore === match.homeScore) draws++;
        else losses++;
      }
    });

    const totalMatches = finishedMatches.length;
    const winRate = totalMatches > 0 ? (wins / totalMatches) * 100 : 0;

    setStats({
      totalMatches,
      wins,
      draws,
      losses,
      goalsScored,
      goalsConceded,
      winRate: Math.round(winRate),
    });
  };

  if (!stats) {
    return <View style={styles.container}><Text>Loading...</Text></View>;
  }

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={() => navigation.goBack()} color="#fff" />
        <Appbar.Content title="Team Statistics" titleStyle={styles.headerTitle} />
      </Appbar.Header>

      <ScrollView 
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={loadStats} />
        }
      >
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.logoContainer}>
              <Avatar.Text size={80} label="NFC" style={styles.avatar} />
              <Text style={styles.teamName}>Nkoroi FC</Text>
              <Text style={styles.season}>2024/25 Season</Text>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>📊 Overall Statistics</Text>
            
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Matches Played</Text>
              <Text style={styles.statValue}>{stats.totalMatches}</Text>
            </View>

            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Wins</Text>
              <Text style={[styles.statValue, styles.winText]}>{stats.wins}</Text>
            </View>

            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Draws</Text>
              <Text style={[styles.statValue, styles.drawText]}>{stats.draws}</Text>
            </View>

            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Losses</Text>
              <Text style={[styles.statValue, styles.lossText]}>{stats.losses}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Goals Scored</Text>
              <Text style={styles.statValue}>{stats.goalsScored}</Text>
            </View>

            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Goals Conceded</Text>
              <Text style={styles.statValue}>{stats.goalsConceded}</Text>
            </View>

            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Goal Difference</Text>
              <Text style={[styles.statValue, stats.goalsScored - stats.goalsConceded >= 0 ? styles.winText : styles.lossText]}>
                {stats.goalsScored - stats.goalsConceded > 0 ? '+' : ''}{stats.goalsScored - stats.goalsConceded}
              </Text>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>🏆 Win Rate</Text>
            <Text style={styles.winRateText}>{stats.winRate.toFixed(1)}%</Text>
            <ProgressBar 
              progress={stats.winRate / 100} 
              color="#4caf50" 
              style={styles.progressBar}
            />
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>📈 Form Guide</Text>
            <Text style={styles.formText}>Last 5 Matches</Text>
            <View style={styles.formContainer}>
              <View style={[styles.formBadge, styles.winBadge]}><Text style={styles.formBadgeText}>W</Text></View>
              <View style={[styles.formBadge, styles.winBadge]}><Text style={styles.formBadgeText}>W</Text></View>
              <View style={[styles.formBadge, styles.drawBadge]}><Text style={styles.formBadgeText}>D</Text></View>
              <View style={[styles.formBadge, styles.winBadge]}><Text style={styles.formBadgeText}>W</Text></View>
              <View style={[styles.formBadge, styles.lossBadge]}><Text style={styles.formBadgeText}>L</Text></View>
            </View>
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
    backgroundColor: '#4FC3F7',
  },
  headerTitle: {
    color: '#fff',
    fontWeight: 'bold',
  },
  content: {
    padding: 15,
  },
  card: {
    marginBottom: 15,
    elevation: 3,
  },
  logoContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  avatar: {
    backgroundColor: '#4FC3F7',
    marginBottom: 15,
  },
  teamName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0277BD',
    marginBottom: 5,
  },
  season: {
    fontSize: 14,
    color: '#666',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#0277BD',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  statLabel: {
    fontSize: 16,
    color: '#666',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  winText: {
    color: '#4caf50',
  },
  drawText: {
    color: '#ff9800',
  },
  lossText: {
    color: '#f44336',
  },
  divider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 10,
  },
  winRateText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#4caf50',
    textAlign: 'center',
    marginBottom: 15,
  },
  progressBar: {
    height: 10,
    borderRadius: 5,
  },
  formText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  formContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  formBadge: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formBadgeText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  winBadge: {
    backgroundColor: '#4caf50',
  },
  drawBadge: {
    backgroundColor: '#ff9800',
  },
  lossBadge: {
    backgroundColor: '#f44336',
  },
});

export default TeamStatsScreen;
