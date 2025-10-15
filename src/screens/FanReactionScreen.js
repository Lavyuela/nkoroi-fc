import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, Alert, Share as RNShare, TouchableOpacity } from 'react-native';
import { Text, Appbar, Button, TextInput, Card } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';
import firestore from '@react-native-firebase/firestore';
import ViewShot from 'react-native-view-shot';
import GraphicTemplate from '../components/GraphicTemplate';

const REACTIONS = [
  { emoji: '🔥', label: 'Fire' },
  { emoji: '💪', label: 'Strong' },
  { emoji: '❤️', label: 'Love' },
  { emoji: '👏', label: 'Applause' },
  { emoji: '😢', label: 'Sad' },
  { emoji: '⚡', label: 'Electric' },
  { emoji: '🎉', label: 'Celebrate' },
  { emoji: '💯', label: 'Perfect' },
];

const FanReactionScreen = ({ route, navigation }) => {
  const { matchId } = route.params;
  const { user } = useAuth();
  const viewShotRef = useRef();

  const [match, setMatch] = useState(null);
  const [reactionText, setReactionText] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('🔥');
  const [goalScorers, setGoalScorers] = useState([]);

  useEffect(() => {
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
    if (!reactionText.trim()) {
      Alert.alert('Error', 'Please add your reaction text');
      return;
    }

    if (reactionText.length > 50) {
      Alert.alert('Error', 'Reaction text must be 50 characters or less');
      return;
    }

    try {
      const uri = await viewShotRef.current.capture();
      
      // Save reaction to Firestore
      await firestore().collection('reactions').add({
        matchId,
        userId: user.uid,
        userName: user.displayName || user.email,
        reactionText,
        emoji: selectedEmoji,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });

      await RNShare.share({
        title: 'My Reaction',
        message: `${selectedEmoji} ${reactionText}\n\n${match.homeTeam} ${match.homeScore || 0} - ${match.awayScore || 0} ${match.awayTeam}`,
        url: uri,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share reaction');
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

        {/* Fan Reaction Overlay */}
        <View style={styles.reactionOverlay}>
          <Text style={styles.reactionEmoji}>{selectedEmoji}</Text>
          <Text style={styles.reactionText}>{reactionText}</Text>
          <Text style={styles.fanName}>- {user?.displayName || user?.email || 'Fan'}</Text>
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
          <Appbar.Content title="React & Share" />
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
        <Appbar.Content title="React & Share" />
      </Appbar.Header>

      <ScrollView style={styles.content}>
        {/* Reaction Text Input */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.label}>Your Reaction (Max 50 characters)</Text>
            <TextInput
              value={reactionText}
              onChangeText={setReactionText}
              mode="outlined"
              placeholder="e.g., We move!, Unstoppable!"
              maxLength={50}
            />
            <Text style={styles.charCount}>{reactionText.length}/50</Text>
          </Card.Content>
        </Card>

        {/* Emoji Selector */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.label}>Choose Reaction</Text>
            <View style={styles.emojiGrid}>
              {REACTIONS.map((reaction) => (
                <TouchableOpacity
                  key={reaction.emoji}
                  style={[
                    styles.emojiButton,
                    selectedEmoji === reaction.emoji && styles.emojiButtonSelected,
                  ]}
                  onPress={() => setSelectedEmoji(reaction.emoji)}
                >
                  <Text style={styles.emojiIcon}>{reaction.emoji}</Text>
                  <Text style={styles.emojiLabel}>{reaction.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </Card.Content>
        </Card>

        {/* Preview */}
        {renderGraphic()}

        {/* Actions */}
        <View style={styles.actions}>
          <Button
            mode="contained"
            onPress={captureAndShare}
            style={styles.shareButton}
            icon="share"
            disabled={!reactionText.trim()}
          >
            Share My Reaction
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
  card: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1a472a',
  },
  charCount: {
    textAlign: 'right',
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  emojiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  emojiButton: {
    width: '23%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ddd',
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  emojiButtonSelected: {
    borderColor: '#87CEEB',
    backgroundColor: '#E3F2FD',
  },
  emojiIcon: {
    fontSize: 32,
    marginBottom: 5,
  },
  emojiLabel: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
  },
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 30,
  },
  teamSection: {
    alignItems: 'center',
    flex: 1,
  },
  teamName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a472a',
    marginBottom: 15,
    textAlign: 'center',
  },
  scoreCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#87CEEB',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  scoreText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  vs: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
    marginHorizontal: 15,
  },
  reactionOverlay: {
    backgroundColor: 'rgba(135, 206, 235, 0.9)',
    borderRadius: 15,
    padding: 20,
    marginVertical: 20,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  reactionEmoji: {
    fontSize: 48,
    marginBottom: 10,
  },
  reactionText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 10,
  },
  fanName: {
    fontSize: 16,
    color: '#FFFFFF',
    fontStyle: 'italic',
  },
  scorersSection: {
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    padding: 15,
    marginTop: 20,
  },
  scorersTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a472a',
    marginBottom: 10,
    textAlign: 'center',
  },
  scorerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
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
  fullTimeBadge: {
    backgroundColor: '#1a472a',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 20,
    alignSelf: 'center',
    marginTop: 20,
  },
  fullTimeText: {
    color: '#FFFFFF',
    fontSize: 16,
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

export default FanReactionScreen;
