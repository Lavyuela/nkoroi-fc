import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, Alert, Share as RNShare } from 'react-native';
import { Text, Appbar, Button, Card } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';
import firestore from '@react-native-firebase/firestore';
import ViewShot from 'react-native-view-shot';
import GraphicTemplate from '../components/GraphicTemplate';

const MatchResultGraphicScreen = ({ route, navigation }) => {
  const { matchId } = route.params;
  const { isAdmin } = useAuth();
  const viewShotRef = useRef();

  const [match, setMatch] = useState(null);
  const [goalScorers, setGoalScorers] = useState([]);

  useEffect(() => {
    if (!isAdmin) {
      navigation.replace('Home');
      return;
    }
    loadMatch();
  }, []);

  const loadMatch = () => {
    const unsubscribe = firestore()
      .collection('matches')
      .doc(matchId)
      .onSnapshot((doc) => {
        if (doc.exists) {
          const matchData = { id: doc.id, ...doc.data() };
          setMatch(matchData);
          extractGoalScorers(matchData);
        }
      });
    return () => unsubscribe();
  };

  const extractGoalScorers = (matchData) => {
    if (!matchData.events) return;
    
    const goals = (Array.isArray(matchData.events) 
      ? matchData.events 
      : Object.values(matchData.events)
    ).filter(event => event.type === 'goal' && event.playerName);
    
    setGoalScorers(goals);
  };

  const getResultTagline = () => {
    if (!match) return 'Full-Time';
    
    const homeScore = match.homeScore || 0;
    const awayScore = match.awayScore || 0;
    
    if (homeScore > awayScore) {
      return '🏆 VICTORY!';
    } else if (homeScore < awayScore) {
      return '💪 Tough Loss';
    } else {
      return '🤝 Draw';
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const captureAndShare = async () => {
    try {
      const uri = await viewShotRef.current.capture();
      await RNShare.share({
        title: 'Match Result',
        message: `${match.homeTeam} ${match.homeScore || 0} - ${match.awayScore || 0} ${match.awayTeam}`,
        url: uri,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share result');
      console.error(error);
    }
  };

  const renderGraphic = () => (
    <ViewShot ref={viewShotRef} options={{ format: 'jpg', quality: 0.9 }}>
      <GraphicTemplate
        title={getResultTagline()}
        subtitle={formatDate(match?.matchDate)}
      >
        {/* Score Display */}
        <View style={styles.scoreContainer}>
          <View style={styles.teamSection}>
            <Text style={styles.teamName}>{match?.homeTeam || 'Home'}</Text>
            <View style={styles.scoreCircle}>
              <Text style={styles.scoreText}>{match?.homeScore || 0}</Text>
            </View>
          </View>

          <Text style={styles.vs}>VS</Text>

          <View style={styles.teamSection}>
            <Text style={styles.teamName}>{match?.awayTeam || 'Away'}</Text>
            <View style={styles.scoreCircle}>
              <Text style={styles.scoreText}>{match?.awayScore || 0}</Text>
            </View>
          </View>
        </View>

        {/* Goal Scorers */}
        {goalScorers.length > 0 && (
          <View style={styles.scorersSection}>
            <Text style={styles.scorersTitle}>⚽ Goal Scorers</Text>
            {goalScorers.map((goal, index) => (
              <View key={index} style={styles.scorerItem}>
                <Text style={styles.scorerName}>
                  {goal.playerName}
                  {goal.jerseyNumber ? ` (#${goal.jerseyNumber})` : ''}
                </Text>
                <Text style={styles.scorerMinute}>{goal.minute}'</Text>
              </View>
            ))}
          </View>
        )}

        {/* Venue */}
        {match?.venue && (
          <View style={styles.venueSection}>
            <Text style={styles.venueIcon}>📍</Text>
            <Text style={styles.venueText}>{match.venue}</Text>
          </View>
        )}

        {/* Full Time Badge */}
        <View style={styles.fullTimeBadge}>
          <Text style={styles.fullTimeText}>FULL TIME</Text>
        </View>
      </GraphicTemplate>
    </ViewShot>
  );

  if (!match) {
    return (
      <View style={styles.container}>
        <Appbar.Header style={styles.header}>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content title="Match Result" />
        </Appbar.Header>
        <View style={styles.loading}>
          <Text>Loading match...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Match Result" />
      </Appbar.Header>

      <ScrollView style={styles.content}>
        {renderGraphic()}

        <View style={styles.actions}>
          <Button
            mode="contained"
            onPress={captureAndShare}
            style={styles.shareButton}
            icon="share"
          >
            Share Result
          </Button>
        </View>
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
    backgroundColor: '#87CEEB',
  },
  content: {
    flex: 1,
    padding: 15,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 40,
  },
  teamSection: {
    alignItems: 'center',
    flex: 1,
  },
  teamName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a472a',
    marginBottom: 20,
    textAlign: 'center',
  },
  scoreCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#87CEEB',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  scoreText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  vs: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#666',
    marginHorizontal: 20,
  },
  scorersSection: {
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    padding: 20,
    marginTop: 30,
  },
  scorersTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a472a',
    marginBottom: 15,
    textAlign: 'center',
  },
  scorerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  scorerName: {
    fontSize: 18,
    color: '#333',
    fontWeight: '600',
  },
  scorerMinute: {
    fontSize: 16,
    color: '#87CEEB',
    fontWeight: 'bold',
  },
  venueSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
  },
  venueIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  venueText: {
    fontSize: 18,
    color: '#666',
  },
  fullTimeBadge: {
    backgroundColor: '#1a472a',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignSelf: 'center',
    marginTop: 30,
  },
  fullTimeText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  actions: {
    marginTop: 20,
    marginBottom: 30,
  },
  shareButton: {
    backgroundColor: '#87CEEB',
  },
});

export default MatchResultGraphicScreen;
