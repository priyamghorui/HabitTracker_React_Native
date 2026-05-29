import {combineReducers} from 'redux';
import { loadReducer } from './loadReducer';
import { habitReducer } from './habitReducer';
export default combineReducers({
  habitReducer,loadReducer
});