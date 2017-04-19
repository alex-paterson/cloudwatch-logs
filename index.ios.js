/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { Provider } from 'react-redux';
import {
  AppRegistry,
  Navigator,
  View
} from 'react-native';
import {configureStore} from './app/ducks';
import AlertsOverlayComponent from './app/components/Alerts/AlertsOverlayComponent';
import Alert from './app/components/Alerts/Alert';

import SelectLog from './app/containers/SelectLog';

var routes = [
  {
    component: SelectLog,
    title: 'Main',
    navigationBarHidden: true
  }
];

export default class cloudwatchLogs extends Component {
  render() {
    return (
      <Provider store={configureStore()}>
        <View style={{flex: 1, backgroundColor: '#383838'}}>
          <Navigator
            initialRoute={routes[0]}
            initialRouteStack={routes}
            configureScene={(route) => {
              return route.transition || Navigator.SceneConfigs.FloatFromRight;
            }}

            renderScene={(route, navigator) => {
              return <route.component navigator={navigator} {...route.passToProps}/>;
            }}
            style={{flex: 1}}/>

          <AlertsOverlayComponent>
            <Alert/>
          </AlertsOverlayComponent>
        </View>
      </Provider>
    );
  }
}

AppRegistry.registerComponent('cloudwatchLogs', () => cloudwatchLogs);
