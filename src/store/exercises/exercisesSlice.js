import { createSlice } from '@reduxjs/toolkit';

export const exercisesSlice = createSlice({
  name: 'exercises',
  initialState: {
    isLoading: false,
    exercises: [],
    errorMessage: undefined,
  },
  reducers: {
    onLoadingExercises: (state) => {
      state.isLoading = true;
      state.errorMessage = undefined;
    },
    onSetExercises: (state, { payload }) => {
      state.isLoading = false;
      state.exercises = payload;
      state.errorMessage = undefined;
    },
    onExercisesError: (state, { payload }) => {
      state.isLoading = false;
      state.errorMessage = payload;
    },
  },
});

export const { onLoadingExercises, onSetExercises, onExercisesError } = exercisesSlice.actions;