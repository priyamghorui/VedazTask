import * as React from 'react';
import {
  Dimensions,
  FlatList,
  ImageBackground,
  NativeModules,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  ActivityIndicator,
  Avatar,
  Card,
  IconButton,
  MD2Colors,
  Text,
} from 'react-native-paper';
import HeadTitle from '../components/Universal/HeadTitle';
import QrCode from '../components/Universal/QrCode';
import Camera from '../components/Universal/Camera';
import Settings from '../components/Universal/Settings';
import ImportUser from '../components/Universal/ImportUser';
import Status from '../components/Updates/Status';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SearchLogo from '../components/Universal/SearchLogo';
import Video from '../components/Universal/Video';
import CallsIcon from '../components/Universal/CallsIcon';
import TypeMassage from '../components/Chats/IndivisualChatComponents/TypeMassage';
import MicrophoneIcon from '../components/Chats/IndivisualChatComponents/MicrophoneIcon';
import img from '../assets/image/BackgroundimgWhatApp.jpg';
import SentAndReciveData from '../components/Chats/IndivisualChatComponents/SentAndReciveData';
import ForwardIcon from '../components/Chats/IndivisualChatComponents/ForwardIcon';
import { useDispatch, useSelector } from 'react-redux';
import { newMessageReset, sendChat, sendChatReset } from '../redux/action/action';
import SentIcon from '../components/Chats/IndivisualChatComponents/SentIcon';

export default function IndivisualChat({ navigation }) {
  const dispatch = useDispatch();
  const reduxSentChat = useSelector(state => state.sendchatreducer);
  const [receivedData, setReceivedData] = React.useState('');
  const onDataReceived = data => {
    setReceivedData(data);
  };
  React.useEffect(() => {
    setReceivedData('');
  }, [reduxSentChat]);
  React.useEffect(() => {
    console.log("reset");
    
    dispatch(newMessageReset());
  }, []);
  React.useEffect(() => {
      NativeModules.NotificationStorage.getAllNotifications().then(json => {
          const data = JSON.parse(json);
          // console.log(data);
          dispatch(sendChatReset());
          // 1. Get the keys and sort them numerically
          const sortedKeys = Object.keys(data).sort(
            (a, b) => Number(a) - Number(b),
          );
    
          // 2. Create a new object with sorted keys (maintaining order)
          const sortedData = {};
          sortedKeys.forEach(key => {
            sortedData[key] = data[key];
          });
    
          // console.log(sortedData);
          Object.values(sortedData).forEach(itemStr => {
            try {
              const item = JSON.parse(itemStr);
              dispatch(
                sendChat({
                  sendChatData: item.body,
                  orientation: 'flex-start',
                  time: new Date(item.timestamp).toTimeString().slice(0, 5),
                }),
              );
              // console.log('🔔 Title:', item.body);
              // console.log(
              //   '🕒 Timestamp:',
              //   new Date(item.timestamp).toTimeString().slice(0, 5),
              // );
            } catch (e) {
              console.error('❌ JSON parse failed:', e);
            }
          });
        });
  }, []);
  const flatListRef = React.useRef(null);
  React.useEffect(() => {
    if (flatListRef.current) {
      // Use setTimeout for FlatList as well, for similar reasons as ScrollView
      setTimeout(() => {
        flatListRef.current.scrollToEnd({ animated: true });
      }, 1000);
    }
  }, []);
  // const image = {uri: 'https://legacy.reactjs.org/logo-og.png'};
  const renderItem = ({ item ,index}) => (
    <View key={index}>
      <SentAndReciveData
        side={item.orientation}
        data={{
          date: '1/2/2000',
          massage: item.sendChatData,
          time: item.time,
        }}
        // displayViewStatus={'#6BD0FF'}
        displayViewStatus={'grey'}
      />
    </View>
  );
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor: '#fff',
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 8,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
            style={{ marginRight: 8 }}
          >
            <MaterialCommunityIcons
              name="arrow-left"
              size={34}
              color={'black'}
            />
          </TouchableOpacity>
          <Avatar.Image
            size={50}
            source={require('../assets/image/userdp.jpg')}
          />
          <View style={{ marginLeft: 10 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>John Smith</Text>
            <Text style={{ color: 'grey' }}>23:10</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Video />
          <CallsIcon />
          <Settings />
        </View>
      </View>
      <View style={{ flex: 1 }}>
        <ImageBackground
          source={img}
          resizeMode="cover"
          style={{
            height: Dimensions.get('window').height,
            flex: 1,
            flexDirection: 'column',
          }}
        >
          {/* <ScrollView showsVerticalScrollIndicator={false}>

          <View style={{ margin: 16 }}>
            {reduxSentChat.length != 0 ? (
              reduxSentChat.map((element, index) => (
                <View key={index}>
                  <SentAndReciveData
                    side={element.orientation}
                    data={{
                      date: '1/2/2000',
                      massage: element.sendChatData,
                      time: element.time,
                    }}
                    // displayViewStatus={'#6BD0FF'}
                    displayViewStatus={'grey'}
                  />
                </View>
              ))
            ) : (
              <View>
                <SentAndReciveData
                  side={'flex-end'}
                  data={{ date: '1/2/2000', massage: 'hello1', time: '10:44' }}
                  displayViewStatus={'#6BD0FF'}
                />
                <SentAndReciveData
                  side={'flex-start'}
                  data={{ date: '1/2/2000', massage: 'hello2', time: '10:44' }}
                  displayViewStatus={'grey'}
                />
              </View>
            )}
          </View>
          </ScrollView> */}
          <FlatList
            ref={flatListRef}
            data={reduxSentChat}
            renderItem={renderItem}
            keyExtractor={(item, index) => String(index)}
            contentContainerStyle={{ marginHorizontal: 10 }}
          />
        </ImageBackground>
        {/* <Text>Received data: {receivedData}</Text> */}
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          padding: 5,
        }}
      >
        <TypeMassage onDataReceived={onDataReceived} />
        {receivedData != '' ? (
          <TouchableOpacity
            onPress={() => {
              // console.log(receivedData);
              if (receivedData != '') {
                dispatch(
                  sendChat({
                    sendChatData: receivedData,
                    orientation: 'flex-end',
                    time: new Date().toLocaleTimeString().slice(0, 5),
                  }),
                );
              }
            }}
          >
            <SentIcon />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity>
            <MicrophoneIcon />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
