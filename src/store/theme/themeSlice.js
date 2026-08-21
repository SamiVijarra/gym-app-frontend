import { createSlice } from '@reduxjs/toolkit';

const storedTheme = localStorage.getItem('theme') || 'dark';

export const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    mode: storedTheme,
  },
  reducers: {
    onToggleTheme: (state) => {
      state.mode = state.mode === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', state.mode);
    },
  },
});

export const { onToggleTheme } = themeSlice.actions;
