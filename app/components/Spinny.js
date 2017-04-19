import React, { Component } from 'react';
import {
  Animated
} from 'react-native';

import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/EvilIcons';

module.exports = class Spinny extends Component {
  constructor(props) {
    super(props);

    this.state = {
      rotate: new Animated.Value(1)
    };
  }

  render() {
    return (
      <Animatable.View
        animation='rotate'
        iterationCount='infinite'
        ref='view'
        easing='linear'
        style={{transform: [{ // Array order matters
          rotate: this.state.rotate.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '360deg'], // 'deg' or 'rad'
          })
        }], marginTop: -2}}>
        <Icon
          name='refresh'
          size={this.props.size || 30}
          backgroundColor='transparent'
          onPress={this.onGetImageData}
          style={{marginTop: 2}}
          color={this.props.color || '#ccc'}/>
      </Animatable.View>
    );
  }
}
