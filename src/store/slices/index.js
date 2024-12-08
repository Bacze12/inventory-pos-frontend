import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './authSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  // Aquí puedes agregar más reducers según necesites
});

export default rootReducer;