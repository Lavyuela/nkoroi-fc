import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, Alert } from 'react-native';
import { Text, Card, FAB, Appbar, ActivityIndicator, Chip, IconButton, Menu } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';
import { deleteUpdate } from '../services/firebaseService';
import firestore from '@react-native-firebase/firestore';

const TeamUpdatesScreen = ({ navigation }) => {
  const { isAdmin } = useAuth();
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [menuVisible, setMenuVisible] = useState({});

  useEffect(() => {
    loadUpdates();
  }, []);

  const loadUpdates = async () => {
    try {
      // Real-time listener for updates
      const unsubscribe = firestore()
        .collection('updates')
        .orderBy('createdAt', 'desc')
        .onSnapshot((snapshot) => {
          const updatesData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            timestamp: doc.data().createdAt?.toMillis() || Date.now(),
          }));
          setUpdates(updatesData);
          setLoading(false);
          setRefreshing(false);
        });
      
      return unsubscribe;
    } catch (error) {
      console.log('Error loading updates:', error);
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadUpdates();
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'announcement':
        return '#2196f3';
      case 'training':
        return '#ff9800';
      case 'match':
        return '#4caf50';
      case 'injury':
        return '#f44336';
      default:
        return '#757575';
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'announcement':
        return '📢 Announcement';
      case 'training':
        return '🏃 Training';
      case 'match':
        return '⚽ Match';
      case 'injury':
        return '🏥 Injury Report';
      default:
        return type;
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const openMenu = (updateId) => {
    setMenuVisible({ ...menuVisible, [updateId]: true });
  };

  const closeMenu = (updateId) => {
    setMenuVisible({ ...menuVisible, [updateId]: false });
  };

  const handleDeleteUpdate = (update) => {
    Alert.alert(
      'Delete Update',
      `Are you sure you want to delete "${update.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            closeMenu(update.id);
            const result = await deleteUpdate(update.id);
            if (result.success) {
              Alert.alert('Success', 'Update deleted successfully');
            } else {
              Alert.alert('Error', result.error || 'Failed to delete update');
            }
          },
        },
      ]
    );
  };

  const renderUpdate = ({ item }) => (
    <Card style={styles.updateCard}>
      <Card.Content>
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            <Chip
              mode="flat"
              style={[styles.typeChip, { backgroundColor: getTypeColor(item.type) }]}
              textStyle={styles.typeText}
            >
              {getTypeLabel(item.type)}
            </Chip>
            <Text style={styles.timeText}>{formatDate(item.timestamp)}</Text>
          </View>
          {isAdmin && (
            <Menu
              visible={menuVisible[item.id] || false}
              onDismiss={() => closeMenu(item.id)}
              anchor={
                <IconButton
                  icon="dots-vertical"
                  size={20}
                  onPress={() => openMenu(item.id)}
                />
              }
            >
              <Menu.Item
                leadingIcon="delete"
                onPress={() => handleDeleteUpdate(item)}
                title="Delete"
                titleStyle={{ color: '#f44336' }}
              />
            </Menu>
          )}
        </View>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.content}>{item.content}</Text>
      </Card.Content>
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4FC3F7" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={() => navigation.goBack()} color="#fff" />
        <Appbar.Content title="Team Updates" titleStyle={styles.headerTitle} />
      </Appbar.Header>

      <FlatList
        data={updates}
        renderItem={renderUpdate}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>📰</Text>
            <Text style={styles.emptyTitle}>No updates yet</Text>
            <Text style={styles.emptySubtitle}>Check back later for team news</Text>
          </View>
        }
      />

      {isAdmin && (
        <FAB
          icon="plus"
          style={styles.fab}
          onPress={() => navigation.navigate('CreateUpdate')}
          color="#fff"
        />
      )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 15,
  },
  updateCard: {
    marginBottom: 15,
    elevation: 3,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  typeChip: {
    height: 28,
  },
  typeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 11,
  },
  timeText: {
    fontSize: 12,
    color: '#999',
    marginLeft: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#0277BD',
  },
  content: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    fontSize: 80,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#666',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#4FC3F7',
  },
});

export default TeamUpdatesScreen;
