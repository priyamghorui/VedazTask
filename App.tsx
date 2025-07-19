/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { NewAppScreen } from '@react-native/new-app-screen';
import { useEffect } from 'react';
import {
  Alert,
  NativeModules,
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
} from 'react-native';
import messaging, {
  AuthorizationStatus,
  getInitialNotification,
  getMessaging,
  getToken,
  onMessage,
  onNotificationOpenedApp,
  requestPermission,
  setBackgroundMessageHandler,
} from '@react-native-firebase/messaging';
import notifee, { AndroidImportance } from '@notifee/react-native';
import { getApp } from '@react-native-firebase/app';
import Navegation from './Navegation';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';



import { Provider } from 'react-redux';
import store from './redux/store/store';
function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const messaging = getMessaging(getApp());

  useEffect(() => {
  
    requestUserPermission();
    createChannel();
  }, []);
  async function createChannel() {
    await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
      importance: AndroidImportance.HIGH, // 👈 needed for popup
      sound: 'default',
    });
  }
  async function requestUserPermission() {
    const authStatus = await requestPermission(messaging);
    const enabled =
      authStatus === AuthorizationStatus.AUTHORIZED ||
      authStatus === AuthorizationStatus.PROVISIONAL;
    const fcmToken = await getToken(messaging);
    console.log('FCM Token:', fcmToken);
    if (enabled) {
      console.log('Notification permission enabled:', authStatus);
    }
  }

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <NavigationContainer>
          <Navegation />
        </NavigationContainer>
      </SafeAreaProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
