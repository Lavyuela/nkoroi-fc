import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Text, Appbar, Snackbar } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';

const CreateMatchScreen = ({ navigation }) => {
  const [homeTeam, setHomeTeam] = useState('');
  const [awayTeam, setAwayTeam] = useState('');
  const [venue, setVenue] = useState('');
  const [matchDate, setMatchDate] = useState(new Date());
  const [matchTime, setMatchTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [pickerMode, setPickerMode] = useState('date');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleCreateMatch = async () => {
    if (!homeTeam || !awayTeam) {
      setError('Please enter both team names');
      return;
    }

    setLoading(true);
    
    try {
      // DEMO MODE: Save to AsyncStorage
      const matchId = 'match-' + Date.now();
      const newMatch = {
        id: matchId,
        homeTeam,
        awayTeam,
        venue,
        matchDate: matchDate.getTime(),
        homeScore: 0,
        awayScore: 0,
        status: 'upcoming',
        events: [],
        createdAt: Date.now(),
      };
      
      const savedMatches = await AsyncStorage.getItem('demoMatches');
      const matches = savedMatches ? JSON.parse(savedMatches) : [];
      matches.push(newMatch);
      
      // Save and navigate back immediately
      AsyncStorage.setItem('demoMatches', JSON.stringify(matches));
      navigation.goBack();
    } catch (error) {
      setError('Failed to create match');
    } finally {
      setLoading(false);
    }
  };

  const onDateChange = (event, selectedDate) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
      setShowTimePicker(false);
    }
    
    if (selectedDate) {
      if (pickerMode === 'date') {
        setMatchDate(selectedDate);
        if (Platform.OS === 'android') {
          // After selecting date, show time picker
          setTimeout(() => {
            setPickerMode('time');
            setShowTimePicker(true);
          }, 100);
        }
      } else {
        setMatchTime(selectedDate);
        // Combine date and time
        const combined = new Date(matchDate);
        combined.setHours(selectedDate.getHours());
        combined.setMinutes(selectedDate.getMinutes());
        setMatchDate(combined);
        setMatchTime(combined);
      }
    }
    
    if (Platform.OS === 'ios') {
      setShowDatePicker(false);
      setShowTimePicker(false);
    }
  };

  const showDateTimePicker = () => {
    setPickerMode('date');
    setShowDatePicker(true);
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

          <Text style={styles.dateLabel}>📅 Match Date & Time</Text>
          
          <View style={styles.dateTimeContainer}>
            <Button
              mode="outlined"
              onPress={showDateTimePicker}
              style={styles.dateButton}
              icon="calendar"
            >
              📅 {matchDate.toLocaleDateString()}
            </Button>
            
            <Button
              mode="outlined"
              onPress={() => {
                setPickerMode('time');
                setShowTimePicker(true);
              }}
              style={styles.timeButton}
              icon="clock"
            >
              🕒 {matchDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Button>
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={matchDate}
              mode="date"
              display="default"
              onChange={onDateChange}
              minimumDate={new Date(2020, 0, 1)}
              maximumDate={new Date(2030, 11, 31)}
            />
          )}

          {showTimePicker && (
            <DateTimePicker
              value={matchTime}
              mode="time"
              display="default"
              onChange={onDateChange}
            />
          )}

          <Text style={styles.selectedDateTime}>
            Selected: {matchDate.toLocaleDateString()} at {matchDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>

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
    backgroundColor: '#4FC3F7',
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
  },
  dateLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0277BD',
    marginBottom: 15,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  dateButton: {
    flex: 1,
    marginRight: 5,
    borderColor: '#4FC3F7',
  },
  timeButton: {
    flex: 1,
    marginLeft: 5,
    borderColor: '#4FC3F7',
  },
  selectedDateTime: {
    fontSize: 14,
    color: '#4caf50',
    textAlign: 'center',
    marginBottom: 15,
    fontWeight: 'bold',
  },
  createButton: {
    marginTop: 20,
    backgroundColor: '#4FC3F7',
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
