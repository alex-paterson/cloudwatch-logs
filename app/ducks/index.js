import {compose, createStore, applyMiddleware, combineReducers} from 'redux';
import thunk from 'redux-thunk';
import {AsyncStorage} from 'react-native';
import {persistStore, autoRehydrate} from 'redux-persist';

import logsReducer from './Logs/reducer';
import alertsReducer from './Alerts/reducer';
import filtersReducer from './Filters/reducer';

var reducer = combineReducers({
  alerts: alertsReducer,
  filters: filtersReducer,
  logs: logsReducer
});

var defaultState = {
  logs: [],
  filters: []
};

export var configureStore = (initialState = defaultState) => {
  const store = createStore(reducer, initialState, compose(
    applyMiddleware(thunk), autoRehydrate()
  ));
  persistStore(store, {storage: AsyncStorage});

  return store;
};
