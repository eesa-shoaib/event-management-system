import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthState {
  isAuthenticated: boolean;
  currentUser: User | null;
  status: 'idle' | 'loading' | 'failed';
  error: string | null;
}
const initialState: AuthState = {
  isAuthenticated: true,
  currentUser: null,
  status: 'idle',
  error: null

}
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSucceed: (state, action: PayloadAction<User>) => {
      state.isAuthenticated = true;
      state.currentUser = action.payload;
      state.error = null;
    },
    registerSucceeded: (state, action: PayloadAction<User>) => {
      state.isAuthenticated = true;
      state.currentUser = action.payload;
      state.error = null;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.currentUser = null;
    },
    clearAuthError: (state) => { state.error = null; },

  },
})

export const { registerSucceeded, loginSucceed, logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
