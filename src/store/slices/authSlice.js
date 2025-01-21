import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
      loginStart: (state) => {
          state.isLoading = true;
          state.error = null;
      },
      loginSuccess: (state, action) => {
          state.isLoading = false;
          state.user = action.payload;
          state.error = null;
      },
      loginFailure: (state, action) => {
          state.isLoading = false;
          state.error = action.payload;
      },
      logout: (state) => {
          state.user = null;
          state.error = null;
          localStorage.removeItem('token');
      }
  }
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;