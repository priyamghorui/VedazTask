import * as React from 'react';
import { ScrollView, View } from 'react-native';
import { Avatar, Badge, Text } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector } from 'react-redux';

const ChatsContent = () => {
  const reduxNewMessage = useSelector(state => state.messageNotificaionReducer);
  const [messageCount, setmessageCount] = React.useState(0);
  React.useEffect(() => {
    setmessageCount(reduxNewMessage.length)
  }, [reduxNewMessage]);
  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <View
          style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}
        >
          <Avatar.Image
            size={59}
            source={require('../../assets/image/userdp.jpg')}
          />
          <View style={{ marginLeft: 10 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>John Smith</Text>
            <Text variant="titleMedium" style={{ color: 'grey' }}>
              hello....
            </Text>
          </View>
        </View>
        <View>
          <Text style={{ color: 'grey' }}>15/2/2024</Text>
          {messageCount != 0 ? (
            <Badge size={22} style={{ backgroundColor: 'green' }}>
              {messageCount}
            </Badge>
          ) : (
            <></>
          )}
        </View>
      </View>
    </View>
  );
};

export default ChatsContent;
