/* eslint no-empty : 0 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  ListView,
  RefreshControl,
  TouchableOpacity,
  Navigator
} from 'react-native';
import moment from 'moment';
import Icon from 'react-native-vector-icons/Octicons';

import Navbar from '../../components/Navbar';
import Spinny from '../../components/Spinny';
import Settings from '../Settings';
import SelectFilter from '../SelectFilter';
import {addAlert} from '../../ducks/Alerts/actions';
import {LogStream} from '../../model/CloudWatch';


// Sorry about these random functions. They're just for
// parsing JSON in log messages and automatically indenting it.
// TODO: Move these into a helper class

String.prototype.multisplit = function(indexes){
  var str = this,
      o = 0,
      c = 0,
      temp;

  var a = [];

  for (var i = 0; i < indexes.length; i+= 1) {
    c = indexes[i];
    if ( i > 0 ) o = indexes[i-1];

    if (o > c) {
      temp = c; c = o; o = temp;
    }
    a.push(str.substr(o, c-o));
  }
  return a;
};


var countOpenAndClosedBraces = (str => {
  var regex = /\{/gi,
      result,
      openCurly = [];
  while ( (result = regex.exec(str)) ) {
    openCurly.push(result.index);
  }

  regex = /\}/gi;
  var closedCurly = [];
  while ( (result = regex.exec(str)) ) {
    closedCurly.push(result.index);
  }

  return {
    openCurlyCount: openCurly.length,
    closedCurlyCount: closedCurly.length,
  };
});

var getSplitLocations = (str) => {
  var regex = /\{/gi,
      result,
      openCurly = [];
  while ( (result = regex.exec(str)) ) {
    openCurly.push(result.index);
  }

  regex = /\}/gi;
  var closedCurly = [];
  while ( (result = regex.exec(str)) ) {
    closedCurly.push(result.index);
  }

  var splitPositions = [];


  var s, f, i,
      openCurlyCount,
      closedCurlyCount;
  for (i = 0; i < openCurly.length; i++) {
    var oP = openCurly[i];
    s = str.substr(oP);

    f = countOpenAndClosedBraces(s);
    openCurlyCount = f.openCurlyCount;
    closedCurlyCount = f.closedCurlyCount;
    if (openCurlyCount == closedCurlyCount) splitPositions.push(oP);
  }
  for (i = 0; i < closedCurly.length; i++) {
    var cP = closedCurly[i]+1;
    s = str.substr(0, cP);
    f = countOpenAndClosedBraces(s);
    openCurlyCount = f.openCurlyCount;
    closedCurlyCount = f.closedCurlyCount;
    if (openCurlyCount == closedCurlyCount) splitPositions.push(cP);
  }

  return splitPositions;
};


var styles = StyleSheet.create({
  loadingContainer: {
    backgroundColor: '#fafafa',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  logEntry: {
    marginTop: 4,
    marginBottom: 4,
    backgroundColor: 'white',
    borderColor: '#dbdddc',
    borderWidth: StyleSheet.hairlineWidth,
    borderLeftColor: 'white',
    borderRightColor: 'white',
  }
});

class LogRow extends Component {
  constructor(props) {
    super(props);

    this.state = {
      expanded: false,
      activeFilter: undefined
    };
  }

  changeExpanded() {
    this.setState({expanded: !this.state.expanded});
  }

  render() {
    var {log} = this.props;
    var time = new moment(new Date(log.timestamp));

    var splitPositions = getSplitLocations(log.message);

    var messages = log.message.multisplit(splitPositions);
    var json;
    messages = messages.map(message => {
      json = false;
      try {
        message = JSON.parse(message);
        message = JSON.stringify(message, null, 2);
        message = message.replace(/^\s+|\s+$/g, '');
        json = true;
      } catch (err) {}
      return {message,json};
    });

    var renderMessages = () => {
      return messages.map((mes, i) => {
        if (!mes || !mes.message || mes.message === ' ') return;
        var style = {margin: 0, padding: 0};
        if (mes.json) style.fontFamily='Courier New';
        return (
          <View key={i} style={{margin: 0, padding: 0}}>
            <Text style={style}>{mes.message}</Text>
          </View>
        );
      });
    };

    var contStyle = {overflow: 'hidden', marginTop: 8, paddingLeft: 8, paddingRight: 8};
    var shadowOpacity = 0;
    if (!this.state.expanded) contStyle.maxHeight = 55;
    if (!this.state.expanded) shadowOpacity = 0.1;

    return (
      <TouchableOpacity style={styles.logEntry} onPress={this.changeExpanded.bind(this)}>
        <View style={contStyle}>
          {renderMessages()}
        </View>
        <View shadowColor='#000'
            style={{paddingLeft: 8, paddingRight: 8}}
            shadowOffset={{width: 0, height: -1}}
            shadowOpacity={shadowOpacity}>
          <Text style={{fontSize: 12, color: '#aaa', marginTop: 4, paddingBottom: 4}}>{time.format('dddd Do MMM YYYY, hh:mm:ssA [UTC]Z')}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

class ShowLog extends Component {
  constructor(props) {
    super(props);


    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.eventId !== r2.eventId});

    this.state = {
      logs: [],
      loading: true,
      topRefreshing: false,
      activeFilter: undefined,
      dataSource: ds.cloneWithRows([])
    };
  }

  resetLogStream() {
    var {log, navigator, dispatch} = this.props;

    this.logStream = new LogStream(log, this.state.activeFilter, err => {
      if (err) {
        navigator.pop();
        dispatch(addAlert(err.message, 'danger'));

        this.props.navigator.push({
          component: Settings,
          title: 'Settings',
          navigationBarHidden: true,
          transition: Navigator.SceneConfigs.FloatFromLeft
        });

        return;
      }

      this.setState({loading: false});
      this.logStream.getFirstLogs((err, logs) => {
        if (err) {
          navigator.pop();
          if (err.message) {
            dispatch(addAlert(err.message, 'danger'));
          } else {
            dispatch(addAlert('Unknown error.', 'danger'));
          }
          return;
        }
        this.setLogs(logs);
      });
    });
  }

  componentWillMount() {
    this.resetLogStream();
  }

  onBack() {
    this.props.navigator.pop();
  }

  setLogs(logs) {
    this.setState({
      logs,
      dataSource: this.state.dataSource.cloneWithRows(logs)
    });
  }

  pushFilter() {
    this.props.navigator.push({
      component: SelectFilter,
      title: 'Select Filter',
      navigationBarHidden: true,
      transition: Navigator.SceneConfigs.FloatFromRight,
      passToProps: {handleSelectFilter: this.handleSelectFilter.bind(this)}
    });
  }

  handleSelectFilter(filter) {
    this.setState({activeFilter: filter});
    this.resetLogStream();
  }

  onTopRefresh() {
    var {dispatch} = this.props;
    this.setState({topRefreshing: true});
    this.logStream.getNextLogs((err, logs) => {
      this.setState({topRefreshing: false});
      if (err) {
        dispatch(addAlert(err.message, 'danger'));
        return;
      }
      logs = [...logs, ...this.state.logs];
      this.setLogs(logs);
    });
  }

  reachedEnd() {
    var {dispatch} = this.props;
    this.setState({bottomRefreshing: true});
    this.logStream.getLastLogs((err, logs) => {
      this.setState({bottomRefreshing: false});
      if (err) {
        dispatch(addAlert(err.message, 'danger'));
        return;
      }
      logs = [...this.state.logs, ...logs];
      this.setLogs(logs);
    });
  }

  render() {

    var {log} = this.props;
    var {loading} = this.state;

    return (
      <View style={{flex: 1}}>
        <StatusBar barStyle='light-content'/>
        <Navbar
          title={`${log.log} (${log.stream})`}
          onLeftButtonPress={this.onBack.bind(this)}
          leftIconName='chevron-left'
          rightButtonHidden={true}
          onRightButtonPress={this.pushFilter.bind(this)}
          rightIconName='tag'/>

        {loading &&
        <View style={styles.loadingContainer}>
          <Text>Loading...</Text>
        </View>}

        {!loading &&
        <ListView
          onEndReached={this.reachedEnd.bind(this)}
          dataSource={this.state.dataSource}
          renderRow={(log) => <LogRow key={log.eventId} log={log}/>}
          enableEmptySections={true}
          refreshControl={
            <RefreshControl
              title='Getting events...'
              refreshing={this.state.topRefreshing}
              onRefresh={this.onTopRefresh.bind(this)}/>}
          style={{backgroundColor: '#fafafa', flex: 1}}/>}

        {this.state.bottomRefreshing &&
        <View style={{padding: 8,
                      backgroundColor: 'white',
                      borderColor: '#dbdddc',
                      borderTopWidth: StyleSheet.hairlineWidth,
                      alignItems: 'center',
                      flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text color='#333'>Getting more...</Text>
          <Spinny color='#333'/>
        </View>}

        {this.state.activeFilter &&
        <TouchableOpacity onPress={this.pushFilter.bind(this)} style={{padding: 8,
                      borderColor: '#dbdddc',
                      borderTopWidth: StyleSheet.hairlineWidth,flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
          <View style={{flex: 1}}>
            <Text color='#999' style={{fontSize: 12}}>FILTER</Text>
            <Text color='#333' style={{fontSize: 16, fontWeight: '800'}}>{this.state.activeFilter.name}</Text>
          </View>
          <Icon name='tag' size={15} color='#333' style={{marginLeft: 15, padding: 8}}/>
        </TouchableOpacity>}
      </View>
    );
  }
}


export default connect()(ShowLog);
