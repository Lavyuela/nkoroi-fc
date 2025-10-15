import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, Alert, TouchableOpacity, Image } from 'react-native';
import Share from 'react-native-share';
import { Text, Appbar, Button, TextInput, Menu, Card, Chip, Portal, Dialog, FAB } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';
import firestore from '@react-native-firebase/firestore';
import ViewShot from 'react-native-view-shot';
import GraphicTemplate from '../components/GraphicTemplate';

const FORMATIONS = {
  '4-4-2': { defenders: 4, midfielders: 4, forwards: 2 },
  '4-3-3': { defenders: 4, midfielders: 3, forwards: 3 },
  '4-2-3-1': { defenders: 4, midfielders: 5, forwards: 1 },
  '3-5-2': { defenders: 3, midfielders: 5, forwards: 2 },
  '3-4-3': { defenders: 3, midfielders: 4, forwards: 3 },
};

const LineupGraphicScreen = ({ route, navigation }) => {
  const { matchId } = route.params || {};
  const { isAdmin } = useAuth();
  const viewShotRef = useRef();

  const [match, setMatch] = useState(null);
  const [players, setPlayers] = useState([]);
  const [formation, setFormation] = useState('4-4-2');
  const [showFormationMenu, setShowFormationMenu] = useState(false);
  const [lineup, setLineup] = useState({
    goalkeeper: null,
    defenders: [],
    midfielders: [],
    forwards: [],
  });
  const [substitutes, setSubstitutes] = useState([]);
  const [coach, setCoach] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [showPlayerDialog, setShowPlayerDialog] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);

  useEffect(() => {
    if (!isAdmin) {
      navigation.replace('Home');
      return;
    }
    loadMatch();
    loadPlayers();
  }, []);

  const loadMatch = async () => {
    if (matchId) {
      const unsubscribe = firestore()
        .collection('matches')
        .doc(matchId)
        .onSnapshot((doc) => {
          if (doc.exists) {
            setMatch({ id: doc.id, ...doc.data() });
          }
        });
      return () => unsubscribe();
    }
  };

  const loadPlayers = () => {
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
        setPlayers(playersList);
      });
    return () => unsubscribe();
  };

  const formatPlayerName = (player) => {
    if (!player) return '';
    const names = player.name.split(' ');
    if (names.length === 1) return player.name;
    const initial = names[0][0];
    const surname = names[names.length - 1];
    return `${initial}. ${surname}`;
  };

  const selectPlayer = (position, index = null) => {
    setSelectedPosition(position);
    setSelectedIndex(index);
    setShowPlayerDialog(true);
  };

  const handlePlayerSelect = (player) => {
    assignPlayer(selectedPosition, player, selectedIndex);
    setShowPlayerDialog(false);
    setSelectedPosition(null);
    setSelectedIndex(null);
  };

  const assignPlayer = (position, player, index) => {
    const newLineup = { ...lineup };
    if (position === 'goalkeeper') {
      newLineup.goalkeeper = player;
    } else if (index !== null) {
      newLineup[position][index] = player;
    }
    setLineup(newLineup);
  };

  const initializeFormation = (formationKey) => {
    const form = FORMATIONS[formationKey];
    setLineup({
      goalkeeper: null,
      defenders: Array(form.defenders).fill(null),
      midfielders: Array(form.midfielders).fill(null),
      forwards: Array(form.forwards).fill(null),
    });
  };

  const captureAndShare = async () => {
    try {
      // Ensure preview is shown
      if (!showPreview) {
        setShowPreview(true);
        // Wait for preview to render
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      if (!viewShotRef.current) {
        Alert.alert('Error', 'Unable to generate image. Please try again.');
        return;
      }
      
      const uri = await viewShotRef.current.capture();
      
      await Share.open({
        title: 'Nkoroi FC Lineup',
        message: `Nkoroi FC Lineup - ${match?.homeTeam} vs ${match?.awayTeam}`,
        url: `file://${uri}`,
        type: 'image/jpeg',
      });
    } catch (error) {
      if (error.message !== 'User did not share') {
        console.error('Share error:', error);
        Alert.alert('Error', 'Failed to share lineup: ' + error.message);
      }
    }
  };

  const renderPitch = () => {
    const form = FORMATIONS[formation];
    return (
      <View style={styles.pitch}>
        {/* Forwards */}
        <View style={styles.line}>
          {lineup.forwards.map((player, index) => (
            <TouchableOpacity
              key={index}
              style={styles.playerSlot}
              onPress={() => selectPlayer('forwards', index)}
            >
              <View style={styles.playerCircle}>
                <Text style={styles.playerNumber}>
                  {player?.jerseyNumber || 'FW'}
                </Text>
              </View>
              <Text style={styles.playerName}>
                {player ? formatPlayerName(player) : 'Select'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Midfielders */}
        <View style={styles.line}>
          {lineup.midfielders.map((player, index) => (
            <TouchableOpacity
              key={index}
              style={styles.playerSlot}
              onPress={() => selectPlayer('midfielders', index)}
            >
              <View style={styles.playerCircle}>
                <Text style={styles.playerNumber}>
                  {player?.jerseyNumber || 'MF'}
                </Text>
              </View>
              <Text style={styles.playerName}>
                {player ? formatPlayerName(player) : 'Select'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Defenders */}
        <View style={styles.line}>
          {lineup.defenders.map((player, index) => (
            <TouchableOpacity
              key={index}
              style={styles.playerSlot}
              onPress={() => selectPlayer('defenders', index)}
            >
              <View style={styles.playerCircle}>
                <Text style={styles.playerNumber}>
                  {player?.jerseyNumber || 'DF'}
                </Text>
              </View>
              <Text style={styles.playerName}>
                {player ? formatPlayerName(player) : 'Select'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Goalkeeper */}
        <View style={styles.line}>
          <TouchableOpacity
            style={styles.playerSlot}
            onPress={() => selectPlayer('goalkeeper')}
          >
            <View style={[styles.playerCircle, styles.gkCircle]}>
              <Text style={styles.playerNumber}>
                {lineup.goalkeeper?.jerseyNumber || 'GK'}
              </Text>
            </View>
            <Text style={styles.playerName}>
              {lineup.goalkeeper ? formatPlayerName(lineup.goalkeeper) : 'Select GK'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderPreview = () => (
    <ViewShot ref={viewShotRef} options={{ format: 'jpg', quality: 0.9 }}>
      <GraphicTemplate
        title={`${match?.homeTeam} vs ${match?.awayTeam}`}
        subtitle={`Formation: ${formation}`}
      >
        {renderPitch()}
        
        {/* Substitutes */}
        {substitutes.length > 0 && (
          <View style={styles.substitutesSection}>
            <Text style={styles.sectionTitle}>Substitutes</Text>
            <View style={styles.substitutesList}>
              {substitutes.map((player, index) => (
                <Text key={index} style={styles.substituteText}>
                  {player.jerseyNumber}. {formatPlayerName(player)}
                </Text>
              ))}
            </View>
          </View>
        )}

        {/* Coach */}
        {coach && (
          <View style={styles.coachSection}>
            <Text style={styles.coachLabel}>Coach:</Text>
            <Text style={styles.coachName}>{coach}</Text>
          </View>
        )}
      </GraphicTemplate>
    </ViewShot>
  );

  if (!isAdmin) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Create Lineup" />
        <Appbar.Action
          icon="eye"
          onPress={() => setShowPreview(!showPreview)}
        />
      </Appbar.Header>

      <ScrollView style={styles.content}>
        {/* Formation Selector */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.label}>Formation</Text>
            <Menu
              visible={showFormationMenu}
              onDismiss={() => setShowFormationMenu(false)}
              anchor={
                <Button
                  mode="outlined"
                  onPress={() => setShowFormationMenu(true)}
                >
                  {formation}
                </Button>
              }
            >
              {Object.keys(FORMATIONS).map((key) => (
                <Menu.Item
                  key={key}
                  onPress={() => {
                    setFormation(key);
                    initializeFormation(key);
                    setShowFormationMenu(false);
                  }}
                  title={key}
                />
              ))}
            </Menu>
          </Card.Content>
        </Card>

        {/* Pitch */}
        {!showPreview && (
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.label}>Select Players</Text>
              {renderPitch()}
            </Card.Content>
          </Card>
        )}

        {/* Coach Input */}
        <Card style={styles.card}>
          <Card.Content>
            <TextInput
              label="Coach Name"
              value={coach}
              onChangeText={setCoach}
              mode="outlined"
            />
          </Card.Content>
        </Card>

        {/* Preview - Always render but hide when not needed */}
        <View style={showPreview ? {} : { height: 0, overflow: 'hidden' }}>
          {renderPreview()}
        </View>
      </ScrollView>

      {/* Player Selection Dialog */}
      <Portal>
        <Dialog visible={showPlayerDialog} onDismiss={() => setShowPlayerDialog(false)}>
          <Dialog.Title>Select Player</Dialog.Title>
          <Dialog.Content>
            <ScrollView style={{ maxHeight: 400 }}>
              {players.map((player) => (
                <TouchableOpacity
                  key={player.id}
                  style={styles.playerItem}
                  onPress={() => handlePlayerSelect(player)}
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
              ))}
            </ScrollView>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowPlayerDialog(false)}>Cancel</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Floating Share Button */}
      <FAB
        icon="share"
        label="Share Lineup"
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
  card: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1a472a',
  },
  pitch: {
    backgroundColor: '#2d5016',
    borderRadius: 10,
    padding: 20,
    minHeight: 400,
    justifyContent: 'space-between',
  },
  line: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  playerSlot: {
    alignItems: 'center',
  },
  playerCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#87CEEB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  gkCircle: {
    backgroundColor: '#FFD700',
  },
  playerNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a472a',
  },
  playerName: {
    fontSize: 12,
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  substitutesSection: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1a472a',
  },
  substitutesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  substituteText: {
    fontSize: 14,
    marginRight: 15,
    marginBottom: 5,
    color: '#666',
  },
  coachSection: {
    marginTop: 15,
    alignItems: 'center',
  },
  coachLabel: {
    fontSize: 14,
    color: '#666',
  },
  coachName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a472a',
  },
  actions: {
    marginTop: 20,
    marginBottom: 30,
  },
  shareButton: {
    backgroundColor: '#87CEEB',
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
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 80,
    backgroundColor: '#87CEEB',
  },
});

export default LineupGraphicScreen;
