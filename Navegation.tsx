import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { CommonActions, NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, BottomNavigation } from 'react-native-paper';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Chats from './screens/Chats';
import Updates from './screens/Updates';
import Communities from './screens/Communities';
import Calls from './screens/Calls';
import IndivisualChat from './screens/IndivisualChat';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider, useDispatch, useSelector } from 'react-redux';
import store from './redux/store/store';
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
import { NativeModules } from 'react-native';
import { newMessage, newMessageReset, sendChat, sendChatReset } from './redux/action/action';
import {
  getInitialNotification,
  getMessaging,
  onMessage,
  setBackgroundMessageHandler,
} from '@react-native-firebase/messaging';
import { getApp } from '@react-native-firebase/app';

export default function Navegation() {
  const dispatch = useDispatch();
  const messaging = getMessaging(getApp());
  useEffect(() => {
    onMessage(messaging, async remoteMessage => {
      console.log('FCM Message (foreground).....:', remoteMessage);
      dispatch(
        sendChat({
          sendChatData: remoteMessage?.notification?.body,
          orientation: 'flex-start',
          time: new Date(remoteMessage?.sentTime).toTimeString().slice(0, 5),
        }),
      );
      dispatch(newMessageReset())
      dispatch(
        newMessage({
          sendChatData: remoteMessage?.notification?.body,
          time: new Date(remoteMessage?.sentTime).toTimeString().slice(0, 5),
        }),
      );
    });
  },[]);
  useEffect(() => {
    getInitialNotification(messaging).then(remoteMessage => {
      if (remoteMessage) {
        console.log('Notification caused app to open (killed):', remoteMessage);
        if (
          remoteMessage.notification?.title != '' &&
          remoteMessage.notification?.body != ''
        ) {
          // dispatch(
          //   sendChat({
          //     sendChatData: remoteMessage?.notification?.body,
          //     orientation: 'flex-start',
          //     time: new Date(remoteMessage?.sentTime)
          //       .toTimeString()
          //       .slice(0, 5),
          //   }),
          // );
          dispatch(
            newMessage({
              sendChatData: remoteMessage?.notification?.body,
              time: new Date(remoteMessage?.sentTime)
                .toTimeString()
                .slice(0, 5),
            }),
          );
          NativeModules.NotificationStorage.storeNotification(
            remoteMessage.notification?.title,
            remoteMessage.notification?.body,
          );
        }
      }
    });
    setBackgroundMessageHandler(messaging, async remoteMessage => {
      console.log(remoteMessage.notification);
      if (
        remoteMessage.notification?.title != '' &&
        remoteMessage.notification?.body != ''
      ) {
        dispatch(
          newMessage({
            sendChatData: remoteMessage?.notification?.body,
            time: new Date(remoteMessage?.sentTime).toTimeString().slice(0, 5),
          }),
        );
        NativeModules.NotificationStorage.storeNotification(
          remoteMessage.notification?.title,
          remoteMessage.notification?.body,
        );
      }
    });
  }, []);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#fff' },
      }}
    >
      <Stack.Screen name="NavegationTabBar" component={NavegationTabBar} />

      <Stack.Screen name="IndivisualChat" component={IndivisualChat} />
    </Stack.Navigator>
  );
}

function NavegationTabBar() {
  const reduxNewMessage = useSelector(state => state.messageNotificaionReducer);
  const [messageCount, setmessageCount] = React.useState(0);
  useEffect(() => {
    setmessageCount(reduxNewMessage.length);
  }, [reduxNewMessage]);
  return (
    <Tab.Navigator
      screenOptions={{
        sceneStyle: { backgroundColor: '#fff' },
        headerShown: false,
        tabBarActiveTintColor: 'green',
        tabBarInactiveTintColor: 'black',
        tabBarLabelStyle: { fontSize: 15, bottom: 15 },
        tabBarStyle: {
          margin: 20,
          borderRadius: 10,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.5,
          shadowRadius: 12,
          borderStartWidth: 1,
          height: 50,
          // backgroundColor:"green",
          // height: 100,
        },
        tabBarBadgeStyle: {
          backgroundColor: 'green',
          // borderRadius: 9,
          // width: 30,
          // height: 19,
          // fontSize: 14,
        },
        tabBarIconStyle: { height: 43, width: 43 },

        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="Chats"
        component={Chats}
        options={{
          tabBarLabel: 'Chats',
          tabBarIcon: ({ color, size }) => {
            return (
              <MaterialIcon
                name="mark-unread-chat-alt"
                size={35}
                color={color}
              />
            );
          },
          tabBarBadge: messageCount,
        }}
      />

      <Tab.Screen
        name="Updates"
        component={Updates}
        options={{
          tabBarBadgeStyle: { backgroundColor: 'green', borderRadius: 9 },
          tabBarLabel: 'Updates',
          tabBarIcon: ({ color, size }) => {
            return <Ionicons name="at-circle" size={35} color={color} />;
          },
        }}
      />
      <Tab.Screen
        name="Communities"
        component={Communities}
        options={{
          tabBarLabel: 'Communities',
          tabBarIcon: ({ color, size }) => {
            return <FontAwesome name="users" size={35} color={color} />;
          },
        }}
      />
      <Tab.Screen
        name="Calls"
        component={Calls}
        options={{
          tabBarLabel: 'Calls',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcon name="call" size={35} color={color} />
          ),
        }}
      />
      {/* <Tab.Screen
         
         name="IndivisualChat"
         component={IndivisualChat}
         
         /> */}
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
