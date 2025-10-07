import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Card, Button, Appbar, Chip, ActivityIndicator, FAB, Portal, Dialog } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';
import { subscribeToMatch, updateMatchScore, updateMatchStatus, addMatchEvent, deleteMatch } from '../services/firebase';
import { scheduleGoalNotification, scheduleMatchStartNotification, scheduleMatchEndNotification } from '../services/notifications';

const MatchDetailScreen = ({ route, navigation }) => {
  const { matchId } = route.params;
  const { isAdmin } = useAuth();
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showScoreDialog, setShowScoreDialog] = useState(false);
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);

  useEffect(() => {
    const unsubscribe = subscribeToMatch(matchId, (matchData) => {
      setMatch(matchData);
      setHomeScore(matchData.homeScore);
      setAwayScore(matchData.awayScore);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [matchId]);

  const handleStartMatch = async () => {
    await updateMatchStatus(matchId, 'live');
    await scheduleMatchStartNotification(match.homeTeam, match.awayTeam);
  };

  const handleEndMatch = async () => {
    await updateMatchStatus(matchId, 'finished');
    const finalScore = `${match.homeScore}-${match.awayScore}`;
    await scheduleMatchEndNotification(match.homeTeam, match.awayTeam, finalScore);
  };

  const handleGoal = async (team) => {
    let newHomeScore = homeScore;
    let newAwayScore = awayScore;

    if (team === 'home') {
      newHomeScore = homeScore + 1;
      setHomeScore(newHomeScore);
    } else {
      newAwayScore = awayScore + 1;
      setAwayScore(newAwayScore);
    }

    await updateMatchScore(matchId, newHomeScore, newAwayScore);
    
    const scoringTeam = team === 'home' ? match.homeTeam : match.awayTeam;
    const score = `${newHomeScore}-${newAwayScore}`;
    await scheduleGoalNotification(scoringTeam, 'Player', score);
    
    await addMatchEvent(matchId, {
      type: 'goal',
      team: scoringTeam,
      description: `Goal scored by ${scoringTeam}`,
    });
  };

  const handleDeleteMatch = () => {
    Alert.alert(
      'Delete Match',
      'Are you sure you want to delete this match?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteMatch(matchId);
            navigation.goBack();
          },
        },
      ]
    );
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
        <Appbar.BackAction onPress={() => navigation.goBack()} color="#fff" />
        <Appbar.Content title="Match Details" titleStyle={styles.headerTitle} />
        {isAdmin && (
          <Appbar.Action icon="delete" onPress={handleDeleteMatch} color="#fff" />
        )}
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.statusContainer}>
              <Chip
                mode="flat"
                style={[styles.statusChip, { backgroundColor: getStatusColor(match.status) }]}
                textStyle={styles.statusText}
              >
                {getStatusLabel(match.status)}
              </Chip>
            </View>

            <View style={styles.scoreContainer}>
              <View style={styles.teamContainer}>
                <Text style={styles.teamName}>{match.homeTeam}</Text>
                <Text style={styles.score}>{match.homeScore}</Text>
                {isAdmin && match.status === 'live' && (
                  <Button
                    mode="contained"
                    onPress={() => handleGoal('home')}
                    style={styles.goalButton}
                    compact
                  >
                    ⚽ Goal
                  </Button>
                )}
              </View>

              <Text style={styles.vs}>VS</Text>

              <View style={styles.teamContainer}>
                <Text style={styles.teamName}>{match.awayTeam}</Text>
                <Text style={styles.score}>{match.awayScore}</Text>
                {isAdmin && match.status === 'live' && (
                  <Button
                    mode="contained"
                    onPress={() => handleGoal('away')}
                    style={styles.goalButton}
                    compact
                  >
                    ⚽ Goal
                  </Button>
                )}
              </View>
            </View>

            {match.venue && (
              <Text style={styles.venue}>📍 {match.venue}</Text>
            )}

            {match.matchDate && (
              <Text style={styles.date}>🕒 {formatDate(match.matchDate)}</Text>
            )}
          </Card.Content>
        </Card>

        {isAdmin && (
          <Card style={styles.adminCard}>
            <Card.Content>
              <Text style={styles.adminTitle}>Admin Controls</Text>
              
              {match.status === 'upcoming' && (
                <Button
                  mode="contained"
                  onPress={handleStartMatch}
                  style={styles.controlButton}
                  icon="play"
                >
                  Start Match
                </Button>
              )}

              {match.status === 'live' && (
                <Button
                  mode="contained"
                  onPress={handleEndMatch}
                  style={[styles.controlButton, styles.endButton]}
                  icon="stop"
                >
                  End Match
                </Button>
              )}
            </Card.Content>
          </Card>
        )}

        {match.events && Object.keys(match.events).length > 0 && (
          <Card style={styles.eventsCard}>
            <Card.Content>
              <Text style={styles.eventsTitle}>Match Events</Text>
              {Object.values(match.events).reverse().map((event, index) => (
                <View key={index} style={styles.eventItem}>
                  <Text style={styles.eventType}>⚽</Text>
                  <Text style={styles.eventDescription}>{event.description}</Text>
                </View>
              ))}
            </Card.Content>
          </Card>
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
  headerTitle: {
    color: '#fff',
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 15,
  },
  card: {
    marginBottom: 15,
    elevation: 3,
  },
  statusContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  statusChip: {
    height: 32,
  },
  statusText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: 20,
  },
  teamContainer: {
    alignItems: 'center',
    flex: 1,
  },
  teamName: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  score: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#1a472a',
    marginBottom: 10,
  },
  vs: {
    fontSize: 16,
    color: '#999',
    fontWeight: 'bold',
    marginHorizontal: 15,
  },
  goalButton: {
    marginTop: 10,
    backgroundColor: '#4caf50',
  },
  venue: {
    fontSize: 14,
    color: '#666',
    marginTop: 15,
    textAlign: 'center',
  },
  date: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
  },
  adminCard: {
    marginBottom: 15,
    elevation: 3,
    backgroundColor: '#fff3e0',
  },
  adminTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#1a472a',
  },
  controlButton: {
    marginTop: 10,
    backgroundColor: '#1a472a',
  },
  endButton: {
    backgroundColor: '#d32f2f',
  },
  eventsCard: {
    marginBottom: 15,
    elevation: 3,
  },
  eventsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#1a472a',
  },
  eventItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  eventType: {
    fontSize: 20,
    marginRight: 10,
  },
  eventDescription: {
    fontSize: 14,
    flex: 1,
  },
});

export default MatchDetailScreen;
