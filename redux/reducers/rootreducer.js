import {combineReducers} from 'redux';
import { sendchatreducer } from './sendchatreducer';
import { messageNotificaionReducer } from './messageNotificaionReducer';
export default combineReducers({
  sendchatreducer,messageNotificaionReducer
});
