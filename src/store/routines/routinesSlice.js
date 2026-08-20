import { createSlice } from '@reduxjs/toolkit';

export const routinesSlice = createSlice({
  name: 'routines',
  initialState: {
    isLoading: false,
    days: [],
    errorMessage: undefined,
  },
  reducers: {
    onLoadingRoutine: (state) => {
      state.isLoading = true;
      state.errorMessage = undefined;
    },
    onSetRoutine: (state, { payload }) => {
      state.isLoading = false;
      state.days = payload;
      state.errorMessage = undefined;
    },
    onRoutineError: (state, { payload }) => {
      state.isLoading = false;
      state.errorMessage = payload;
    },
  },
});

export const { onLoadingRoutine, onSetRoutine, onRoutineError } = routinesSlice.actions;