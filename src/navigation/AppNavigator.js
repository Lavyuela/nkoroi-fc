import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../context/AuthContext';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

// Screens
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import MatchDetailScreen from '../screens/MatchDetailScreen';
import CreateMatchScreen from '../screens/CreateMatchScreen';
import TeamUpdatesScreen from '../screens/TeamUpdatesScreen';
import TeamStatsScreen from '../screens/TeamStatsScreen';
import CreateUpdateScreen from '../screens/CreateUpdateScreen';
import AccountScreen from '../screens/AccountScreen';
import SettingsScreen from '../screens/SettingsScreen';
import AdminDashboardScreen from '../screens/AdminDashboardScreen';
import AdminNotificationScreen from '../screens/AdminNotificationScreen';
import UserManagementScreen from '../screens/UserManagementScreen';
import AnalyticsScreen from '../screens/AnalyticsScreen';
import TestNotificationScreen from '../screens/TestNotificationScreen';
import PlayerManagementScreen from '../screens/PlayerManagementScreen';
import LineupGraphicScreen from '../screens/LineupGraphicScreen';
import MatchResultGraphicScreen from '../screens/MatchResultGraphicScreen';
import PreMatchAnnouncementScreen from '../screens/PreMatchAnnouncementScreen';
import FanReactionScreen from '../screens/FanReactionScreen';
import NotificationTestScreen from '../screens/NotificationTestScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1a472a" />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {!user ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="MatchDetail" component={MatchDetailScreen} />
          <Stack.Screen name="CreateMatch" component={CreateMatchScreen} />
          <Stack.Screen name="TeamUpdates" component={TeamUpdatesScreen} />
          <Stack.Screen name="TeamStats" component={TeamStatsScreen} />
          <Stack.Screen name="CreateUpdate" component={CreateUpdateScreen} />
          <Stack.Screen name="Account" component={AccountScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
          <Stack.Screen name="AdminNotification" component={AdminNotificationScreen} />
          <Stack.Screen name="UserManagement" component={UserManagementScreen} />
          <Stack.Screen name="PlayerManagement" component={PlayerManagementScreen} />
          <Stack.Screen name="Analytics" component={AnalyticsScreen} />
          <Stack.Screen name="TestNotification" component={TestNotificationScreen} />
          <Stack.Screen name="NotificationTest" component={NotificationTestScreen} />
          <Stack.Screen name="LineupGraphic" component={LineupGraphicScreen} />
          <Stack.Screen name="MatchResultGraphic" component={MatchResultGraphicScreen} />
          <Stack.Screen name="PreMatchAnnouncement" component={PreMatchAnnouncementScreen} />
          <Stack.Screen name="FanReaction" component={FanReactionScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
});

export default AppNavigator;
