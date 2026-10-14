import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { loadSavedSession, type UserProfile } from "./authService";

interface AuthState {
  isAuthenticated: boolean;
  currentUser: UserProfile | null;
  status: "idle" | "loading" | "failed";
  error: string | null;
}
function getInitialState(): AuthState {
  try {
    const currentUser = loadSavedSession();
    return {
      isAuthenticated: currentUser !== null,
      currentUser,
      status: "idle",
      error: null,
    };
  } catch (error) {
    return {
      isAuthenticated: false,
      currentUser: null,
      status: "failed",
      error: error instanceof Error ? error.message : "Could not restore session.",
    };
  }
}

const authSlice = createSlice({
  name: "auth",
  initialState: getInitialState(),
  reducers: {
    authRequestStarted(state) {
      state.status = "loading";
      state.error = null;
    },
    loginSucceeded(state, action: PayloadAction<UserProfile>) {
      state.isAuthenticated = true;
      state.currentUser = action.payload;
      state.status = "idle";
      state.error = null;
    },
    registerSucceeded(state, action: PayloadAction<UserProfile>) {
      state.isAuthenticated = true;
      state.currentUser = action.payload;
      state.status = "idle";
      state.error = null;
    },
    authRequestFailed(state, action: PayloadAction<string>) {
      state.status = "failed";
      state.error = action.payload;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.currentUser = null;
      state.status = "idle";
      state.error = null;
    },
    clearAuthError(state) {
      state.error = null;
      if (state.status === "failed") state.status = "idle";
    },
  },
});

export const {
  authRequestStarted,
  authRequestFailed,
  loginSucceeded,
  registerSucceeded,
  logout,
  clearAuthError,
} = authSlice.actions;
export default authSlice.reducer;
