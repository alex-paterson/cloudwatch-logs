import React from 'react';
import {View, StyleSheet} from 'react-native';
import {connect} from 'react-redux';
import Dimensions from 'Dimensions';

var styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flex: 1,
    justifyContent: 'flex-end',
    flexDirection: 'column',
    overflow: 'hidden',
    width: Dimensions.get('window').width
  }
});

var AlertsOverlayComponent = React.createClass({
  render: function() {
    var {alerts, children} = this.props;

    var renderAlerts = function() {
      return alerts.map(function(alert) {
        return React.cloneElement(children, {alert: alert, key: alert.id});
      });
    };

    return (
      <View style={styles.container}>
        {renderAlerts()}
      </View>
    );
  }
});

var mapStateToProps = (state) => {
  return {
    alerts: state.alerts
  };
};

module.exports = connect(mapStateToProps)(AlertsOverlayComponent);
