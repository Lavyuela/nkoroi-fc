import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Text, Card, Appbar, Chip, ProgressBar, Divider } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';

const PlayerAnalyticsScreen = ({ route, navigation }) => {
  const { playerId } = route.params;
  const [player, setPlayer] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlayerData();
  }, [playerId]);

  const loadPlayerData = async () => {
    try {
      // Load player info
      const playerDoc = await firestore().collection('players').doc(playerId).get();
      if (playerDoc.exists) {
        setPlayer({ id: playerDoc.id, ...playerDoc.data() });
      }

      // Calculate stats from matches
      const matchesSnapshot = await firestore()
        .collection('matches')
        .where('status', '==', 'finished')
        .get();

      const playerStats = calculatePlayerStats(matchesSnapshot.docs, playerId);
      setStats(playerStats);
    } catch (error) {
      console.error('Error loading player data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculatePlayerStats = (matches, playerId) => {
    let goals = 0;
    let assists = 0;
    let yellowCards = 0;
    let redCards = 0;
    let matchesPlayed = 0;
    let minutesPlayed = 0;
    const recentForm = [];

    matches.forEach(matchDoc => {
      const match = matchDoc.data();
      const events = Array.isArray(match.events) ? match.events : Object.values(match.events || {});
      
      let playedInMatch = false;
      let matchGoals = 0;

      events.forEach(event => {
        if (event.player?.id === playerId || event.playerName?.includes(player?.name)) {
          playedInMatch = true;

          switch (event.type) {
            case 'goal':
              goals++;
              matchGoals++;
              break;
            case 'assist':
              assists++;
              break;
            case 'yellow_card':
              yellowCards++;
              break;
            case 'red_card':
              redCards++;
              break;
          }
        }
      });

      if (playedInMatch) {
        matchesPlayed++;
        minutesPlayed += 90; // Assume full match for now

        // Calculate match rating (simple formula)
        const rating = 6 + (matchGoals * 1.5) - (yellowCards * 0.5) - (redCards * 2);
        recentForm.push({
          matchId: matchDoc.id,
          date: match.matchDate,
          opponent: match.homeTeam === 'Nkoroi FC' ? match.awayTeam : match.homeTeam,
          rating: Math.min(10, Math.max(1, rating)),
          goals: matchGoals,
        });
      }
    });

    // Sort by date and get last 5 matches
    recentForm.sort((a, b) => b.date - a.date);
    const last5Matches = recentForm.slice(0, 5);
    const avgRating = last5Matches.length > 0
      ? last5Matches.reduce((sum, m) => sum + m.rating, 0) / last5Matches.length
      : 0;

    return {
      goals,
      assists,
      yellowCards,
      redCards,
      matchesPlayed,
      minutesPlayed,
      goalsPerMatch: matchesPlayed > 0 ? (goals / matchesPlayed).toFixed(2) : 0,
      avgRating: avgRating.toFixed(1),
      recentForm: last5Matches,
      form: avgRating >= 8 ? 'Excellent' : avgRating >= 7 ? 'Good' : avgRating >= 6 ? 'Average' : 'Poor',
    };
  };

  const getFormColor = (form) => {
    switch (form) {
      case 'Excellent': return '#4caf50';
      case 'Good': return '#8bc34a';
      case 'Average': return '#ff9800';
      case 'Poor': return '#f44336';
      default: return '#999';
    }
  };

  const getRatingColor = (rating) => {
    if (rating >= 8) return '#4caf50';
    if (rating >= 7) return '#8bc34a';
    if (rating >= 6) return '#ff9800';
    return '#f44336';
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Appbar.Header style={styles.header}>
          <Appbar.BackAction onPress={() => navigation.goBack()} color="#fff" />
          <Appbar.Content title="Player Analytics" titleStyle={styles.headerTitle} />
        </Appbar.Header>
        <View style={styles.loadingContainer}>
          <Text>Loading player analytics...</Text>
        </View>
      </View>
    );
  }

  if (!player || !stats) {
    return (
      <View style={styles.container}>
        <Appbar.Header style={styles.header}>
          <Appbar.BackAction onPress={() => navigation.goBack()} color="#fff" />
          <Appbar.Content title="Player Analytics" titleStyle={styles.headerTitle} />
        </Appbar.Header>
        <View style={styles.loadingContainer}>
          <Text>Player not found</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={() => navigation.goBack()} color="#fff" />
        <Appbar.Content title={player.name} titleStyle={styles.headerTitle} />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Player Info Card */}
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.playerHeader}>
              <View style={styles.playerAvatar}>
                <Text style={styles.avatarText}>{player.name.charAt(0)}</Text>
              </View>
              <View style={styles.playerInfo}>
                <Text style={styles.playerName}>{player.name}</Text>
                <Text style={styles.playerPosition}>{player.position || 'Player'}</Text>
                <Chip 
                  mode="flat" 
                  style={[styles.formChip, { backgroundColor: getFormColor(stats.form) }]}
                  textStyle={{ color: '#fff' }}
                >
                  {stats.form} Form
                </Chip>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Overall Rating */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>⭐ Overall Rating</Text>
            <View style={styles.ratingContainer}>
              <Text style={[styles.ratingNumber, { color: getRatingColor(stats.avgRating) }]}>
                {stats.avgRating}
              </Text>
              <Text style={styles.ratingMax}>/10</Text>
            </View>
            <Text style={styles.ratingSubtext}>Based on last 5 matches</Text>
            <ProgressBar 
              progress={stats.avgRating / 10} 
              color={getRatingColor(stats.avgRating)}
              style={styles.progressBar}
            />
          </Card.Content>
        </Card>

        {/* Season Statistics */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>📊 Season Statistics</Text>
            
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{stats.goals}</Text>
                <Text style={styles.statLabel}>⚽ Goals</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{stats.assists}</Text>
                <Text style={styles.statLabel}>🎯 Assists</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{stats.matchesPlayed}</Text>
                <Text style={styles.statLabel}>🏃 Matches</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{stats.goalsPerMatch}</Text>
                <Text style={styles.statLabel}>📈 Goals/Match</Text>
              </View>
            </View>

            <Divider style={styles.divider} />

            <View style={styles.statsRow}>
              <Text style={styles.statsRowLabel}>Minutes Played</Text>
              <Text style={styles.statsRowValue}>{stats.minutesPlayed}'</Text>
            </View>
            <View style={styles.statsRow}>
              <Text style={styles.statsRowLabel}>Yellow Cards</Text>
              <Text style={[styles.statsRowValue, { color: '#ff9800' }]}>
                {stats.yellowCards} 🟨
              </Text>
            </View>
            <View style={styles.statsRow}>
              <Text style={styles.statsRowLabel}>Red Cards</Text>
              <Text style={[styles.statsRowValue, { color: '#f44336' }]}>
                {stats.redCards} 🟥
              </Text>
            </View>
          </Card.Content>
        </Card>

        {/* Recent Form */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>🔥 Recent Form (Last 5 Matches)</Text>
            
            {stats.recentForm.length === 0 ? (
              <Text style={styles.emptyText}>No recent matches</Text>
            ) : (
              stats.recentForm.map((match, index) => (
                <View key={index} style={styles.formItem}>
                  <View style={styles.formLeft}>
                    <Text style={styles.formOpponent}>{match.opponent}</Text>
                    <Text style={styles.formDate}>
                      {new Date(match.date).toLocaleDateString()}
                    </Text>
                  </View>
                  <View style={styles.formRight}>
                    {match.goals > 0 && (
                      <Chip mode="flat" style={styles.goalsChip}>
                        ⚽ {match.goals}
                      </Chip>
                    )}
                    <View style={[styles.ratingBadge, { backgroundColor: getRatingColor(match.rating) }]}>
                      <Text style={styles.ratingBadgeText}>{match.rating.toFixed(1)}</Text>
                    </View>
                  </View>
                </View>
              ))
            )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    marginBottom: 15,
    elevation: 3,
  },
  playerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playerAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#87CEEB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  playerPosition: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  formChip: {
    alignSelf: 'flex-start',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#1a472a',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    marginVertical: 10,
  },
  ratingNumber: {
    fontSize: 64,
    fontWeight: 'bold',
  },
  ratingMax: {
    fontSize: 32,
    color: '#999',
    marginLeft: 5,
  },
  ratingSubtext: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
    marginBottom: 10,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a472a',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  divider: {
    marginVertical: 15,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  statsRowLabel: {
    fontSize: 16,
    color: '#666',
  },
  statsRowValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  formItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  formLeft: {
    flex: 1,
  },
  formOpponent: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  formDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  formRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  goalsChip: {
    backgroundColor: '#4caf50',
    marginRight: 8,
  },
  ratingBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  ratingBadgeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontStyle: 'italic',
    paddingVertical: 20,
  },
  footer: {
    textAlign: 'center',
    color: '#999',
    fontSize: 12,
    marginTop: 10,
    marginBottom: 20,
  },
});

export default PlayerAnalyticsScreen;
