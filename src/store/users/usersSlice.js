import { createSlice } from "@reduxjs/toolkit";

export const usersSlice = createSlice({
  name: 'users',
  initialState: {
    isLoading: false,
    profile: null,
    errorMessage: undefined,
  },
  reducers: {
    onLoadingProfile: (state) => {
      state.isLoading = true,
      state.errorMessage = undefined;
    },
    onSetProfile: (state, { payload }) => {
      state.isLoading = false;
      state.profile = payload;
      state.errorMessage = undefined;
    },
    onProfileError: (state, { payload }) => {
      state.isLoading = false,
      state.errorMessage = payload;
    },
  },
});

export const { onLoadingProfile, onSetProfile, onProfileError } = usersSlice.actions