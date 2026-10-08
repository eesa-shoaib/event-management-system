import { createSlice } from "@reduxjs/toolkit"

interface eventState { }

const initialState: eventState = {}

const eventsSlice = createSlice({
  name: "events",
  initialState,
  reducers: {}
});

export default eventsSlice.reducer;
