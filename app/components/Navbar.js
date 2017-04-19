import React from 'react';
import Icon from 'react-native-vector-icons/Octicons';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform
} from 'react-native';


var Navbar = React.createClass({
  onLeftButtonPress() {
    if (!this.props.leftButtonHidden) {
      this.props.onLeftButtonPress();
    }
  },
  onRightButtonPress() {
    if (!this.props.rightButtonHidden) {
      this.props.onRightButtonPress();
    }
  },
  render() {
    var renderLeftButton = () => {
      if (!this.props.leftButtonHidden) {
        return (
          <TouchableOpacity onPress={this.onLeftButtonPress}>
            <Icon name={this.props.leftIconName} size={15} color='white' style={{marginLeft: 15, padding: 8}}/>
          </TouchableOpacity>
        );
      } else {
        return (
          <TouchableOpacity onPress={this.onLeftButtonPress}>
            <Icon name='search' size={15} color='rgba(0,0,0,0)' style={{marginLeft: 15, padding: 8}}/>
          </TouchableOpacity>
        );
      }
    };
    var renderRightButton = () => {
      if (!this.props.rightButtonHidden) {
        return (
          <TouchableOpacity onPress={this.onRightButtonPress}>
            <Icon name={this.props.rightIconName} size={15} color='white' style={{marginRight: 15, padding: 8}}/>
          </TouchableOpacity>
        );
      } else {
        return (
          <TouchableOpacity onPress={this.onRightButtonPress}>
            <Icon name='search' size={15} color='rgba(0,0,0,0)' style={{marginRight: 15, padding: 8}}/>
          </TouchableOpacity>
        );
      }
    };
    return (
      <View style={styles.topBar}>
        {renderLeftButton()}
        <Text style={styles.title}>
          {this.props.title}
        </Text>
        {renderRightButton()}
      </View>
    );
  }
});

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#383838',
    alignItems: 'center',
    paddingBottom: 16,
    paddingTop: (Platform.OS === 'android') ? 16 : 32,
  },
  title: {
    color: 'white',
    fontFamily: (Platform.OS === 'android') ? 'Roboto-Light' : 'HelveticaNeue',
    fontSize: 16,
  }
});

module.exports = Navbar;
