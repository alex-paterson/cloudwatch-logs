/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component, Navigator } from 'react';
import { Provider } from 'react-redux';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Navigator
} from 'react-native';
import {configureStore} from './app/ducks';

var routes = [
  {
    title: 'Select Log',
    component: SelectLog
  }
];

export default class cloudwatchLogs extends Component {
  render() {
    return (
      <Provider store={configureStore()}>
        <Navigator
          initialRoute={routes[0]}
          initialRouteStack={routes}
          renderScene={(route, navigator) => {
            return (
              <route.component navigator={navigator} {...route.passToProps}/>
            )
          }}
          style={{flex: 1}}/>
      </Provider>
    );
  }
}

AppRegistry.registerComponent('cloudwatchLogs', () => cloudwatchLogs);
