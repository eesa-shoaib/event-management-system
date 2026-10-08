import { createSlice } from "@reduxjs/toolkit";

interface authState {
  isAuthenticated: boolean;
  currentUser: User | null;
  users: User[];
}
const initialState: authState = {}

const authSlice = createSlice({
  name: "slice",
  initialState,
  reducers: {

  },
})

export default authSlice.reducer;
