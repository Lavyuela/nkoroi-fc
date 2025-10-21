import { registerRootComponent } from 'expo';

import App from './App';

// Background handler is registered in src/services/notificationService.js
// to avoid duplicate registrations

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
