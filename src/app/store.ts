import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../features/auth/authSlice'
import eventReducer from '../features/events/eventsSlice'
import registrationReducer from '../features/registrations/registrationsSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    events: eventReducer,
    registrations: registrationReducer,
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
