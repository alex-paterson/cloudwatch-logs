import React from 'react';
import {View, StyleSheet, Text, TouchableWithoutFeedback} from 'react-native';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';

import Dimensions from 'Dimensions';

import {removeAlert} from '../../ducks/Alerts/actions';

import {
  LIGHT_RED,
  DARK_RED,
  ALERT_BORDER_RED,
  LIGHT_GREEN,
  DARK_GREEN,
  ALERT_BORDER_GREEN,
} from '../../styles/colors';

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'nowrap',
    padding: 16,
    paddingTop: 8,
    paddingBottom: 8,
    width: Dimensions.get('window').width
  },
  text: {
    width: Dimensions.get('window').width - 64
  }
});


var Alert = React.createClass({
  onRemoveAlert: function() {
    var {dispatch, alert} = this.props;
    dispatch(removeAlert(alert.id));
  },
  render: function() {
    var {alert} = this.props;

    var typeStyle;
    var color;
    if (alert.style == 'success') {
      typeStyle = StyleSheet.create({
        outer: {
          backgroundColor: LIGHT_GREEN,
          borderColor: ALERT_BORDER_GREEN,
          borderTopWidth: 1
        },
        text: {
          color: DARK_GREEN,
        }
      });
      color = DARK_GREEN;
    } else {
      typeStyle = StyleSheet.create({
        outer: {
          backgroundColor: LIGHT_RED,
          borderColor: ALERT_BORDER_RED,
          borderTopWidth: 1
        },
        text: {
          color: DARK_RED,
        }
      });
      color = DARK_RED;
    }

    return (
      <TouchableWithoutFeedback onPress={this.onRemoveAlert}>
        <View style={[typeStyle.outer, styles.container]} key={alert.id}>
          <Text style={[typeStyle.text, styles.text]}>
            {alert.text}
          </Text>
          <Icon.Button onPress={this.onRemoveAlert} name='close' backgroundColor='transparent' color={color}/>
        </View>
      </TouchableWithoutFeedback>
    );
  }
});

module.exports = connect()(Alert);
