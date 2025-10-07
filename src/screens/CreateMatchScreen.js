import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Text, Appbar, Snackbar } from 'react-native-paper';
import { createMatch } from '../services/firebase';
import DateTimePicker from '@react-native-community/datetimepicker';

const CreateMatchScreen = ({ navigation }) => {
  const [homeTeam, setHomeTeam] = useState('');
  const [awayTeam, setAwayTeam] = useState('');
  const [venue, setVenue] = useState('');
  const [matchDate, setMatchDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleCreateMatch = async () => {
    if (!homeTeam || !awayTeam) {
      setError('Please enter both team names');
      return;
    }

    setLoading(true);
    const result = await createMatch({
      homeTeam,
      awayTeam,
      venue,
      matchDate: matchDate.getTime(),
    });
    setLoading(false);

    if (result.success) {
      setSuccess('Match created successfully!');
      setTimeout(() => {
        navigation.goBack();
      }, 1500);
    } else {
      setError(result.error);
    }
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setMatchDate(selectedDate);
    }
  };

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={() => navigation.goBack()} color="#fff" />
        <Appbar.Content title="Create New Match" titleStyle={styles.headerTitle} />
      </Appbar.Header>

      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.sectionTitle}>Team Information</Text>

          <TextInput
            label="Home Team"
            value={homeTeam}
            onChangeText={setHomeTeam}
            mode="outlined"
            style={styles.input}
            left={<TextInput.Icon icon="shield" />}
          />

          <TextInput
            label="Away Team"
            value={awayTeam}
            onChangeText={setAwayTeam}
            mode="outlined"
            style={styles.input}
            left={<TextInput.Icon icon="shield-outline" />}
          />

          <Text style={styles.sectionTitle}>Match Details</Text>

          <TextInput
            label="Venue (Optional)"
            value={venue}
            onChangeText={setVenue}
            mode="outlined"
            style={styles.input}
            left={<TextInput.Icon icon="map-marker" />}
          />

          <Button
            mode="outlined"
            onPress={() => setShowDatePicker(true)}
            style={styles.dateButton}
            icon="calendar"
          >
            {matchDate.toLocaleDateString()} {matchDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Button>

          {showDatePicker && (
            <DateTimePicker
              value={matchDate}
              mode="datetime"
              display="default"
              onChange={onDateChange}
            />
          )}

          <Button
            mode="contained"
            onPress={handleCreateMatch}
            loading={loading}
            disabled={loading}
            style={styles.createButton}
            contentStyle={styles.buttonContent}
          >
            Create Match
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
  dateButton: {
    marginBottom: 15,
    borderColor: '#1a472a',
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

export default CreateMatchScreen;
