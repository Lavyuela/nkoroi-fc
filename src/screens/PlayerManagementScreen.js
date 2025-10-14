import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Alert, ScrollView } from 'react-native';
import { Text, Card, Appbar, FAB, Portal, Dialog, TextInput, Button, Chip, IconButton, Menu } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';
import { getAllPlayers, addPlayer, updatePlayer, deletePlayer } from '../services/firebaseService';

const PlayerManagementScreen = ({ navigation }) => {
  const { isAdmin } = useAuth();
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [menuVisible, setMenuVisible] = useState({});
  
  // Form fields
  const [name, setName] = useState('');
  const [jerseyNumber, setJerseyNumber] = useState('');
  const [position, setPosition] = useState('Forward');
  const [nationality, setNationality] = useState('');

  const positions = ['Goalkeeper', 'Defender', 'Midfielder', 'Forward'];

  useEffect(() => {
    if (!isAdmin) {
      navigation.replace('Home');
      return;
    }
    loadPlayers();
  }, [isAdmin]);

  const loadPlayers = async () => {
    try {
      const playersList = await getAllPlayers();
      setPlayers(playersList);
      setLoading(false);
    } catch (error) {
      console.error('Error loading players:', error);
      setLoading(false);
    }
  };

  const openDialog = (player = null) => {
    if (player) {
      setEditingPlayer(player);
      setName(player.name);
      setJerseyNumber(player.jerseyNumber?.toString() || '');
      setPosition(player.position || 'Forward');
      setNationality(player.nationality || '');
    } else {
      setEditingPlayer(null);
      setName('');
      setJerseyNumber('');
      setPosition('Forward');
      setNationality('');
    }
    setDialogVisible(true);
  };

  const closeDialog = () => {
    setDialogVisible(false);
    setEditingPlayer(null);
    setName('');
    setJerseyNumber('');
    setPosition('Forward');
    setNationality('');
  };

  const handleSavePlayer = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter player name');
      return;
    }

    const playerData = {
      name: name.trim(),
      jerseyNumber: jerseyNumber ? parseInt(jerseyNumber) : null,
      position,
      nationality: nationality.trim(),
    };

    try {
      let result;
      if (editingPlayer) {
        result = await updatePlayer(editingPlayer.id, playerData);
      } else {
        result = await addPlayer(playerData);
      }

      if (result.success) {
        Alert.alert('Success', editingPlayer ? 'Player updated' : 'Player added');
        closeDialog();
        loadPlayers();
      } else {
        Alert.alert('Error', result.error || 'Failed to save player');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to save player');
    }
  };

  const handleDeletePlayer = async (player) => {
    Alert.alert(
      'Delete Player',
      `Are you sure you want to delete ${player.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const result = await deletePlayer(player.id);
            if (result.success) {
              Alert.alert('Success', 'Player deleted');
              loadPlayers();
            } else {
              Alert.alert('Error', result.error || 'Failed to delete player');
            }
          },
        },
      ]
    );
  };

  const openMenu = (playerId) => {
    setMenuVisible({ ...menuVisible, [playerId]: true });
  };

  const closeMenu = (playerId) => {
    setMenuVisible({ ...menuVisible, [playerId]: false });
  };

  const getPositionColor = (pos) => {
    switch (pos) {
      case 'Goalkeeper': return '#f44336';
      case 'Defender': return '#2196F3';
      case 'Midfielder': return '#4CAF50';
      case 'Forward': return '#FF9800';
      default: return '#9E9E9E';
    }
  };

  const renderPlayer = ({ item }) => (
    <Card style={styles.playerCard}>
      <Card.Content>
        <View style={styles.playerRow}>
          <View style={styles.jerseyCircle}>
            <Text style={styles.jerseyNumber}>
              {item.jerseyNumber || '?'}
            </Text>
          </View>
          
          <View style={styles.playerInfo}>
            <Text style={styles.playerName}>{item.name}</Text>
            <View style={styles.playerMeta}>
              <Chip 
                mode="flat" 
                style={[styles.positionChip, { backgroundColor: getPositionColor(item.position) }]}
                textStyle={styles.chipText}
              >
                {item.position}
              </Chip>
              {item.nationality && (
                <Text style={styles.nationality}>🌍 {item.nationality}</Text>
              )}
            </View>
          </View>

          <Menu
            visible={menuVisible[item.id] || false}
            onDismiss={() => closeMenu(item.id)}
            anchor={
              <IconButton
                icon="dots-vertical"
                onPress={() => openMenu(item.id)}
              />
            }
          >
            <Menu.Item
              leadingIcon="pencil"
              onPress={() => {
                closeMenu(item.id);
                openDialog(item);
              }}
              title="Edit"
            />
            <Menu.Item
              leadingIcon="delete"
              onPress={() => {
                closeMenu(item.id);
                handleDeletePlayer(item);
              }}
              title="Delete"
              titleStyle={{ color: '#f44336' }}
            />
          </Menu>
        </View>
      </Card.Content>
    </Card>
  );

  const playersByPosition = positions.map(pos => ({
    position: pos,
    players: players.filter(p => p.position === pos),
    count: players.filter(p => p.position === pos).length,
  }));

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Player Management" />
        <Appbar.Action icon="refresh" onPress={loadPlayers} />
      </Appbar.Header>

      <ScrollView style={styles.content}>
        <View style={styles.statsRow}>
          {playersByPosition.map((item, index) => (
            <Chip 
              key={index}
              style={[styles.statChip, { backgroundColor: getPositionColor(item.position) }]}
              textStyle={styles.statChipText}
            >
              {item.position.substring(0, 3)}: {item.count}
            </Chip>
          ))}
        </View>

        <FlatList
          data={players}
          renderItem={renderPlayer}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          ListEmptyComponent={
            <Card style={styles.emptyCard}>
              <Card.Content>
                <Text style={styles.emptyText}>No players added yet</Text>
                <Text style={styles.emptySubtext}>Tap the + button to add players</Text>
              </Card.Content>
            </Card>
          }
        />
      </ScrollView>

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => openDialog()}
        label="Add Player"
      />

      <Portal>
        <Dialog visible={dialogVisible} onDismiss={closeDialog}>
          <Dialog.Title>{editingPlayer ? 'Edit Player' : 'Add Player'}</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Player Name *"
              value={name}
              onChangeText={setName}
              mode="outlined"
              style={styles.input}
            />
            
            <TextInput
              label="Jersey Number"
              value={jerseyNumber}
              onChangeText={setJerseyNumber}
              mode="outlined"
              keyboardType="number-pad"
              style={styles.input}
            />

            <Text style={styles.label}>Position</Text>
            <View style={styles.positionButtons}>
              {positions.map((pos) => (
                <Chip
                  key={pos}
                  selected={position === pos}
                  onPress={() => setPosition(pos)}
                  style={[
                    styles.positionButton,
                    position === pos && { backgroundColor: getPositionColor(pos) }
                  ]}
                  textStyle={position === pos && { color: '#fff' }}
                >
                  {pos}
                </Chip>
              ))}
            </View>

            <TextInput
              label="Nationality"
              value={nationality}
              onChangeText={setNationality}
              mode="outlined"
              style={styles.input}
              placeholder="e.g., Kenyan"
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={closeDialog}>Cancel</Button>
            <Button onPress={handleSavePlayer} mode="contained">
              {editingPlayer ? 'Update' : 'Add'}
            </Button>
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
    backgroundColor: '#1a472a',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  statChip: {
    marginBottom: 8,
  },
  statChipText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  playerCard: {
    marginBottom: 12,
    elevation: 2,
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  jerseyCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#1a472a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  jerseyNumber: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  playerInfo: {
    flex: 1,
    marginLeft: 16,
  },
  playerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a472a',
    marginBottom: 4,
  },
  playerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  positionChip: {
    marginRight: 8,
    height: 24,
  },
  chipText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  nationality: {
    fontSize: 12,
    color: '#666',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 80,
    backgroundColor: '#4FC3F7',
  },
  emptyCard: {
    marginTop: 32,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptySubtext: {
    textAlign: 'center',
    color: '#999',
    fontSize: 14,
  },
  input: {
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a472a',
    marginBottom: 8,
    marginTop: 8,
  },
  positionButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  positionButton: {
    marginRight: 8,
    marginBottom: 8,
  },
});

export default PlayerManagementScreen;
