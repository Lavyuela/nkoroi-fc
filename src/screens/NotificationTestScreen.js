import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, Clipboard, ToastAndroid, Platform } from 'react-native';
import { Text, Appbar, Button, Card, Divider, Chip, IconButton } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NotificationService from '../services/notificationService';
import { useAuth } from '../context/AuthContext';

const NotificationTestScreen = ({ navigation }) => {
  const { isAdmin } = useAuth();
  const [fcmToken, setFcmToken] = useState('');
  const [permissionStatus, setPermissionStatus] = useState('unknown');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadFCMToken();
    checkPermissionStatus();
  }, []);

  const loadFCMToken = async () => {
    try {
      const token = await AsyncStorage.getItem('fcm_token');
      if (token) {
        setFcmToken(token);
      }
    } catch (error) {
      console.error('Load FCM token error:', error);
    }
  };

  const checkPermissionStatus = async () => {
    try {
      const hasPermission = await NotificationService.requestPermission();
      setPermissionStatus(hasPermission ? 'granted' : 'denied');
    } catch (error) {
      setPermissionStatus('error');
    }
  };

  const handleRequestPermission = async () => {
    setLoading(true);
    try {
      const granted = await NotificationService.requestPermission();
      setPermissionStatus(granted ? 'granted' : 'denied');
      
      if (granted) {
        Alert.alert('Success', 'Notification permission granted!');
        await handleInitialize();
      } else {
        Alert.alert('Permission Denied', 'Please enable notifications in your device settings.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to request permission');
    } finally {
      setLoading(false);
    }
  };

  const handleInitialize = async () => {
    setLoading(true);
    try {
      const success = await NotificationService.initialize();
      if (success) {
        Alert.alert('Success', 'Notification service initialized!');
        await loadFCMToken();
      } else {
        Alert.alert('Error', 'Failed to initialize notification service');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to initialize: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyToken = async () => {
    if (!fcmToken) {
      Alert.alert('No Token', 'Please get FCM token first');
      return;
    }

    try {
      Clipboard.setString(fcmToken);
      if (Platform.OS === 'android') {
        ToastAndroid.show('✅ Token copied to clipboard!', ToastAndroid.LONG);
      } else {
        Alert.alert('Success', 'Token copied to clipboard!');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to copy token');
    }
  };

  const handleGetToken = async () => {
    setLoading(true);
    try {
      const token = await NotificationService.getFCMToken();
      if (token) {
        setFcmToken(token);
        Clipboard.setString(token);
        if (Platform.OS === 'android') {
          ToastAndroid.show('✅ Token copied to clipboard!', ToastAndroid.LONG);
        }
        Alert.alert('Success', 'FCM Token obtained and copied to clipboard!', [
          { text: 'OK' }
        ]);
      } else {
        Alert.alert('Error', 'Failed to get FCM token');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to get token: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTestNotification = async () => {
    setLoading(true);
    try {
      await NotificationService.sendTestNotification();
      Alert.alert('Success', 'Test notification sent! Check your notification tray.');
    } catch (error) {
      Alert.alert('Error', 'Failed to send test notification: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMatchNotification = async () => {
    setLoading(true);
    try {
      await NotificationService.sendMatchUpdateNotification({
        id: 'test-match-1',
        homeTeam: 'Nkoroi FC',
        awayTeam: 'Test Opponent',
        venue: 'Strathmore Complex',
      });
      Alert.alert('Success', 'Match notification sent!');
    } catch (error) {
      Alert.alert('Error', 'Failed to send match notification: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleScoreNotification = async () => {
    setLoading(true);
    try {
      await NotificationService.sendScoreUpdateNotification({
        id: 'test-match-1',
        homeTeam: 'Nkoroi FC',
        awayTeam: 'Test Opponent',
        homeScore: 1,
        awayScore: 0,
        scorer: 'John Doe',
        scoringTeam: 'Nkoroi FC',
      });
      Alert.alert('Success', 'Score notification sent!');
    } catch (error) {
      Alert.alert('Error', 'Failed to send score notification: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return (
      <View style={styles.container}>
        <Appbar.Header style={styles.header}>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content title="Notifications" />
        </Appbar.Header>
        <View style={styles.content}>
          <Text>Admin access required</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Notification Testing" />
      </Appbar.Header>

      <ScrollView style={styles.content}>
        {/* Status Card */}
        <Card style={styles.card}>
          <Card.Title title="Notification Status" />
          <Card.Content>
            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>Permission:</Text>
              <Chip
                mode="flat"
                style={[
                  styles.statusChip,
                  permissionStatus === 'granted' ? styles.grantedChip : styles.deniedChip
                ]}
                textStyle={styles.chipText}
              >
                {permissionStatus.toUpperCase()}
              </Chip>
            </View>
            
            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>FCM Token:</Text>
              <Text style={styles.statusValue}>
                {fcmToken ? `${fcmToken.substring(0, 20)}...` : 'Not available'}
              </Text>
            </View>
          </Card.Content>
        </Card>

        {/* Setup Actions */}
        <Card style={styles.card}>
          <Card.Title title="Setup & Configuration" />
          <Card.Content>
            <Button
              mode="contained"
              onPress={handleRequestPermission}
              style={styles.button}
              loading={loading}
              disabled={loading || permissionStatus === 'granted'}
            >
              Request Permission
            </Button>

            <Button
              mode="contained"
              onPress={handleInitialize}
              style={styles.button}
              loading={loading}
              disabled={loading || permissionStatus !== 'granted'}
            >
              Initialize Service
            </Button>

            <Button
              mode="outlined"
              onPress={handleGetToken}
              style={styles.button}
              loading={loading}
              disabled={loading}
              icon="content-copy"
            >
              Get & Copy FCM Token
            </Button>
          </Card.Content>
        </Card>

        {/* Test Notifications */}
        <Card style={styles.card}>
          <Card.Title title="Test Notifications (Local)" />
          <Card.Content>
            <Text style={styles.description}>
              These are local notifications for testing. They don't require Firebase Console.
            </Text>

            <Button
              mode="contained"
              onPress={handleTestNotification}
              style={styles.button}
              loading={loading}
              disabled={loading || permissionStatus !== 'granted'}
              icon="bell"
            >
              Send Test Notification
            </Button>

            <Button
              mode="contained"
              onPress={handleMatchNotification}
              style={styles.button}
              loading={loading}
              disabled={loading || permissionStatus !== 'granted'}
              icon="soccer"
            >
              Send Match Update
            </Button>

            <Button
              mode="contained"
              onPress={handleScoreNotification}
              style={styles.button}
              loading={loading}
              disabled={loading || permissionStatus !== 'granted'}
              icon="fire"
            >
              Send Score Update
            </Button>
          </Card.Content>
        </Card>

        {/* Instructions */}
        <Card style={styles.card}>
          <Card.Title title="Firebase Console Testing" />
          <Card.Content>
            <Text style={styles.instructionTitle}>To send from Firebase Console:</Text>
            <Text style={styles.instruction}>1. Go to Firebase Console → Cloud Messaging</Text>
            <Text style={styles.instruction}>2. Click "Send your first message"</Text>
            <Text style={styles.instruction}>3. Enter notification title and text</Text>
            <Text style={styles.instruction}>4. Select "Send test message"</Text>
            <Text style={styles.instruction}>5. Paste your FCM token (tap "Get FCM Token" above)</Text>
            <Text style={styles.instruction}>6. Click "Test" button</Text>
            
            <Divider style={styles.divider} />
            
            <Text style={styles.note}>
              Note: Make sure the app is in the background or closed to test background notifications.
            </Text>
          </Card.Content>
        </Card>

        {/* FCM Token Display */}
        {fcmToken && (
          <Card style={styles.card}>
            <Card.Title 
              title="Your FCM Token" 
              right={(props) => (
                <IconButton
                  {...props}
                  icon="content-copy"
                  onPress={handleCopyToken}
                />
              )}
            />
            <Card.Content>
              <View style={styles.tokenContainer}>
                <Text style={styles.tokenText} selectable>
                  {fcmToken}
                </Text>
              </View>
              
              <Button
                mode="contained"
                icon="content-copy"
                onPress={handleCopyToken}
                style={styles.button}
              >
                Copy Token to Clipboard
              </Button>
              
              <Text style={styles.tokenNote}>
                ✅ Token automatically copied when you tap "Get FCM Token"
              </Text>
              <Text style={styles.tokenNote}>
                📋 Or tap the button above to copy again
              </Text>
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
  content: {
    flex: 1,
    padding: 15,
  },
  card: {
    marginBottom: 15,
    elevation: 2,
  },
  button: {
    marginTop: 10,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
    color: '#1a472a',
  },
  statusValue: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  statusChip: {
    height: 28,
  },
  grantedChip: {
    backgroundColor: '#4CAF50',
  },
  deniedChip: {
    backgroundColor: '#f44336',
  },
  chipText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  instructionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a472a',
    marginBottom: 10,
  },
  instruction: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
    paddingLeft: 10,
  },
  divider: {
    marginVertical: 15,
  },
  note: {
    fontSize: 12,
    color: '#ff9800',
    fontStyle: 'italic',
  },
  tokenContainer: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  tokenText: {
    fontSize: 11,
    color: '#333',
    fontFamily: 'monospace',
    lineHeight: 18,
  },
  tokenNote: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
    fontStyle: 'italic',
  },
});

export default NotificationTestScreen;
