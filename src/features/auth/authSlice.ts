import { createSlice } from "@reduxjs/toolkit";

interface User {
  id: number;
  name: string;
  email: string;
}

interface authState {
  isAuthenticated: boolean;
  currentUser: User | null;
  status: 'idle' | 'loading' | 'failed';
  error: string | null;
}
const initialState: authState = {}

const authSlice = createSlice({
  name: "slice",
  initialState,
  reducers: {

  },
})

export default authSlice.reducer;
