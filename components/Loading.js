import { View, Text, Dimensions } from 'react-native'
import React from 'react'
import * as Progress from 'react-native-progress';
import { theme } from '../theme';

var { width, height } = Dimensions.get('window');

const Loading = () => {
  return (
    <View style={{height, width}} className="absolute flex-row justify-center items-center">
      <Progress.CircleSnail size={100} thickness={10} color={theme.background} />
    </View>
  )
}

export default Loading