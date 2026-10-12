import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type EventItem } from "../events/eventsSlice";

export interface Registration {
  userId: string;
  event: EventItem;
  registeredAt: string;
}

interface registrationState {
  items: Registration[];
}

const initialState: registrationState = {
  items: [],
}

const registrationsSlice = createSlice({
  name: "registrations",
  initialState,
  reducers: {
    addRegistration: (state, action: PayloadAction<{ userId: string, event: EventItem }>) => {

      const { userId, event } = action.payload;

      const isAlreadyRegistered = state.items.some(
        (reg) => reg.userId === userId && reg.event.id === event.id
      );

      if (!isAlreadyRegistered) {
        state.items.push({
          userId,
          event,
          registeredAt: new Date().toISOString(),
        })
      }
    },

    cancelRegistration: (state, action: PayloadAction<{ userId: string, eventId: string }>) => {

      const { userId, eventId } = action.payload;

      state.items = state.items.filter(
        (reg) => !(reg.userId === userId && reg.event.id === eventId)
      );
    },

    clearUserRegistrations: (state, action: PayloadAction<string>) => {
      const userId = action.payload;
      state.items = state.items.filter((reg) => reg.userId !== userId);
    },
  },
});

export const { addRegistration, cancelRegistration, clearUserRegistrations } = registrationsSlice.actions;
export default registrationsSlice.reducer
