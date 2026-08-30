import { createSlice } from '@reduxjs/toolkit';

export const calendarSlice = createSlice({
    name: 'calendar',
    initialState: {
        isLoading: false,
        entries: [],
        sessionPrefill: null,
        historyEntries: {},
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
        onSetSessionPrefill: (state, { payload }) => {
            state.isLoading = false;
            state.sessionPrefill = payload;
            state.errorMessage = undefined;
        },
        onSetHistoryEntry: (state, { payload }) => {
            state.isLoading = false;
            state.historyEntries[payload.id] = payload;
            state.errorMessage = undefined;
        },
        onCalendarError: (state, { payload }) => {
            state.isLoading = false;
            state.errorMessage = payload;
        },
    },
});

export const {
    onLoadingCalendar,
    onSetCalendarEntries,
    onSetSessionPrefill,
    onSetHistoryEntry,
    onCalendarError,
} = calendarSlice.actions;
