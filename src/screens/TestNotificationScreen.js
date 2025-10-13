import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Button, Card, Appbar, Divider } from 'react-native-paper';
import notifee, { AndroidImportance } from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';

const TestNotificationScreen = ({ navigation }) => {
  const [permissionStatus, setPermissionStatus] = useState('unknown');
  const [pushToken, setPushToken] = useState(null);
  const [testResults, setTestResults] = useState([]);

  const addResult = (message, success = true) => {
    setTestResults(prev => [...prev, { message, success, time: new Date().toLocaleTimeString() }]);
  };

  const testPermission = async () => {
    try {
      const authStatus = await messaging().requestPermission();
      const hasPermission = authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
                           authStatus === messaging.AuthorizationStatus.PROVISIONAL;
      setPermissionStatus(hasPermission ? 'granted' : 'denied');
      addResult(`Permission: ${hasPermission ? '✅ Granted' : '❌ Denied'}`, hasPermission);
    } catch (error) {
      addResult(`Permission Error: ${error.message}`, false);
    }
  };

  const testGetToken = async () => {
    try {
      const token = await messaging().getToken();
      setPushToken(token);
      addResult(token ? `✅ Token: ${token.substring(0, 30)}...` : '❌ No token', !!token);
    } catch (error) {
      addResult(`Token Error: ${error.message}`, false);
    }
  };

  const testSimpleNotification = async () => {
    try {
      await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
        importance: AndroidImportance.HIGH,
      });
      
      await notifee.displayNotification({
        title: '🎉 Test Notification',
        body: 'This is a simple test notification!',
        android: {
          channelId: 'default',
          importance: AndroidImportance.HIGH,
        },
      });
      addResult('✅ Simple notification sent');
    } catch (error) {
      addResult(`❌ Error: ${error.message}`, false);
    }
  };

  const testGoalNotification = async () => {
    try {
      await notifee.displayNotification({
        title: '⚽ GOAL!',
        body: 'Nkoroi FC 1 - 0 Opponent',
        android: {
          channelId: 'default',
          importance: AndroidImportance.HIGH,
          sound: 'default',
        },
      });
      addResult('✅ Goal notification sent');
    } catch (error) {
      addResult(`❌ Error: ${error.message}`, false);
    }
  };

  const testYellowCardNotification = async () => {
    try {
      await notifee.displayNotification({
        title: '🟨 Yellow Card',
        body: 'Player Name - Nkoroi FC',
        android: {
          channelId: 'default',
          importance: AndroidImportance.HIGH,
          sound: 'default',
        },
      });
      addResult('✅ Yellow card notification sent');
    } catch (error) {
      addResult(`❌ Error: ${error.message}`, false);
    }
  };

  const testMatchStartNotification = async () => {
    try {
      await notifee.displayNotification({
        title: '⚽ Match Started!',
        body: 'Nkoroi FC vs Opponent - Live now!',
        android: {
          channelId: 'default',
          importance: AndroidImportance.HIGH,
          sound: 'default',
        },
      });
      addResult('✅ Match start notification sent');
    } catch (error) {
      addResult(`❌ Error: ${error.message}`, false);
    }
  };

  const testScheduledNotification = async () => {
    try {
      const trigger = {
        type: notifee.TriggerType.TIMESTAMP,
        timestamp: Date.now() + 5000, // 5 seconds from now
      };
      
      await notifee.createTriggerNotification({
        title: '⏰ Scheduled Test',
        body: 'This notification was scheduled for 5 seconds ago',
        android: {
          channelId: 'default',
          importance: AndroidImportance.HIGH,
        },
      }, trigger);
      addResult('✅ Scheduled notification (5 seconds)');
    } catch (error) {
      addResult(`❌ Error: ${error.message}`, false);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Test Notifications" />
      </Appbar.Header>

      <ScrollView style={styles.content}>
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.sectionTitle}>📱 Setup Tests</Text>
            <Text style={styles.description}>
              Test notification permissions and token generation
            </Text>
            
            <Button 
              mode="contained" 
              onPress={testPermission}
              style={styles.button}
              icon="bell-check"
            >
              Test Permission
            </Button>

            <Button 
              mode="contained" 
              onPress={testGetToken}
              style={styles.button}
              icon="key"
            >
              Get Push Token
            </Button>

            {permissionStatus !== 'unknown' && (
              <Text style={styles.status}>
                Status: {permissionStatus === 'granted' ? '✅ Ready' : '❌ Permission Denied'}
              </Text>
            )}
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.sectionTitle}>🔔 Notification Tests</Text>
            <Text style={styles.description}>
              Tap buttons to send test notifications
            </Text>

            <Button 
              mode="contained" 
              onPress={testSimpleNotification}
              style={styles.button}
              icon="bell"
            >
              Simple Notification
            </Button>

            <Button 
              mode="contained" 
              onPress={testGoalNotification}
              style={styles.button}
              icon="soccer"
            >
              Goal Notification
            </Button>

            <Button 
              mode="contained" 
              onPress={testYellowCardNotification}
              style={styles.button}
              icon="card"
            >
              Yellow Card Notification
            </Button>

            <Button 
              mode="contained" 
              onPress={testMatchStartNotification}
              style={styles.button}
              icon="play"
            >
              Match Start Notification
            </Button>

            <Button 
              mode="contained" 
              onPress={testScheduledNotification}
              style={styles.button}
              icon="clock"
            >
              Scheduled (5 sec)
            </Button>
          </Card.Content>
        </Card>

        {testResults.length > 0 && (
          <Card style={styles.card}>
            <Card.Content>
              <View style={styles.resultsHeader}>
                <Text variant="titleLarge" style={styles.sectionTitle}>📊 Test Results</Text>
                <Button onPress={clearResults} mode="text">Clear</Button>
              </View>
              
              <Divider style={styles.divider} />

              {testResults.map((result, index) => (
                <View key={index} style={styles.resultItem}>
                  <Text style={[styles.resultText, !result.success && styles.errorText]}>
                    {result.time} - {result.message}
                  </Text>
                </View>
              ))}
            </Card.Content>
          </Card>
        )}

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.sectionTitle}>ℹ️ Important Notes</Text>
            <Text style={styles.note}>
              • Notifications only work on real devices{'\n'}
              • Emulators will show "sent" but won't display{'\n'}
              • Check notification settings if not showing{'\n'}
              • Make sure Do Not Disturb is off{'\n'}
              • Volume must be up for sound
            </Text>
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
    backgroundColor: '#1a472a',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  sectionTitle: {
    marginBottom: 8,
    color: '#1a472a',
    fontWeight: 'bold',
  },
  description: {
    marginBottom: 16,
    color: '#666',
  },
  button: {
    marginBottom: 12,
    backgroundColor: '#4FC3F7',
  },
  status: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  divider: {
    marginVertical: 12,
  },
  resultItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  resultText: {
    fontSize: 14,
    color: '#333',
  },
  errorText: {
    color: '#f44336',
  },
  note: {
    fontSize: 14,
    color: '#666',
    lineHeight: 24,
  },
});

export default TestNotificationScreen;
