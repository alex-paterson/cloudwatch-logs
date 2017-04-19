import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  View,
  StatusBar,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import uuid from 'uuid';

import Navbar from '../../components/Navbar';
import {addFilter} from '../../ducks/Filters/actions';

var styles = StyleSheet.create({
  label: {
    margin: 8,
    marginTop: 20,
    fontSize: 14
  },
  inputContainer: {
    borderColor: '#dbdddc',
    borderWidth: StyleSheet.hairlineWidth,
    borderLeftColor: 'white',
    borderRightColor: 'white',
  },
  input: {
    height: 40,
    backgroundColor: 'white',
    padding: 8,
    fontSize: 16
  },
  button: {
    marginTop: 20,
    borderColor: '#dbdddc',
    borderWidth: StyleSheet.hairlineWidth,
    borderLeftColor: '#efaf27',
    borderRightColor: '#efaf27',
    padding: 16,
    backgroundColor: '#efaf27',
    flex: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16
  }
});

class SelectLog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: undefined,
      filterString: undefined
    };
  }

  onBack() {
    this.props.navigator.pop();
  }

  confirm() {
    var {dispatch, navigator} = this.props;
    var {name, filterString} = this.state;
    if (name && filterString) {
      dispatch(addFilter({
        filterString: filterString,
        name: name,
        id: uuid.v4()
      }));
      navigator.pop();
    }
  }

  render() {
    return (
      <View style={{backgroundColor: 'white', flex: 1}}>
        <StatusBar barStyle='light-content'/>
        <Navbar
          title='Add Filter'
          rightButtonHidden={true}
          onLeftButtonPress={this.onBack.bind(this)}
          leftIconName='chevron-left'/>

        <View style={{backgroundColor: '#fafafa', flex: 1}}>
          <Text style={styles.label}>NAME</Text>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder='Errors-Filter'
              style={styles.input}
              onChangeText={(name) => this.setState({name})}
              autoCapitalize='none'
              value={this.state.name}/>
          </View>

          <Text style={styles.label}>FILTER STRING</Text>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder='{$.tags = "*email*"}'
              style={styles.input}
              onChangeText={(filterString) => this.setState({filterString})}
              autoCapitalize='none'
              value={this.state.filterString}/>
          </View>

          <TouchableOpacity style={styles.button} onPress={this.confirm.bind(this)}>
            <Text style={styles.buttonText}>SAVE</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default connect()(SelectLog);
