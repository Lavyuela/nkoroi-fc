import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, Alert, PermissionsAndroid, Platform } from 'react-native';
import Share from 'react-native-share';
import { Text, Appbar, Button, TextInput, Card, FAB } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';
import firestore from '@react-native-firebase/firestore';
import ViewShot from 'react-native-view-shot';
import GraphicTemplate from '../components/GraphicTemplate';
import RNFS from 'react-native-fs';

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

  const requestStoragePermission = async () => {
    if (Platform.OS !== 'android') return true;
    
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission',
          message: 'App needs access to save images to your gallery',
          buttonPositive: 'OK',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  const saveGraphic = async () => {
    try {
      if (!viewShotRef.current) {
        Alert.alert('Error', 'Unable to generate image. Please try again.');
        return;
      }
      
      await new Promise(resolve => setTimeout(resolve, 500));
      const uri = await viewShotRef.current.capture();
      const timestamp = Date.now();
      const fileName = `NkoroiFC_Announcement_${timestamp}.jpg`;
      // Save to app's internal document directory
      const destPath = `${RNFS.DocumentDirectoryPath}/${fileName}`;
      
      await RNFS.copyFile(uri, destPath);
      
      Alert.alert(
        'Success', 
        'Announcement saved!\n\nYou can view your saved graphics from the Admin Dashboard under "Saved Graphics".',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Save error:', error);
      Alert.alert('Error', 'Failed to save announcement: ' + error.message);
    }
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
      
      // Send notification to fans
      const functions = require('@react-native-firebase/functions').default;
      console.log('🔔 Sending pre-match announcement notification...');
      
      // Send notification and show popup
      functions().httpsCallable('sendCustomNotification')({
        title: '📢 Match Announcement!',
        body: `${match.homeTeam} vs ${match.awayTeam} - ${formatDate(match.matchDate)} at ${formatTime(match.matchDate)}`,
        topic: 'team_updates',
        channelId: 'match_updates',
      }).then((result) => {
        console.log('✅ Notification sent successfully:', result);
        Alert.alert('✅ Success!', 'Notification sent to all fans!', [{ text: 'OK' }]);
      }).catch((notifError) => {
        console.error('❌ Notification error:', notifError);
        console.error('Error code:', notifError.code);
        console.error('Error details:', notifError.details);
        Alert.alert('❌ Error', `Failed to send notification: ${notifError.message}`, [{ text: 'OK' }]);
      });
      
      // Then share
      await Share.open({
        title: 'Match Announcement',
        message: `⚽ ${match.homeTeam} vs ${match.awayTeam}\n📅 ${formatDate(match.matchDate)}\n⏰ ${formatTime(match.matchDate)}\n📍 ${match.venue || 'TBA'}`,
        url: `file://${uri}`,
        type: 'image/jpeg',
      });
    } catch (error) {
      if (error.message !== 'User did not share') {
        console.error('Share error:', error);
        Alert.alert('Error', 'Failed to share announcement: ' + error.message);
      }
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

      {/* Floating Action Buttons */}
      <FAB
        icon="content-save"
        label="Save"
        style={[styles.fab, { bottom: 150 }]}
        onPress={saveGraphic}
        color="#fff"
      />
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a472a',
    textAlign: 'center',
  },
  vsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#87CEEB',
    marginHorizontal: 15,
  },
  infoSection: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
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
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  messageBox: {
    backgroundColor: '#87CEEB',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
  },
  messageText: {
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '600',
  },
  ctaBox: {
    backgroundColor: '#1a472a',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  ctaText: {
    fontSize: 16,
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
