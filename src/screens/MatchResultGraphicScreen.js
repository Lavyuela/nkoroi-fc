import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import Share from 'react-native-share';
import { Text, Appbar, Button, Card, FAB } from 'react-native-paper';
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
      if (!viewShotRef.current) {
        Alert.alert('Error', 'Unable to generate image. Please try again.');
        return;
      }
      
      // Wait for view to render
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const uri = await viewShotRef.current.capture();
      
      await Share.open({
        title: 'Match Result',
        message: `${match.homeTeam} ${match.homeScore || 0} - ${match.awayScore || 0} ${match.awayTeam}`,
        url: `file://${uri}`,
        type: 'image/jpeg',
      });
    } catch (error) {
      if (error.message !== 'User did not share') {
        console.error('Share error:', error);
        Alert.alert('Error', 'Failed to share result: ' + error.message);
      }
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
      </ScrollView>

      {/* Floating Share Button */}
      <FAB
        icon="share"
        label="Share Result"
        style={styles.fab}
        onPress={captureAndShare}
        color="#fff"
      />
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
    paddingVertical: 20,
  },
  teamSection: {
    alignItems: 'center',
    flex: 1,
  },
  teamName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a472a',
    marginBottom: 12,
    textAlign: 'center',
  },
  scoreCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#87CEEB',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    elevation: 4,
  },
  scoreText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  vs: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
    marginHorizontal: 10,
  },
  scorersSection: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 15,
    marginTop: 20,
  },
  scorersTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a472a',
    marginBottom: 10,
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
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  scorerMinute: {
    fontSize: 14,
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
    fontSize: 14,
    color: '#666',
  },
  fullTimeBadge: {
    backgroundColor: '#1a472a',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignSelf: 'center',
    marginTop: 20,
  },
  fullTimeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  actions: {
    marginTop: 20,
    marginBottom: 30,
  },
  shareButton: {
    backgroundColor: '#87CEEB',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 80,
    backgroundColor: '#87CEEB',
  },
});

export default MatchResultGraphicScreen;
