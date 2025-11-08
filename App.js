import React, { useEffect, useState } from 'react';
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { Provider as PaperProvider, MD3DarkTheme, MD3LightTheme } from 'react-native-paper';
import { useColorScheme } from 'react-native';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import NotificationService from './src/services/notificationService';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const systemColorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === 'dark');

  // Load theme preference
  useEffect(() => {
    loadThemePreference();
  }, []);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme_preference');
      if (savedTheme) {
        setIsDarkMode(savedTheme === 'dark');
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    }
  };

  const theme = isDarkMode
    ? { ...MD3DarkTheme, colors: { ...MD3DarkTheme.colors, primary: '#87CEEB' } }
    : { ...MD3LightTheme, colors: { ...MD3LightTheme.colors, primary: '#87CEEB' } };

  const navigationTheme = isDarkMode ? DarkTheme : DefaultTheme;

  useEffect(() => {
    // Initialize Notification Service ONCE on app start
    let isInitialized = false;
    
    async function initializeNotifications() {
      if (isInitialized) {
        console.log('⏭️ Notification Service already initialized, skipping');
        return;
      }
      
      console.log('🚀 Initializing Notification Service...');
      
      const currentUser = auth().currentUser;
      try {
        const success = await NotificationService.initialize(currentUser?.uid);
        if (success) {
          isInitialized = true;
          console.log('✅ Notification Service initialized successfully');
        }
      } catch (error) {
        console.error('❌ Notification initialization error:', error);
      }
    }
    
    // Initialize immediately
    initializeNotifications();
    
    // Re-initialize when user logs in (if not already initialized)
    const unsubscribeAuth = auth().onAuthStateChanged(async (user) => {
      if (user && !isInitialized) {
        console.log('🚀 User logged in, initializing notifications for:', user.uid);
        await initializeNotifications();
      }
    });
    
    return () => unsubscribeAuth();
  }, []);

  return (
    <PaperProvider theme={theme}>
      <AuthProvider>
        <NavigationContainer theme={navigationTheme}>
          <AppNavigator isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
        </NavigationContainer>
      </AuthProvider>
    </PaperProvider>
  );
}
