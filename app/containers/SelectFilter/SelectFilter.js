import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  View,
  Text,
  StatusBar,
  Navigator,
  ScrollView,
  StyleSheet,
  TouchableOpacity
} from 'react-native';

import Navbar from '../../components/Navbar';

import AddFilter from '../AddFilter';

var styles = StyleSheet.create({
  logEntry: {
    borderColor: '#dbdddc',
    borderWidth: StyleSheet.hairlineWidth,
    borderLeftColor: 'white',
    borderRightColor: 'white',
    padding: 16,
    backgroundColor: 'white',
    marginBottom: 16
  }
});

class SelectFilter extends Component {

  onBack() {
    this.props.navigator.pop();
  }

  onAdd() {
    this.props.navigator.push({
      component: AddFilter,
      title: 'Add Filter',
      navigationBarHidden: true
    });
  }

  selectFilter(filter) {
    this.props.handleSelectFilter(filter);
    this.props.navigator.pop();
  }

  render() {
    var renderFilters = () => {
      return this.props.filters.map(filter => {
        return (
          <TouchableOpacity key={filter.id} onPress={() => this.selectFilter(filter)}>
            <View style={styles.logEntry}>
              <Text style={{fontSize: 20}}>{filter.name}</Text>
              <Text style={{color: '#888'}}>{filter.filterString}</Text>
            </View>
          </TouchableOpacity>
        );
      });
    };

    return (
      <View style={{flex: 1}}>
        <StatusBar barStyle='light-content'/>
        <Navbar
          title='Select Filter'
          onRightButtonPress={this.onAdd.bind(this)}
          rightIconName='plus'
          onLeftButtonPress={this.onBack.bind(this)}
          leftIconName='chevron-left'/>
        <ScrollView style={{backgroundColor: '#fafafa', flex: 1}}>
          {renderFilters()}
          <TouchableOpacity onPress={() => this.selectFilter(undefined)}>
            <View style={styles.logEntry}>
              <Text style={{fontSize: 20}}>No Filter</Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }
}

export default connect(state => {
  return {
    filters: state.filters
  };
})(SelectFilter);
