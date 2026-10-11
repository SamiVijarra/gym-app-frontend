import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import calendarApi from '../api/calendarApi';
import { onLoadingRoutine, onSetRoutine, onRoutineError } from '../store';
import i18n from '../i18n';

export const useRoutinesStore = () => {
    const dispatch = useDispatch();
    const { isLoading, days, errorMessage } = useSelector((state) => state.routines);

    const startLoadingRoutine = useCallback(async () => {
        dispatch(onLoadingRoutine());
        try {
            const { data } = await calendarApi.get('/routines');
            dispatch(onSetRoutine(data));
        } catch (error) {
            dispatch(onRoutineError(error.response?.data?.message || i18n.t('errors.routineLoad')));
        }
    }, [dispatch]);

    const startCreatingDay = async (dayData) => {
        try {
            const { data } = await calendarApi.post('/routines/days', dayData);
            await startLoadingRoutine();
            return data;
        } catch (error) {
            dispatch(onRoutineError(error.response?.data?.message || i18n.t('errors.dayCreate')));
        }
    };

    const startAddingExercise = async (dayId, exerciseData) => {
        try {
            await calendarApi.post(`/routines/days/${dayId}/exercises`, exerciseData);
            await startLoadingRoutine();
        } catch (error) {
            dispatch(onRoutineError(error.response?.data?.message || i18n.t('errors.exerciseAdd')));
        }
    };

    const startAddingSet = async (routineExerciseId, setData) => {
        try {
            await calendarApi.post(`/routines/exercises/${routineExerciseId}/sets`, setData);
            await startLoadingRoutine();
        } catch (error) {
            dispatch(onRoutineError(error.response?.data?.message || i18n.t('errors.setAdd')));
        }
    };

    const startUpdatingSet = async (setId, setData) => {
        try {
            await calendarApi.patch(`/routines/sets/${setId}`, setData);
            await startLoadingRoutine();
        } catch (error) {
            dispatch(onRoutineError(error.response?.data?.message || i18n.t('errors.setUpdate')));
        }
    };

    const startRemovingDay = async (dayId) => {
        try {
            await calendarApi.delete(`/routines/days/${dayId}`);
            await startLoadingRoutine();
            return true;
        } catch (error) {
            dispatch(onRoutineError(error.response?.data?.message || i18n.t('errors.dayRemove')));
            return false;
        }
    };

    const startRemovingExercise = async (routineExerciseId) => {
        try {
            await calendarApi.delete(`/routines/exercises/${routineExerciseId}`);
            await startLoadingRoutine();
            return true;
        } catch (error) {
            dispatch(
                onRoutineError(error.response?.data?.message || i18n.t('errors.exerciseRemove'))
            );
            return false;
        }
    };

    const startRemovingSet = async (setId) => {
        try {
            await calendarApi.delete(`/routines/sets/${setId}`);
            await startLoadingRoutine();
            return true;
        } catch (error) {
            dispatch(onRoutineError(error.response?.data?.message || i18n.t('errors.setRemove')));
            return false;
        }
    };

    return {
        isLoading,
        days,
        errorMessage,

        startLoadingRoutine,
        startCreatingDay,
        startAddingExercise,
        startAddingSet,
        startUpdatingSet,
        startRemovingDay,
        startRemovingExercise,
        startRemovingSet,
    };
};
