import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Image, Alert, TouchableOpacity } from 'react-native';
import { Text, Appbar, Card, FAB } from 'react-native-paper';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';

const SavedGraphicsScreen = ({ navigation }) => {
  const [graphics, setGraphics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSavedGraphics();
  }, []);

  const loadSavedGraphics = async () => {
    try {
      const files = await RNFS.readDir(RNFS.DocumentDirectoryPath);
      const imageFiles = files
        .filter(file => file.name.startsWith('NkoroiFC_') && file.name.endsWith('.jpg'))
        .sort((a, b) => b.mtime - a.mtime); // Sort by newest first
      
      setGraphics(imageFiles);
      setLoading(false);
    } catch (error) {
      console.error('Error loading graphics:', error);
      Alert.alert('Error', 'Failed to load saved graphics');
      setLoading(false);
    }
  };

  const shareGraphic = async (filePath) => {
    try {
      await Share.open({
        url: `file://${filePath}`,
        type: 'image/jpeg',
      });
    } catch (error) {
      if (error.message !== 'User did not share') {
        console.error('Share error:', error);
        Alert.alert('Error', 'Failed to share graphic');
      }
    }
  };

  const deleteGraphic = (filePath, fileName) => {
    Alert.alert(
      'Delete Graphic',
      `Are you sure you want to delete ${fileName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await RNFS.unlink(filePath);
              Alert.alert('Success', 'Graphic deleted');
              loadSavedGraphics();
            } catch (error) {
              console.error('Delete error:', error);
              Alert.alert('Error', 'Failed to delete graphic');
            }
          },
        },
      ]
    );
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getGraphicType = (fileName) => {
    if (fileName.includes('Announcement')) return '📢 Announcement';
    if (fileName.includes('Lineup')) return '⚽ Lineup';
    if (fileName.includes('Result')) return '🏆 Result';
    return '📸 Graphic';
  };

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Saved Graphics" titleStyle={styles.headerTitle} />
      </Appbar.Header>

      <ScrollView style={styles.content}>
        {loading ? (
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.loadingText}>Loading graphics...</Text>
            </Card.Content>
          </Card>
        ) : graphics.length === 0 ? (
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.emptyText}>No saved graphics yet</Text>
              <Text style={styles.emptySubtext}>
                Create and save graphics from match details
              </Text>
            </Card.Content>
          </Card>
        ) : (
          graphics.map((graphic, index) => (
            <Card key={index} style={styles.graphicCard}>
              <Card.Content>
                <View style={styles.graphicHeader}>
                  <Text style={styles.graphicType}>{getGraphicType(graphic.name)}</Text>
                  <Text style={styles.graphicDate}>{formatDate(graphic.mtime)}</Text>
                </View>
                
                <TouchableOpacity onPress={() => shareGraphic(graphic.path)}>
                  <Image
                    source={{ uri: `file://${graphic.path}` }}
                    style={styles.graphicImage}
                    resizeMode="contain"
                  />
                </TouchableOpacity>

                <View style={styles.actionButtons}>
                  <FAB
                    icon="share"
                    label="Share"
                    style={styles.shareButton}
                    onPress={() => shareGraphic(graphic.path)}
                    small
                  />
                  <FAB
                    icon="delete"
                    label="Delete"
                    style={styles.deleteButton}
                    onPress={() => deleteGraphic(graphic.path, graphic.name)}
                    small
                  />
                </View>
              </Card.Content>
            </Card>
          ))
        )}

        <Card style={styles.footerCard}>
          <Card.Content>
            <Text style={styles.footerText}>🌍 Nkoroi to the World 🌍</Text>
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
    backgroundColor: '#4FC3F7',
  },
  headerTitle: {
    color: '#fff',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 15,
  },
  card: {
    marginBottom: 15,
    elevation: 3,
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 10,
  },
  emptySubtext: {
    textAlign: 'center',
    fontSize: 14,
    color: '#999',
  },
  graphicCard: {
    marginBottom: 20,
    elevation: 3,
  },
  graphicHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  graphicType: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0277BD',
  },
  graphicDate: {
    fontSize: 12,
    color: '#666',
  },
  graphicImage: {
    width: '100%',
    height: 400,
    borderRadius: 8,
    marginBottom: 15,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  shareButton: {
    backgroundColor: '#4FC3F7',
  },
  deleteButton: {
    backgroundColor: '#d32f2f',
  },
  footerCard: {
    marginTop: 20,
    marginBottom: 30,
    backgroundColor: '#E3F2FD',
    elevation: 2,
  },
  footerText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0277BD',
  },
});

export default SavedGraphicsScreen;
