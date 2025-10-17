/**
 * Admin Notification Screen
 * Allows admins to send custom push notifications to all users
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import adminNotificationService from '../services/adminNotificationService';
import { COLORS } from '../config/colors';

const AdminNotificationScreen = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendNotification = async () => {
    if (!title.trim() || !body.trim()) {
      Alert.alert('Error', 'Please enter both title and message');
      return;
    }

    Alert.alert(
      'Send Notification',
      'Are you sure you want to send this notification to all users?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Send',
          onPress: async () => {
            setLoading(true);
            try {
              await adminNotificationService.sendCustomNotification(title, body);
              Alert.alert('Success', 'Notification sent successfully!');
              setTitle('');
              setBody('');
            } catch (error) {
              Alert.alert('Error', error.message || 'Failed to send notification');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const sendQuickNotification = async (type) => {
    setLoading(true);
    try {
      switch (type) {
        case 'test':
          await adminNotificationService.sendCustomNotification(
            '🧪 Test Notification',
            'This is a test notification from the admin panel'
          );
          break;
        case 'welcome':
          await adminNotificationService.sendTeamNews(
            'Welcome to Nkoroi FC!',
            'Thank you for supporting our team!'
          );
          break;
        case 'practice':
          await adminNotificationService.sendTeamNews(
            'Practice Reminder',
            'Team practice tomorrow at 6 PM. Don\'t be late!'
          );
          break;
        default:
          break;
      }
      Alert.alert('Success', 'Notification sent successfully!');
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to send notification');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📢 Send Notification</Text>
        <Text style={styles.headerSubtitle}>
          Send push notifications to all app users
        </Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Notification Title</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter notification title"
          placeholderTextColor="#999"
          value={title}
          onChangeText={setTitle}
          maxLength={50}
        />
        <Text style={styles.charCount}>{title.length}/50</Text>

        <Text style={styles.label}>Notification Message</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Enter notification message"
          placeholderTextColor="#999"
          value={body}
          onChangeText={setBody}
          multiline
          numberOfLines={4}
          maxLength={200}
        />
        <Text style={styles.charCount}>{body.length}/200</Text>

        <TouchableOpacity
          style={[styles.sendButton, loading && styles.disabledButton]}
          onPress={handleSendNotification}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.sendButtonText}>Send Notification</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <Text style={styles.sectionSubtitle}>
          Send pre-defined notifications
        </Text>

        <TouchableOpacity
          style={[styles.quickButton, loading && styles.disabledButton]}
          onPress={() => sendQuickNotification('test')}
          disabled={loading}
        >
          <Text style={styles.quickButtonText}>🧪 Send Test Notification</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.quickButton, loading && styles.disabledButton]}
          onPress={() => sendQuickNotification('welcome')}
          disabled={loading}
        >
          <Text style={styles.quickButtonText}>👋 Send Welcome Message</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.quickButton, loading && styles.disabledButton]}
          onPress={() => sendQuickNotification('practice')}
          disabled={loading}
        >
          <Text style={styles.quickButtonText}>⚽ Send Practice Reminder</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.info}>
        <Text style={styles.infoTitle}>ℹ️ Information</Text>
        <Text style={styles.infoText}>
          • Notifications are sent to all users subscribed to the team_updates topic
        </Text>
        <Text style={styles.infoText}>
          • Users will receive notifications even if the app is closed
        </Text>
        <Text style={styles.infoText}>
          • Only admins can send notifications
        </Text>
        <Text style={styles.infoText}>
          • Notifications are also saved to Firestore for in-app display
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: COLORS.primary,
    padding: 20,
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  form: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 20,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#f9f9f9',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
    marginTop: 5,
  },
  sendButton: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.6,
  },
  quickActions: {
    backgroundColor: '#fff',
    margin: 15,
    marginTop: 0,
    padding: 20,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  quickButton: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  quickButtonText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  info: {
    backgroundColor: '#fff',
    margin: 15,
    marginTop: 0,
    padding: 20,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 30,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
    lineHeight: 20,
  },
});

export default AdminNotificationScreen;
