import { configureStore } from '@reduxjs/toolkit';
import authReducer from './Auth/authSlice';
import dataReducer from './Data/dataSlice';

export default configureStore({
  reducer: {
    auth: authReducer,
    data: dataReducer
  },
})