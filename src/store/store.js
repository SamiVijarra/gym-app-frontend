import { configureStore } from '@reduxjs/toolkit';
import { authSlice } from './auth/authSlice';
import { usersSlice } from './users/usersSlice';
import { exercisesSlice } from './exercises/exercisesSlice';
import { routinesSlice } from './routines/routinesSlice';
import { themeSlice } from './theme/themeSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    users: usersSlice.reducer,
    exercises: exercisesSlice.reducer,
    routines: routinesSlice.reducer,
    thema: themeSlice.reducer,
  },
  middleware: (getDefaultMiddlewere) =>
    getDefaultMiddlewere({
      serializableCheck: false,
    }),
});
