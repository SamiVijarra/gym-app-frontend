import { useDispatch, useSelector } from 'react-redux';
import {
    onLoadingCalendar,
    onSetHistoryEntry,
    onSetExerciseHistory,
    onSetSessionPrefill,
    onSetCalendarEntries,
    onCalendarError,
} from '../store/calendar/calendarSlice';
import calendarApi from '../api/calendarApi';

const parseYearMonth = (date) => {
    const [year, month] = date.split('-').map(Number);
    return { year, month };
};

export const useCalendarStore = () => {
    const dispatch = useDispatch();
    const { isLoading, entries, sessionPrefill, historyEntries, exerciseHistory, errorMessage } =
        useSelector((state) => state.calendar);

    const startLoadingMonth = async (year, month) => {
        dispatch(onLoadingCalendar());
        try {
            const { data } = await calendarApi.get('/calendar', { params: { year, month } });
            dispatch(onSetCalendarEntries(data));
        } catch (error) {
            dispatch(
                onCalendarError(
                    error.response?.data?.message || 'The calendar could not be loaded.'
                )
            );
        }
    };
    const startPlanningDay = async (planDayDto) => {
        try {
            await calendarApi.post('/calendar/plan-day', planDayDto);
            const { year, month } = parseYearMonth(planDayDto.date);
            await startLoadingMonth(year, month);
            return true;
        } catch (error) {
            dispatch(onCalendarError(error.response?.data?.massage || 'Could not plan the day'));
            return false;
        }
    };

    const startCancelingPlan = async (id, date) => {
        try {
            await calendarApi.delete(`/calendar/${id}`);
            const { year, month } = parseYearMonth(date);
            await startLoadingMonth(year, month);
            return true;
        } catch (error) {
            dispatch(
                onCalendarError(error.response?.data?.message || 'Could not cancel the planned day')
            );
            return false;
        }
    };

    const startLoadingSessionPrefill = async (date, routineDayId) => {
        dispatch(onLoadingCalendar());
        try {
            const { data } = await calendarApi.get('/calendar/session-prefill', {
                params: { date, routineDayId },
            });
            dispatch(onSetSessionPrefill(data));
        } catch (error) {
            dispatch(
                onCalendarError(
                    error.response?.data?.message || 'Could not load the session prefill'
                )
            );
        }
    };

    const startCompletingSession = async (completeSessionDto) => {
        try {
            await calendarApi.post('/calendar/complete-session', completeSessionDto);
            const { year, month } = parseYearMonth(completeSessionDto.date);
            await startLoadingMonth(year, month);
            return true;
        } catch (error) {
            dispatch(
                onCalendarError(
                    error.response?.data?.message || 'The session could not be completed'
                )
            );
            return false;
        }
    };

    const startLoadingHistoryEntry = async (id) => {
        try {
            const { data } = await calendarApi.get(`/calendar/history/${id}`);
            dispatch(onSetHistoryEntry(data));
        } catch (error) {
            dispatch(
                onCalendarError(error.response?.data?.message || 'The history could not be loaded')
            );
        }
    };

    const startLoadingExerciseHistory = async (exerciseId) => {
        dispatch(onLoadingCalendar());
        try {
            const { data } = await calendarApi.get(`/calendar/history/exercise/${exerciseId}`);
            dispatch(onSetExerciseHistory({ exerciseId, sessions: data }));
        } catch (error) {
            dispatch(
                onCalendarError(
                    error.response?.data?.message || 'The exercise history could not be loaded'
                )
            );
        }
    };

    const startUpdatingHistoryExerciseNotes = async (id, notes) => {
        try {
            await calendarApi.patch(`/calendar/history-exercises/${id}/notes`, { notes });
            return true;
        } catch (error) {
            dispatch(
                onCalendarError(
                    error.response?.data?.message ||
                        'Could not save the notes for the exercise history'
                )
            );
            return false;
        }
    };

    const startUpdatingHistorySetNotes = async (id, notes) => {
        try {
            await calendarApi.patch(`/calendar/history-sets/${id}/notes`, { notes });
            return true;
        } catch (error) {
            dispatch(
                onCalendarError(
                    error.response?.data?.message || 'Could not save the notes for the set history'
                )
            );
            return false;
        }
    };
    return {
        isLoading,
        entries,
        sessionPrefill,
        historyEntries,
        exerciseHistory,
        errorMessage,

        startLoadingMonth,
        startPlanningDay,
        startCancelingPlan,
        startLoadingSessionPrefill,
        startCompletingSession,
        startLoadingHistoryEntry,
        startLoadingExerciseHistory,
        startUpdatingHistoryExerciseNotes,
        startUpdatingHistorySetNotes,
    };
};
