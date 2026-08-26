import { createSlice } from '@reduxjs/toolkit';

export const calendarSlice = createSlice({
    name: 'calendar',
    initialState: {
        isLoading: false,
        entries: [],
        errorMessage: undefined,
    },
    reducers: {
        onLoadingCalendar: (state) => {
            state.isLoading = true;
            state.errorMessage = undefined;
        },
        onSetCalendarEntries: (state, { payload }) => {
            state.isLoading = false;
            state.entries = payload;
            state.errorMessage = undefined;
        },
        onCalendarError: (state, { payload }) => {
            state.isLoading = false;
            state.errorMessage = payload;
        },
    },
});

export const { onLoadingCalendar, onSetCalendarEntries, onCalendarError } = calendarSlice.actions;
