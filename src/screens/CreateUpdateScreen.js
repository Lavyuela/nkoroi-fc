import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Linking, Share } from 'react-native';
import { TextInput, Button, Text, Appbar, Snackbar, RadioButton } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CreateUpdateScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState('announcement');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const shareToWhatsApp = async (updateTitle, updateContent, updateType) => {
    const typeEmoji = {
      announcement: '📢',
      training: '🏃',
      match: '⚽',
      injury: '🏥'
    };

    const message = `${typeEmoji[updateType]} *Nkoroi FC Update*\n\n*${updateTitle}*\n\n${updateContent}\n\n_Posted via Nkoroi FC Live Score App_`;
    
    try {
      const whatsappUrl = `whatsapp://send?text=${encodeURIComponent(message)}`;
      const canOpen = await Linking.canOpenURL(whatsappUrl);
      
      if (canOpen) {
        await Linking.openURL(whatsappUrl);
      } else {
        // Fallback to regular share if WhatsApp not installed
        await Share.share({
          message: message,
        });
      }
    } catch (error) {
      console.log('Error sharing to WhatsApp:', error);
      // Fallback to regular share
      try {
        await Share.share({
          message: message,
        });
      } catch (shareError) {
        setError('Failed to share update');
      }
    }
  };

  const handleCreateUpdate = async () => {
    if (!title || !content) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    
    try {
      const updateId = 'update-' + Date.now();
      const newUpdate = {
        id: updateId,
        title,
        content,
        type,
        timestamp: Date.now(),
      };
      
      const savedUpdates = await AsyncStorage.getItem('teamUpdates');
      const updates = savedUpdates ? JSON.parse(savedUpdates) : [];
      updates.unshift(newUpdate); // Add to beginning
      await AsyncStorage.setItem('teamUpdates', JSON.stringify(updates));
      
      setSuccess('Update posted successfully!');
      
      // Automatically share to WhatsApp
      await shareToWhatsApp(title, content, type);
      
      setTimeout(() => {
        navigation.goBack();
      }, 500);
    } catch (error) {
      setError('Failed to post update');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={() => navigation.goBack()} color="#fff" />
        <Appbar.Content title="Post Team Update" titleStyle={styles.headerTitle} />
      </Appbar.Header>

      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.sectionTitle}>Update Information</Text>

          <TextInput
            label="Title"
            value={title}
            onChangeText={setTitle}
            mode="outlined"
            style={styles.input}
            placeholder="e.g., Training Schedule Updated"
            left={<TextInput.Icon icon="format-title" />}
          />

          <TextInput
            label="Content"
            value={content}
            onChangeText={setContent}
            mode="outlined"
            multiline
            numberOfLines={6}
            style={styles.textArea}
            placeholder="Write your update message here..."
            left={<TextInput.Icon icon="text" />}
          />

          <Text style={styles.sectionTitle}>Update Type</Text>

          <View style={styles.radioGroup}>
            <RadioButton.Item
              label="📢 Announcement"
              value="announcement"
              status={type === 'announcement' ? 'checked' : 'unchecked'}
              onPress={() => setType('announcement')}
              style={styles.radioItem}
            />
            <RadioButton.Item
              label="🏃 Training"
              value="training"
              status={type === 'training' ? 'checked' : 'unchecked'}
              onPress={() => setType('training')}
              style={styles.radioItem}
            />
            <RadioButton.Item
              label="⚽ Match"
              value="match"
              status={type === 'match' ? 'checked' : 'unchecked'}
              onPress={() => setType('match')}
              style={styles.radioItem}
            />
            <RadioButton.Item
              label="🏥 Injury Report"
              value="injury"
              status={type === 'injury' ? 'checked' : 'unchecked'}
              onPress={() => setType('injury')}
              style={styles.radioItem}
            />
          </View>

          <Button
            mode="contained"
            onPress={handleCreateUpdate}
            loading={loading}
            disabled={loading}
            style={styles.createButton}
            contentStyle={styles.buttonContent}
            icon="send"
          >
            Post Update
          </Button>
        </ScrollView>
      </KeyboardAvoidingView>

      <Snackbar
        visible={!!error}
        onDismiss={() => setError('')}
        duration={3000}
        style={styles.errorSnackbar}
      >
        {error}
      </Snackbar>

      <Snackbar
        visible={!!success}
        onDismiss={() => setSuccess('')}
        duration={1500}
        style={styles.successSnackbar}
      >
        {success}
      </Snackbar>
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
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 15,
    color: '#1a472a',
  },
  input: {
    marginBottom: 15,
  },
  textArea: {
    marginBottom: 15,
    minHeight: 150,
  },
  radioGroup: {
    marginBottom: 20,
  },
  radioItem: {
    paddingVertical: 5,
  },
  createButton: {
    marginTop: 20,
    backgroundColor: '#1a472a',
  },
  buttonContent: {
    paddingVertical: 8,
  },
  errorSnackbar: {
    backgroundColor: '#d32f2f',
  },
  successSnackbar: {
    backgroundColor: '#4caf50',
  },
});

export default CreateUpdateScreen;
