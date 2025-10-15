import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, Alert, Share as RNShare } from 'react-native';
import { Text, Appbar, Button, TextInput, Card, FAB } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';
import firestore from '@react-native-firebase/firestore';
import ViewShot from 'react-native-view-shot';
import GraphicTemplate from '../components/GraphicTemplate';

const PreMatchAnnouncementScreen = ({ route, navigation }) => {
  const { matchId } = route.params;
  const { isAdmin } = useAuth();
  const viewShotRef = useRef();

  const [match, setMatch] = useState(null);
  const [customMessage, setCustomMessage] = useState('');

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
          setMatch({ id: doc.id, ...doc.data() });
        }
      });
    return () => unsubscribe();
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const captureAndShare = async () => {
    try {
      const uri = await viewShotRef.current.capture();
      await RNShare.share({
        title: 'Match Announcement',
        message: `⚽ ${match.homeTeam} vs ${match.awayTeam}\n📅 ${formatDate(match.matchDate)}\n⏰ ${formatTime(match.matchDate)}\n📍 ${match.venue || 'TBA'}`,
        url: uri,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share announcement');
      console.error(error);
    }
  };

  const renderGraphic = () => (
    <ViewShot ref={viewShotRef} options={{ format: 'jpg', quality: 0.9 }}>
      <GraphicTemplate
        title="MATCHDAY"
        subtitle="Get Ready!"
      >
        {/* Match Details */}
        <View style={styles.matchDetails}>
          <View style={styles.teamsContainer}>
            <View style={styles.teamBox}>
              <Text style={styles.teamName}>{match?.homeTeam || 'Home'}</Text>
            </View>
            
            <Text style={styles.vsText}>VS</Text>
            
            <View style={styles.teamBox}>
              <Text style={styles.teamName}>{match?.awayTeam || 'Away'}</Text>
            </View>
          </View>

          {/* Date & Time */}
          <View style={styles.infoSection}>
            <View style={styles.infoRow}>
              <Text style={styles.infoIcon}>📅</Text>
              <Text style={styles.infoText}>{formatDate(match?.matchDate)}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoIcon}>⏰</Text>
              <Text style={styles.infoText}>{formatTime(match?.matchDate)}</Text>
            </View>
            
            {match?.venue && (
              <View style={styles.infoRow}>
                <Text style={styles.infoIcon}>📍</Text>
                <Text style={styles.infoText}>{match.venue}</Text>
              </View>
            )}
          </View>

          {/* Custom Message */}
          {customMessage && (
            <View style={styles.messageBox}>
              <Text style={styles.messageText}>{customMessage}</Text>
            </View>
          )}

          {/* Call to Action */}
          <View style={styles.ctaBox}>
            <Text style={styles.ctaText}>🔥 LET'S GO NKOROI! 🔥</Text>
          </View>
        </View>
      </GraphicTemplate>
    </ViewShot>
  );

  if (!match) {
    return (
      <View style={styles.container}>
        <Appbar.Header style={styles.header}>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content title="Pre-Match Announcement" />
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
        <Appbar.Content title="Pre-Match Announcement" />
      </Appbar.Header>

      <ScrollView style={styles.content}>
        {/* Custom Message Input */}
        <Card style={styles.card}>
          <Card.Content>
            <TextInput
              label="Custom Message (Optional)"
              value={customMessage}
              onChangeText={setCustomMessage}
              mode="outlined"
              multiline
              numberOfLines={3}
              placeholder="e.g., Come support the team!"
            />
          </Card.Content>
        </Card>

        {/* Preview */}
        {renderGraphic()}
      </ScrollView>

      {/* Floating Share Button */}
      <FAB
        icon="share"
        label="Share"
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
  card: {
    marginBottom: 15,
  },
  matchDetails: {
    paddingVertical: 20,
  },
  teamsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 40,
  },
  teamBox: {
    flex: 1,
    alignItems: 'center',
  },
  teamName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a472a',
    textAlign: 'center',
  },
  vsText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#87CEEB',
    marginHorizontal: 20,
  },
  infoSection: {
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  infoIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  infoText: {
    fontSize: 18,
    color: '#333',
    fontWeight: '600',
  },
  messageBox: {
    backgroundColor: '#87CEEB',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  messageText: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '600',
  },
  ctaBox: {
    backgroundColor: '#1a472a',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  ctaText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
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

export default PreMatchAnnouncementScreen;
