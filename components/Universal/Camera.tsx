import * as React from 'react';
import { View } from 'react-native';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const Camera = () => {

  return (
    <View style={{marginRight:9}}>

    <MaterialCommunityIcons name="camera-outline" size={26} color={'black'}/>
    </View>
  );
};

export default Camera;