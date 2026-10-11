import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    onLoadingCalendar,
    onSetHistoryEntry,
    onSetExerciseHistory,
    onSetSessionPrefill,
    onSetCalendarEntries,
    onCalendarError,
    onSetStats,
    onSetMuscleGroupStats,
    onSetWeeklyGoal,
} from '../store/calendar/calendarSlice';
import calendarApi from '../api/calendarApi';
import { getErrorMessage } from '../helpers';
import i18n from '../i18n';

const parseYearMonth = (date) => {
    const [year, month] = date.split('-').map(Number);
    return { year, month };
};

export const useCalendarStore = () => {
    const dispatch = useDispatch();
    const {
        isLoading,
        entries,
        sessionPrefill,
        historyEntries,
        exerciseHistory,
        errorMessage,
        stats,
        muscleGroupStats,
        weeklyGoal,
    } = useSelector((state) => state.calendar);

    const startLoadingMonth = useCallback(
        async (year, month) => {
            dispatch(onLoadingCalendar());
            try {
                const { data } = await calendarApi.get('/calendar', { params: { year, month } });
                dispatch(onSetCalendarEntries(data));
            } catch (error) {
                dispatch(
                    onCalendarError(error.response?.data?.message || i18n.t('errors.calendarLoad'))
                );
            }
        },
        [dispatch]
    );
    const startPlanningDay = async (planDayDto) => {
        try {
            await calendarApi.post('/calendar/plan-day', planDayDto);
            const { year, month } = parseYearMonth(planDayDto.date);
            await startLoadingMonth(year, month);
            return true;
        } catch (error) {
            dispatch(onCalendarError(getErrorMessage(error, i18n.t('errors.planDay'))));
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
            dispatch(onCalendarError(error.response?.data?.message || i18n.t('errors.cancelPlan')));
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
                onCalendarError(error.response?.data?.message || i18n.t('errors.prefillLoad'))
            );
        }
    };

    const startLoadingPlannedPrefill = async (calendarEntryId) => {
        dispatch(onLoadingCalendar());
        try {
            const { data } = await calendarApi.get(`/calendar/planned/${calendarEntryId}/prefill`);
            dispatch(onSetSessionPrefill(data));
        } catch (error) {
            dispatch(onCalendarError(getErrorMessage(error, i18n.t('errors.plannedLoad'))));
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
                onCalendarError(error.response?.data?.message || i18n.t('errors.sessionComplete'))
            );
            return false;
        }
    };

    const startLoadingHistoryEntry = useCallback(
        async (id) => {
            try {
                const { data } = await calendarApi.get(`/calendar/history/${id}`);
                dispatch(onSetHistoryEntry(data));
            } catch (error) {
                dispatch(
                    onCalendarError(error.response?.data?.message || i18n.t('errors.historyLoad'))
                );
            }
        },
        [dispatch]
    );

    const startLoadingExerciseHistory = useCallback(
        async (exerciseId) => {
            dispatch(onLoadingCalendar());
            try {
                const { data } = await calendarApi.get(`/calendar/history/exercise/${exerciseId}`);
                dispatch(onSetExerciseHistory({ exerciseId, sessions: data }));
            } catch (error) {
                dispatch(
                    onCalendarError(
                        error.response?.data?.message || i18n.t('errors.exerciseHistoryLoad')
                    )
                );
            }
        },
        [dispatch]
    );

    const startUpdatingHistoryExerciseNotes = async (id, notes) => {
        try {
            await calendarApi.patch(`/calendar/history-exercises/${id}/notes`, { notes });
            return true;
        } catch (error) {
            dispatch(
                onCalendarError(error.response?.data?.message || i18n.t('errors.exerciseNotesSave'))
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
                onCalendarError(error.response?.data?.message || i18n.t('errors.setNotesSave'))
            );
            return false;
        }
    };

    const startLoadingStats = useCallback(async () => {
        dispatch(onLoadingCalendar());
        try {
            const { data } = await calendarApi.get('/calendar/stats');
            dispatch(onSetStats(data));
        } catch (error) {
            dispatch(onCalendarError(error.response?.data?.message || i18n.t('errors.statsLoad')));
        }
    }, [dispatch]);

    const startLoadingLastSets = async (exerciseId) => {
        try {
            const { data } = await calendarApi.get(`/calendar/history/exercise/${exerciseId}/last`);
            return data.sets ?? [];
        } catch {
            return [];
        }
    };

    const startLoadingMuscleGroupStats = useCallback(async () => {
        try {
            const { data } = await calendarApi.get('/calendar/stats/muscle-groups');
            dispatch(onSetMuscleGroupStats(data));
        } catch (error) {
            dispatch(
                onCalendarError(error.response?.data?.message || i18n.t('errors.muscleStatsLoad'))
            );
        }
    }, [dispatch]);

    const startLoadingWeeklyGoal = useCallback(
        async (weekStart) => {
            try {
                const { data } = await calendarApi.get('/calendar/weekly-goal', {
                    params: { weekStart },
                });
                dispatch(onSetWeeklyGoal(data));
            } catch (error) {
                dispatch(
                    onCalendarError(
                        error.response?.data?.message || i18n.t('errors.weeklyGoalLoad')
                    )
                );
            }
        },
        [dispatch]
    );

    const startSettingWeeklyGoal = async (weekStart, targetDays) => {
        try {
            await calendarApi.post('/calendar/weekly-goal', { weekStart, targetDays });
            await startLoadingWeeklyGoal(weekStart);
            return true;
        } catch (error) {
            dispatch(
                onCalendarError(error.response?.data?.message || i18n.t('errors.weeklyGoalSave'))
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
        stats,
        muscleGroupStats,
        weeklyGoal,

        startLoadingMonth,
        startPlanningDay,
        startCancelingPlan,
        startLoadingSessionPrefill,
        startLoadingPlannedPrefill,
        startCompletingSession,
        startLoadingHistoryEntry,
        startLoadingExerciseHistory,
        startUpdatingHistoryExerciseNotes,
        startUpdatingHistorySetNotes,
        startLoadingStats,
        startLoadingLastSets,
        startLoadingMuscleGroupStats,
        startLoadingWeeklyGoal,
        startSettingWeeklyGoal,
    };
};
