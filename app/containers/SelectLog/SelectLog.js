import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  View,
  Text,
  StatusBar,
  Navigator,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert
} from 'react-native';

import Navbar from '../../components/Navbar';
import Icon from 'react-native-vector-icons/Octicons';

import Settings from '../Settings';
import AddLog from '../AddLog';
import ShowLog from '../ShowLog';
import UpdateLog from '../UpdateLog';
import {removeLog} from '../../ducks/Logs/actions';

var styles = StyleSheet.create({
  logEntry: {
    borderColor: '#dbdddc',
    borderWidth: StyleSheet.hairlineWidth,
    borderLeftColor: 'white',
    borderRightColor: 'white',
    padding: 16,
    backgroundColor: 'white',
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
});

class SelectLog extends Component {
  pushSettings() {
    this.props.navigator.push({
      component: Settings,
      title: 'Settings',
      navigationBarHidden: true,
      transition: Navigator.SceneConfigs.FloatFromLeft
    });
  }

  pushAddLog() {
    this.props.navigator.push({
      component: AddLog,
      title: 'Add Log',
      navigationBarHidden: true
    });
  }

  showLog(log) {
    this.props.navigator.push({
      component: ShowLog,
      title: 'Show Log',
      navigationBarHidden: true,
      passToProps: {log}
    });
  }

  deleteLog(id) {
    Alert.alert(
      'Delete Log Group?',
      null,
      [
        {text: 'Yes, Delete', onPress: () => this.props.dispatch(removeLog(id)), style: 'destructive'},
        {text: 'Cancel', onPress: () => {}, style: 'cancel'}
      ]
    );
  }

  updateLog(log) {
    this.props.navigator.push({
      component: UpdateLog,
      title: 'Update Log',
      navigationBarHidden: true,
      passToProps: {log}
    });
  }

  render() {
    var renderLogs = () => {
      return this.props.logs.map(log => {
        return (
          <TouchableOpacity key={log.id} onPress={() => this.showLog(log)}>
            <View style={styles.logEntry}>
              <View>
                <Text style={{fontSize: 20}}>{log.log}</Text>
                <Text style={{color: '#888'}}>{log.stream}</Text>
              </View>
              <View>
                <TouchableOpacity onPress={() => this.deleteLog(log.id)}>
                  <Icon name='x' size={15} color='#333' style={{marginLeft: 15, padding: 8}}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.updateLog(log)}>
                  <Icon name='pencil' size={15} color='#333' style={{marginLeft: 15, padding: 8}}/>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        );
      });
    };

    return (
      <View style={{flex: 1}}>
        <StatusBar barStyle='light-content'/>
        <Navbar
          title='Select Log'
          onRightButtonPress={this.pushAddLog.bind(this)}
          rightIconName='plus'
          leftButtonHidden={true}
          onLeftButtonPress={this.pushSettings.bind(this)}
          leftIconName='gear'/>
        {this.props.logs && this.props.logs.length > 0 &&
        <ScrollView style={{backgroundColor: '#fafafa', flex: 1}}>
          {renderLogs()}
        </ScrollView>}
        {!this.props.logs || this.props.logs.length == 0 &&
        <View style={{backgroundColor: '#fafafa', flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{color: '#333', fontSize: 20, margin: 50}}>Add a log stream to get started</Text>
        </View>}
      </View>
    );
  }
}

export default connect(state => {
  return {
    logs: state.logs
  };
})(SelectLog);
