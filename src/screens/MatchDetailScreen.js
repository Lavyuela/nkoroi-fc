import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, Linking, Share, TouchableOpacity, Platform } from 'react-native';
import { Text, Card, Button, Appbar, Chip, ActivityIndicator, FAB, Portal, Dialog, TextInput } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';
import notifee, { AndroidImportance } from '@notifee/react-native';
import { getMatch, updateMatch, addMatchEvent, deleteMatch } from '../services/firebaseService';
import firestore from '@react-native-firebase/firestore';

const MatchDetailScreen = ({ route, navigation }) => {
  const { matchId } = route.params;
  const { isAdmin } = useAuth();
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showScoreDialog, setShowScoreDialog] = useState(false);
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  const [userPrediction, setUserPrediction] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentMinute, setCurrentMinute] = useState(0);
  const [showMinuteDialog, setShowMinuteDialog] = useState(false);
  const [tempMinute, setTempMinute] = useState('');
  const [allPlayers, setAllPlayers] = useState([]);
  const [players, setPlayers] = useState([]);
  const [showPlayerDialog, setShowPlayerDialog] = useState(false);
  const [pendingEvent, setPendingEvent] = useState(null);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [substitutionStep, setSubstitutionStep] = useState(null); // 'out' or 'in'
  const [playerOut, setPlayerOut] = useState(null);

  useEffect(() => {
    loadMatch();
    loadUserPreferences();
    
    // Load all players with real-time listener
    const unsubscribe = firestore()
      .collection('players')
      .orderBy('name', 'asc')
      .onSnapshot((snapshot) => {
        const playersList = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          if (data.active !== false) {
            playersList.push({
              id: doc.id,
              ...data,
            });
          }
        });
        setAllPlayers(playersList);
      });
    
    return () => unsubscribe();
  }, [matchId]);

  // Filter players based on match lineup and substitution step
  useEffect(() => {
    if (match && match.lineup && match.lineup.length > 0) {
      const lineupPlayerIds = match.lineup.map(p => p.id);
      
      // For substitution IN, show bench players (NOT in lineup)
      if (substitutionStep === 'in') {
        const benchPlayers = allPlayers.filter(p => !lineupPlayerIds.includes(p.id));
        setPlayers(benchPlayers);
      } else {
        // For substitution OUT or other events, show lineup players
        const filteredPlayers = allPlayers.filter(p => lineupPlayerIds.includes(p.id));
        setPlayers(filteredPlayers);
      }
    } else {
      // If no lineup, show all players
      setPlayers(allPlayers);
    }
  }, [match, allPlayers, substitutionStep]);

  useEffect(() => {
    if (match && match.currentMinute !== undefined) {
      setCurrentMinute(match.currentMinute);
    }
    
    // Setup notification channel for Android
    setupNotificationChannel();
  }, [match]);

  const setupNotificationChannel = async () => {
    if (Platform.OS === 'android') {
      await notifee.createChannel({
        id: 'match-events',
        name: 'Match Events',
        importance: AndroidImportance.HIGH,
        vibration: true,
        vibrationPattern: [300, 500],
        sound: 'default',
      });
    }
  };

  const loadMatch = async () => {
    try {
      // Real-time listener for match updates
      const unsubscribe = firestore()
        .collection('matches')
        .doc(matchId)
        .onSnapshot((doc) => {
          if (doc.exists) {
            const matchData = { id: doc.id, ...doc.data() };
            setMatch(matchData);
            setHomeScore(matchData.homeScore || 0);
            setAwayScore(matchData.awayScore || 0);
          }
          setLoading(false);
        });
      
      return unsubscribe;
    } catch (error) {
      console.log('Error loading match:', error);
      setLoading(false);
    }
  };

  const updateMatchData = async (updates) => {
    try {
      const result = await updateMatch(matchId, updates);
      if (!result.success) {
        Alert.alert('Error', result.error || 'Failed to update match');
      }
    } catch (error) {
      console.log('Error updating match:', error);
    }
  };

  const addEvent = async (eventType, team, description, minute, playerData = null) => {
    const newEvent = {
      type: eventType,
      team: team,
      description: description,
      player: description, // For notification formatting
      timestamp: Date.now(),
      minute: minute || calculateMatchMinute(),
    };
    
    // Add player information if provided
    if (playerData) {
      newEvent.playerId = playerData.id;
      newEvent.playerName = playerData.name;
      newEvent.jerseyNumber = playerData.jerseyNumber;
      newEvent.description = `${playerData.name}${playerData.jerseyNumber ? ` (#${playerData.jerseyNumber})` : ''} - ${description}`;
      newEvent.player = playerData.name;
    }
    
    // Use Firebase function which sends notifications automatically
    const result = await addMatchEvent(matchId, newEvent);
    
    if (!result.success) {
      Alert.alert('Error', result.error || 'Failed to add event');
    }
    
    // Auto-share all events to WhatsApp
    shareEventToWhatsApp(newEvent);
  };

  const calculateMatchMinute = () => {
    // Return the manually set current minute instead of auto-calculating
    return currentMinute;
  };

  const updateMatchMinute = (minute) => {
    const min = parseInt(minute);
    if (min >= 0 && min <= 120) { // Allow up to 120 minutes (90 + extra time)
      setCurrentMinute(min);
      updateMatchData({ currentMinute: min });
    }
  };

  const incrementMinute = () => {
    if (currentMinute < 120) {
      const newMinute = currentMinute + 1;
      setCurrentMinute(newMinute);
      updateMatchData({ currentMinute: newMinute });
    }
  };

  const decrementMinute = () => {
    if (currentMinute > 0) {
      const newMinute = currentMinute - 1;
      setCurrentMinute(newMinute);
      updateMatchData({ currentMinute: newMinute });
    }
  };

  const shareEventToWhatsApp = async (event) => {
    try {
      // Get event-specific emoji and title
      const eventEmoji = getEventIcon(event.type);
      const eventTitle = event.type.toUpperCase().replace('_', ' ');
      
      // Build message with match details
      const message = `${eventEmoji} *${eventTitle}*\n\n${match.homeTeam} ${match.homeScore} - ${match.awayScore} ${match.awayTeam}\n📍 ${match.venue || 'Stadium'}\n\n${event.description}\n⏱️ ${event.minute}'\n\n_Follow live updates on Nkoroi FC App!_`;
      
      // Check if WhatsApp is available
      const whatsappUrl = `whatsapp://send?text=${encodeURIComponent(message)}`;
      const canOpen = await Linking.canOpenURL(whatsappUrl);
      
      if (canOpen) {
        // Open WhatsApp immediately
        await Linking.openURL(whatsappUrl);
      } else {
        // Fallback: Use Share API
        await Share.share({
          message: message,
          title: `${eventEmoji} ${eventTitle}`,
        });
      }
    } catch (error) {
      console.log('Share error:', error);
      // Last resort: Try Share API
      try {
        await Share.share({
          message: `${getEventIcon(event.type)} ${event.type.toUpperCase()}: ${event.description}`,
        });
      } catch (shareError) {
        console.log('Share fallback error:', shareError);
      }
    }
  };

  const getEventIcon = (type) => {
    const icons = {
      goal: '⚽',
      yellow_card: '🟨',
      red_card: '🟥',
      substitution: '🔄',
      injury: '🏥',
      penalty: '⚠️',
      corner: '🚩',
      offside: '🚫',
      free_kick: '🦶',
      kickoff: '🏁',
      halftime: '⏸️',
      fulltime: '🏆',
    };
    return icons[type] || '📝';
  };

  const handleStartMatch = async () => {
    const startTime = Date.now();
    setCurrentMinute(0);
    await updateMatchData({ status: 'live', matchStartTime: startTime, currentMinute: 0 });
    await addEvent('kickoff', match.homeTeam, `Match started: ${match.homeTeam} vs ${match.awayTeam}`, 0);
  };

  const handleEndMatch = async () => {
    await updateMatchData({ status: 'finished' });
    const finalScore = `${match.homeScore}-${match.awayScore}`;
    await addEvent('fulltime', match.homeTeam, `Full Time: ${match.homeTeam} ${finalScore} ${match.awayTeam}`);
  };

  const shareMatchToWhatsApp = async () => {
    let message = '';
    
    if (match.status === 'upcoming') {
      message = `⚽ *Upcoming Match*\n\n${match.homeTeam} vs ${match.awayTeam}\n📍 ${match.venue}\n📅 ${new Date(match.matchDate).toLocaleString()}\n\n_Follow live on Nkoroi FC App!_`;
    } else if (match.status === 'live') {
      message = `🔴 *LIVE NOW*\n\n${match.homeTeam} ${match.homeScore} - ${match.awayScore} ${match.awayTeam}\n📍 ${match.venue}\n\n_Follow live updates on Nkoroi FC App!_`;
    } else {
      message = `🏆 *Full Time*\n\n${match.homeTeam} ${match.homeScore} - ${match.awayScore} ${match.awayTeam}\n📍 ${match.venue}\n\n_Match report on Nkoroi FC App_`;
      
      // Send notification for finished match result
      if (isAdmin) {
        const functions = require('@react-native-firebase/functions').default;
        console.log('🔔 Sending match result notification...');
        
        functions().httpsCallable('sendCustomNotification')({
          title: '🏆 Full Time Result!',
          body: `${match.homeTeam} ${match.homeScore} - ${match.awayScore} ${match.awayTeam}`,
          topic: 'team_updates',
          channelId: 'match_updates',
        }).then((result) => {
          console.log('✅ Match result notification sent to all fans:', result);
        }).catch((notifError) => {
          console.error('❌ Notification error:', notifError);
        });
      }
    }
    
    try {
      const whatsappUrl = `whatsapp://send?text=${encodeURIComponent(message)}`;
      const canOpen = await Linking.canOpenURL(whatsappUrl);
      
      if (canOpen) {
        await Linking.openURL(whatsappUrl);
      } else {
        await Share.share({ message });
      }
    } catch (error) {
      try {
        await Share.share({ message });
      } catch (shareError) {
        Alert.alert('Error', 'Failed to share match');
      }
    }
  };

  const undoLastGoal = async () => {
    Alert.alert(
      'Undo Last Goal',
      'Remove the last goal scored? This will reduce the score by 1.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Undo Goal',
          style: 'destructive',
          onPress: async () => {
            try {
              // Find the last goal event
              const events = Array.isArray(match.events) ? [...match.events] : Object.values(match.events);
              const lastGoalIndex = events.map((e, i) => e?.type === 'goal' ? i : -1).filter(i => i !== -1).pop();
              
              if (lastGoalIndex === undefined || lastGoalIndex === -1) {
                Alert.alert('No Goals', 'No goals to undo');
                return;
              }
              
              const lastGoal = events[lastGoalIndex];
              const teamName = lastGoal.team;
              const isHome = teamName === match.homeTeam;
              
              // Reduce score
              const newHomeScore = isHome ? Math.max(0, match.homeScore - 1) : match.homeScore;
              const newAwayScore = !isHome ? Math.max(0, match.awayScore - 1) : match.awayScore;
              
              // Remove the goal event
              events.splice(lastGoalIndex, 1);
              
              // Update match
              await updateMatch(matchId, {
                homeScore: newHomeScore,
                awayScore: newAwayScore,
                events: events,
              });
              
              Alert.alert('Success', 'Last goal removed');
            } catch (error) {
              console.error('Error undoing goal:', error);
              Alert.alert('Error', 'Failed to undo goal');
            }
          },
        },
      ]
    );
  };

  const handleGoal = async (team, player = null) => {
    const newHomeScore = team === 'home' ? match.homeScore + 1 : match.homeScore;
    const newAwayScore = team === 'away' ? match.awayScore + 1 : match.awayScore;
    const score = `${newHomeScore}-${newAwayScore}`;
    const scoringTeam = team === 'home' ? match.homeTeam : match.awayTeam;
    
    await updateMatch(matchId, {
      homeScore: newHomeScore,
      awayScore: newAwayScore,
    });
    
    // Check if scoring team is Nkoroi FC (whether home or away)
    const isNkoroiFC = scoringTeam.toLowerCase().includes('nkoroi');
    
    // Only show player selection for Nkoroi FC
    if (isNkoroiFC && players.length > 0 && !player) {
      // Show player selection for goal
      setPendingEvent({ 
        eventType: 'goal', 
        team, 
        description: `GOAL! ${score}`,
        homeScore: newHomeScore,
        awayScore: newAwayScore
      });
      setShowPlayerDialog(true);
    } else {
      // For opponent or when no players, just add the event directly
      await addEvent('goal', scoringTeam, `GOAL! ${scoringTeam} scores! ${score}`, null, player);
    }
  };

  const showPlayerSelection = (eventType, team, description) => {
    setPendingEvent({ eventType, team, description });
    setShowPlayerDialog(true);
  };

  const handlePlayerSelected = async (player) => {
    // Handle substitution two-step process
    if (pendingEvent && pendingEvent.type === 'substitution') {
      if (substitutionStep === 'out') {
        // First step: player going off
        setPlayerOut(player);
        setSubstitutionStep('in');
        // Keep dialog open for second selection
        return;
      } else if (substitutionStep === 'in' && playerOut) {
        // Second step: player coming in
        setShowPlayerDialog(false);
        const teamName = pendingEvent.teamName;
        const description = `🔄 ${playerOut.name} OFF ➡️ ${player.name} ON`;
        await addEvent('substitution', teamName, description, null, player, playerOut);
        setSubstitutionStep(null);
        setPlayerOut(null);
        setPendingEvent(null);
        return;
      }
    }
    
    // Handle other events normally
    setShowPlayerDialog(false);
    if (pendingEvent && player) {
      const teamName = pendingEvent.team === 'home' ? match.homeTeam : match.awayTeam;
      
      // Special handling for goals (already updated score)
      if (pendingEvent.eventType === 'goal') {
        const score = `${pendingEvent.homeScore}-${pendingEvent.awayScore}`;
        await addEvent('goal', teamName, `GOAL! ${teamName} scores! ${score}`, null, player);
      } else {
        await addEvent(pendingEvent.eventType, teamName, pendingEvent.description, null, player);
      }
    }
    setPendingEvent(null);
    setSelectedPlayer(null);
    setSubstitutionStep(null);
    setPlayerOut(null);
  };

  const handleYellowCard = async (team) => {
    const teamName = team === 'home' ? match.homeTeam : match.awayTeam;
    // Check if team is Nkoroi FC (whether home or away)
    const isNkoroiFC = teamName.toLowerCase().includes('nkoroi');
    
    // Only show player selection for Nkoroi FC
    if (isNkoroiFC && players.length > 0) {
      showPlayerSelection('yellow_card', team, 'Yellow card');
    } else {
      await addEvent('yellow_card', teamName, `Yellow card for ${teamName}`);
    }
  };

  const handleRedCard = async (team) => {
    const teamName = team === 'home' ? match.homeTeam : match.awayTeam;
    // Check if team is Nkoroi FC (whether home or away)
    const isNkoroiFC = teamName.toLowerCase().includes('nkoroi');
    
    // Only show player selection for Nkoroi FC
    if (isNkoroiFC && players.length > 0) {
      showPlayerSelection('red_card', team, 'Red card');
    } else {
      await addEvent('red_card', teamName, `Red card! ${teamName} player sent off`);
    }
  };

  const handleSubstitution = async (team) => {
    const teamName = team === 'home' ? match.homeTeam : match.awayTeam;
    // Check if team is Nkoroi FC (whether home or away)
    const isNkoroiFC = teamName.toLowerCase().includes('nkoroi');
    
    // Only show player selection for Nkoroi FC
    if (isNkoroiFC && players.length > 0) {
      setSubstitutionStep('out');
      setPlayerOut(null);
      setPendingEvent({ type: 'substitution', team, teamName });
      setShowPlayerDialog(true);
    } else {
      await addEvent('substitution', teamName, `Substitution for ${teamName}`);
    }
  };

  const handleInjury = async (team) => {
    const teamName = team === 'home' ? match.homeTeam : match.awayTeam;
    // Check if team is Nkoroi FC (whether home or away)
    const isNkoroiFC = teamName.toLowerCase().includes('nkoroi');
    
    // Only show player selection for Nkoroi FC
    if (isNkoroiFC && players.length > 0) {
      showPlayerSelection('injury', team, 'Injury stoppage');
    } else {
      await addEvent('injury', teamName, `Injury stoppage - ${teamName} player down`);
    }
  };

  const handlePenalty = async (team) => {
    const teamName = team === 'home' ? match.homeTeam : match.awayTeam;
    // Check if team is Nkoroi FC (whether home or away)
    const isNkoroiFC = teamName.toLowerCase().includes('nkoroi');
    
    // Only show player selection for Nkoroi FC
    if (isNkoroiFC && players.length > 0) {
      showPlayerSelection('penalty', team, 'Penalty awarded');
    } else {
      await addEvent('penalty', teamName, `Penalty awarded to ${teamName}!`);
    }
  };

  const handleCorner = async (team) => {
    const teamName = team === 'home' ? match.homeTeam : match.awayTeam;
    // Check if team is Nkoroi FC (whether home or away)
    const isNkoroiFC = teamName.toLowerCase().includes('nkoroi');
    
    // Only show player selection for Nkoroi FC (player taking corner)
    if (isNkoroiFC && players.length > 0) {
      showPlayerSelection('corner', team, 'Corner kick');
    } else {
      await addEvent('corner', teamName, `Corner kick for ${teamName}`);
    }
  };

  const handleHalftime = async () => {
    const score = `${match.homeScore}-${match.awayScore}`;
    await addEvent('halftime', match.homeTeam, `Half Time: ${match.homeTeam} ${score} ${match.awayTeam}`);
  };

  const loadUserPreferences = async () => {
    try {
      // Load predictions
      const savedPredictions = await AsyncStorage.getItem('userPredictions');
      if (savedPredictions) {
        const predictions = JSON.parse(savedPredictions);
        if (predictions[matchId]) {
          setUserPrediction(predictions[matchId]);
        }
      }

      // Load favorites
      const savedFavorites = await AsyncStorage.getItem('favoriteMatches');
      if (savedFavorites) {
        const favorites = JSON.parse(savedFavorites);
        setIsFavorite(favorites.includes(matchId));
      }
    } catch (error) {
      console.log('Error loading user preferences:', error);
    }
  };

  const toggleFavorite = async () => {
    try {
      const newFavoriteState = !isFavorite;
      setIsFavorite(newFavoriteState);
      
      const savedFavorites = await AsyncStorage.getItem('favoriteMatches');
      let favorites = savedFavorites ? JSON.parse(savedFavorites) : [];
      
      if (newFavoriteState) {
        // Add to favorites
        if (!favorites.includes(matchId)) {
          favorites.push(matchId);
        }
        // Send notification
        await Notifications.scheduleNotificationAsync({
          content: {
            title: '⭐ Match Followed!',
            body: `You're now following ${match.homeTeam} vs ${match.awayTeam}`,
            sound: true,
          },
          trigger: null,
        });
      } else {
        // Remove from favorites
        favorites = favorites.filter(id => id !== matchId);
      }
      
      await AsyncStorage.setItem('favoriteMatches', JSON.stringify(favorites));
    } catch (error) {
      console.log('Error toggling favorite:', error);
    }
  };

  const makePrediction = async (prediction) => {
    try {
      setUserPrediction(prediction);
      
      const savedPredictions = await AsyncStorage.getItem('userPredictions');
      const predictions = savedPredictions ? JSON.parse(savedPredictions) : {};
      
      predictions[matchId] = prediction;
      await AsyncStorage.setItem('userPredictions', JSON.stringify(predictions));
      
      // Send notification
      const predictionText = prediction === 'home' ? match.homeTeam : 
                            prediction === 'draw' ? 'Draw' : match.awayTeam;
      
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '🎯 Prediction Saved!',
          body: `You predicted: ${predictionText}`,
          sound: true,
        },
        trigger: null,
      });
    } catch (error) {
      console.log('Error saving prediction:', error);
    }
  };

  const handleDeleteMatch = () => {
    Alert.alert(
      'Delete Match',
      'Are you sure you want to delete this match? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const result = await deleteMatch(matchId);
              if (result.success) {
                Alert.alert('Success', 'Match deleted successfully');
                navigation.goBack();
              } else {
                Alert.alert('Error', result.error || 'Failed to delete match');
              }
            } catch (error) {
              console.log('Error deleting match:', error);
              Alert.alert('Error', 'Failed to delete match');
            }
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
        <ActivityIndicator size="large" color="#4FC3F7" />
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

        {!isAdmin && match.status === 'upcoming' && (
          <Card style={styles.fanCard}>
            <Card.Content>
              <Text style={styles.fanTitle}>🎯 Make Your Prediction</Text>
              <Text style={styles.fanSubtitle}>Who will win?</Text>
              <View style={styles.predictionRow}>
                <Button
                  mode={userPrediction === 'home' ? 'contained' : 'outlined'}
                  onPress={() => makePrediction('home')}
                  style={styles.predictionButton}
                >
                  {match.homeTeam}
                </Button>
                <Button
                  mode={userPrediction === 'draw' ? 'contained' : 'outlined'}
                  onPress={() => makePrediction('draw')}
                  style={styles.predictionButton}
                >
                  Draw
                </Button>
                <Button
                  mode={userPrediction === 'away' ? 'contained' : 'outlined'}
                  onPress={() => makePrediction('away')}
                  style={styles.predictionButton}
                >
                  {match.awayTeam}
                </Button>
              </View>
              {userPrediction && (
                <Text style={styles.predictionConfirm}>
                  ✅ You predicted: {userPrediction === 'home' ? match.homeTeam : userPrediction === 'draw' ? 'Draw' : match.awayTeam}
                </Text>
              )}
            </Card.Content>
          </Card>
        )}

        {!isAdmin && (
          <Card style={styles.fanCard}>
            <Card.Content>
              <Text style={styles.fanTitle}>⭐ Support Your Team</Text>
              <View style={styles.supportRow}>
                <Button
                  mode={isFavorite ? 'contained' : 'outlined'}
                  onPress={toggleFavorite}
                  icon={isFavorite ? 'heart' : 'heart-outline'}
                  style={styles.favoriteButton}
                >
                  {isFavorite ? 'Following Match' : 'Follow Match'}
                </Button>
              </View>
              <Text style={styles.supportText}>
                {isFavorite ? '🔔 You\'ll get notifications for this match' : '💚 Follow to get match updates'}
              </Text>
            </Card.Content>
          </Card>
        )}

        {isAdmin && (
          <Card style={styles.adminCard}>
            <Card.Content>
              <Text style={styles.adminTitle}>⚙️ Admin Controls</Text>
              
              <Button
                mode="outlined"
                onPress={shareMatchToWhatsApp}
                style={styles.shareButton}
                icon="whatsapp"
              >
                📱 Share to WhatsApp
              </Button>
              
              {match.status === 'upcoming' && (
                <Button
                  mode="contained"
                  onPress={handleStartMatch}
                  style={styles.controlButton}
                  icon="play"
                >
                  🏁 Start Match
                </Button>
              )}

              {match.status === 'live' && (
                <>
                  <Card style={styles.minuteCard}>
                    <Card.Content>
                      <Text style={styles.minuteLabel}>Match Time</Text>
                      <View style={styles.minuteControl}>
                        <Button
                          mode="contained"
                          onPress={decrementMinute}
                          style={styles.minuteButton}
                          compact
                        >
                          -
                        </Button>
                        <TouchableOpacity onPress={() => setShowMinuteDialog(true)}>
                          <Text style={styles.minuteDisplay}>{currentMinute}'</Text>
                        </TouchableOpacity>
                        <Button
                          mode="contained"
                          onPress={incrementMinute}
                          style={styles.minuteButton}
                          compact
                        >
                          +
                        </Button>
                      </View>
                      <Text style={styles.minuteHint}>Tap minute to set manually</Text>
                    </Card.Content>
                  </Card>

                  <View style={styles.buttonRow}>
                    <Button
                      mode="outlined"
                      onPress={() => handleYellowCard('home')}
                      style={[styles.smallButton, styles.yellowButton]}
                      compact
                    >
                      🟨 {match.homeTeam}
                    </Button>
                    <Button
                      mode="outlined"
                      onPress={() => handleYellowCard('away')}
                      style={[styles.smallButton, styles.yellowButton]}
                      compact
                    >
                      🟨 {match.awayTeam}
                    </Button>
                  </View>

                  <View style={styles.buttonRow}>
                    <Button
                      mode="outlined"
                      onPress={() => handleRedCard('home')}
                      style={[styles.smallButton, styles.redButton]}
                      compact
                    >
                      🟥 {match.homeTeam}
                    </Button>
                    <Button
                      mode="outlined"
                      onPress={() => handleRedCard('away')}
                      style={[styles.smallButton, styles.redButton]}
                      compact
                    >
                      🟥 {match.awayTeam}
                    </Button>
                  </View>

                  <View style={styles.buttonRow}>
                    <Button
                      mode="outlined"
                      onPress={() => handleSubstitution('home')}
                      style={styles.smallButton}
                      compact
                    >
                      🔄 {match.homeTeam}
                    </Button>
                    <Button
                      mode="outlined"
                      onPress={() => handleSubstitution('away')}
                      style={styles.smallButton}
                      compact
                    >
                      🔄 {match.awayTeam}
                    </Button>
                  </View>

                  <View style={styles.buttonRow}>
                    <Button
                      mode="outlined"
                      onPress={() => handlePenalty('home')}
                      style={styles.smallButton}
                      compact
                    >
                      ⚠️ Penalty {match.homeTeam}
                    </Button>
                    <Button
                      mode="outlined"
                      onPress={() => handlePenalty('away')}
                      style={styles.smallButton}
                      compact
                    >
                      ⚠️ Penalty {match.awayTeam}
                    </Button>
                  </View>

                  <View style={styles.buttonRow}>
                    <Button
                      mode="outlined"
                      onPress={() => handleCorner('home')}
                      style={styles.smallButton}
                      compact
                    >
                      🚩 {match.homeTeam}
                    </Button>
                    <Button
                      mode="outlined"
                      onPress={() => handleCorner('away')}
                      style={styles.smallButton}
                      compact
                    >
                      🚩 {match.awayTeam}
                    </Button>
                  </View>

                  <View style={styles.buttonRow}>
                    <Button
                      mode="outlined"
                      onPress={() => handleInjury('home')}
                      style={styles.smallButton}
                      compact
                    >
                      🏥 {match.homeTeam}
                    </Button>
                    <Button
                      mode="outlined"
                      onPress={() => handleInjury('away')}
                      style={styles.smallButton}
                      compact
                    >
                      🏥 {match.awayTeam}
                    </Button>
                  </View>

                  <Button
                    mode="outlined"
                    onPress={undoLastGoal}
                    style={[styles.controlButton, styles.undoButton]}
                    icon="undo"
                  >
                    ↩️ Undo Last Goal
                  </Button>

                  <Button
                    mode="contained"
                    onPress={handleHalftime}
                    style={[styles.controlButton, styles.halftimeButton]}
                    icon="pause"
                  >
                    ⏸️ Half Time
                  </Button>

                  <Button
                    mode="contained"
                    onPress={handleEndMatch}
                    style={[styles.controlButton, styles.endButton]}
                    icon="stop"
                  >
                    🏆 End Match
                  </Button>
                </>
              )}
            </Card.Content>
          </Card>
        )}

        {match.events && Object.keys(match.events).length > 0 && (
          <Card style={styles.eventsCard}>
            <Card.Content>
              <Text style={styles.eventsTitle}>Match Events</Text>
              {(Array.isArray(match.events) ? match.events : Object.values(match.events)).reverse().map((event, index) => (
                <View key={index} style={styles.eventItem}>
                  <Text style={styles.eventMinute}>{event?.minute || 0}'</Text>
                  <Text style={styles.eventType}>{getEventIcon(event?.type || 'unknown')}</Text>
                  <Text style={styles.eventDescription}>{event?.description || 'Event'}</Text>
                </View>
              ))}
            </Card.Content>
          </Card>
        )}

        {/* Graphics & Sharing */}
        <Card style={styles.graphicsCard}>
          <Card.Content>
            <Text style={styles.graphicsTitle}>📸 Match Graphics</Text>
            
            {isAdmin && match.status === 'upcoming' && (
              <Button
                mode="outlined"
                onPress={() => navigation.navigate('PreMatchAnnouncement', { matchId: match.id })}
                style={styles.graphicsButton}
                icon="bullhorn"
              >
                Pre-Match Announcement
              </Button>
            )}

            {isAdmin && (
              <Button
                mode="outlined"
                onPress={() => navigation.navigate('LineupGraphic', { matchId: match.id })}
                style={styles.graphicsButton}
                icon="account-group"
              >
                Create Lineup Graphic
              </Button>
            )}

            {isAdmin && match.status === 'finished' && (
              <Button
                mode="outlined"
                onPress={() => navigation.navigate('MatchResultGraphic', { matchId: match.id })}
                style={styles.graphicsButton}
                icon="trophy"
              >
                Share Match Result
              </Button>
            )}

            {match.status === 'finished' && (
              <Button
                mode="contained"
                onPress={() => navigation.navigate('FanReaction', { matchId: match.id })}
                style={styles.fanReactionButton}
                icon="heart"
              >
                React & Share
              </Button>
            )}
          </Card.Content>
        </Card>
      </ScrollView>

      <Portal>
        <Dialog visible={showMinuteDialog} onDismiss={() => setShowMinuteDialog(false)}>
          <Dialog.Title>Set Match Minute</Dialog.Title>
          <Dialog.Content>
            <Text style={styles.dialogLabel}>Enter current match minute (0-120):</Text>
            <TextInput
              mode="outlined"
              value={tempMinute}
              onChangeText={setTempMinute}
              keyboardType="number-pad"
              placeholder="e.g., 45"
              style={styles.minuteInput}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => {
              setShowMinuteDialog(false);
              setTempMinute('');
            }}>Cancel</Button>
            <Button onPress={() => {
              updateMatchMinute(tempMinute);
              setShowMinuteDialog(false);
              setTempMinute('');
            }}>Set</Button>
          </Dialog.Actions>
        </Dialog>

        <Dialog visible={showPlayerDialog} onDismiss={() => {
          setShowPlayerDialog(false);
          setPendingEvent(null);
          setSubstitutionStep(null);
          setPlayerOut(null);
        }}>
          <Dialog.Title>
            {substitutionStep === 'out' ? '🔄 Select Player Going OFF' : 
             substitutionStep === 'in' ? `🔄 Select Player Coming IN (${playerOut?.name} going off)` : 
             'Select Player'}
          </Dialog.Title>
          <Dialog.Content>
            {match && match.lineup && match.lineup.length > 0 && (
              <Card style={{ marginBottom: 10, backgroundColor: substitutionStep === 'in' ? '#fff3e0' : '#e3f2fd' }}>
                <Card.Content>
                  <Text style={{ fontSize: 12, color: substitutionStep === 'in' ? '#f57c00' : '#1976d2' }}>
                    {substitutionStep === 'in' 
                      ? `🔄 Showing bench players (${players.length} available)`
                      : `✓ Showing lineup players (${players.length} players)`
                    }
                  </Text>
                </Card.Content>
              </Card>
            )}
            <ScrollView style={{ maxHeight: 400 }}>
              {players.length === 0 ? (
                <Text style={{ textAlign: 'center', padding: 20, color: '#666' }}>
                  No lineup saved for this match.{'\n'}
                  Create a lineup from Admin Dashboard → Create Lineup.
                </Text>
              ) : (
                players.map((player) => (
                  <TouchableOpacity
                    key={player.id}
                    style={styles.playerItem}
                    onPress={() => handlePlayerSelected(player)}
                  >
                    <View style={styles.playerJersey}>
                      <Text style={styles.playerJerseyNumber}>
                        {player.jerseyNumber || '?'}
                      </Text>
                    </View>
                    <View style={styles.playerInfo}>
                      <Text style={styles.playerItemName}>{player.name}</Text>
                      <Text style={styles.playerItemPosition}>{player.position}</Text>
                    </View>
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => {
              setShowPlayerDialog(false);
              setPendingEvent(null);
              setSubstitutionStep(null);
              setPlayerOut(null);
            }}>Cancel</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
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
    color: '#0277BD',
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
    backgroundColor: '#4FC3F7',
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
  fanCard: {
    marginBottom: 15,
    elevation: 3,
    backgroundColor: '#E3F2FD',
  },
  fanTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#0277BD',
  },
  fanSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  predictionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  predictionButton: {
    flex: 1,
    marginHorizontal: 5,
  },
  predictionConfirm: {
    textAlign: 'center',
    color: '#4caf50',
    fontWeight: 'bold',
    marginTop: 10,
  },
  supportRow: {
    marginBottom: 10,
  },
  favoriteButton: {
    backgroundColor: '#4FC3F7',
  },
  supportText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 5,
  },
  adminCard: {
    marginBottom: 15,
    elevation: 3,
    backgroundColor: '#E3F2FD',
  },
  adminTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#0277BD',
  },
  shareButton: {
    marginTop: 10,
    marginBottom: 10,
    borderColor: '#25D366',
  },
  controlButton: {
    marginTop: 10,
    backgroundColor: '#4FC3F7',
  },
  endButton: {
    backgroundColor: '#d32f2f',
  },
  halftimeButton: {
    backgroundColor: '#ff9800',
  },
  undoButton: {
    borderColor: '#f44336',
    borderWidth: 2,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  smallButton: {
    flex: 1,
    borderColor: '#4FC3F7',
    marginHorizontal: 5,
  },
  yellowButton: {
    borderColor: '#fbc02d',
  },
  redButton: {
    borderColor: '#d32f2f',
  },
  eventsCard: {
    marginBottom: 15,
    elevation: 3,
  },
  eventsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#0277BD',
  },
  eventItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  eventMinute: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0277BD',
    marginRight: 10,
    minWidth: 35,
  },
  eventType: {
    fontSize: 20,
    marginRight: 10,
  },
  eventDescription: {
    fontSize: 14,
    flex: 1,
    marginRight: 5,
  },
  deleteEventButton: {
    margin: 0,
    marginLeft: 5,
  },
  minuteCard: {
    marginBottom: 15,
    backgroundColor: '#E3F2FD',
  },
  minuteLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#0277BD',
    marginBottom: 10,
  },
  minuteControl: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  minuteButton: {
    backgroundColor: '#4FC3F7',
    minWidth: 50,
  },
  minuteDisplay: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#0277BD',
    marginHorizontal: 30,
    minWidth: 80,
    textAlign: 'center',
  },
  minuteHint: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  dialogLabel: {
    marginBottom: 10,
    fontSize: 14,
  },
  minuteInput: {
    marginTop: 10,
  },
  playerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  playerJersey: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1a472a',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  playerJerseyNumber: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  playerInfo: {
    flex: 1,
  },
  playerItemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a472a',
  },
  playerItemPosition: {
    fontSize: 12,
    color: '#666',
  },
  graphicsCard: {
    marginBottom: 15,
    elevation: 3,
  },
  graphicsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#0277BD',
  },
  graphicsButton: {
    marginBottom: 10,
    borderColor: '#87CEEB',
  },
  fanReactionButton: {
    marginTop: 5,
    backgroundColor: '#87CEEB',
  },
});

export default MatchDetailScreen;
