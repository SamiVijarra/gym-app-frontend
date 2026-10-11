import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import calendarApi from '../api/calendarApi';
import { getErrorMessage } from '../helpers';
import {
    onLoadingExercises,
    onSetExercises,
    onExercisesError,
    onSetSelectedExercise,
} from '../store';
import i18n from '../i18n';

export const useExercisesStore = () => {
    const dispatch = useDispatch();
    const { isLoading, exercises, selectedExercise, errorMessage } = useSelector(
        (state) => state.exercises
    );

    const startSearchingExercises = useCallback(
        async ({ name, muscle, muscleGroup, equipment } = {}) => {
            dispatch(onLoadingExercises());
            try {
                const { data } = await calendarApi.get('/exercises', {
                    params: { name, muscle, muscleGroup, equipment },
                });
                dispatch(onSetExercises(data));
            } catch (error) {
                dispatch(
                    onExercisesError(
                        error.response?.data?.message || i18n.t('errors.exercisesLoad')
                    )
                );
            }
        },
        [dispatch]
    );

    const startLoadingExercise = useCallback(
        async (id) => {
            try {
                const { data } = await calendarApi.get(`/exercises/${id}`);
                dispatch(onSetSelectedExercise(data));
            } catch (error) {
                dispatch(
                    onExercisesError(error.response?.data?.message || i18n.t('errors.exerciseLoad'))
                );
            }
        },
        [dispatch]
    );

    const startCreatingExercise = async (createExerciseDto) => {
        try {
            const { data } = await calendarApi.post('/exercises', createExerciseDto);
            return data;
        } catch (error) {
            dispatch(
                onExercisesError(error.response?.data?.message || i18n.t('errors.exerciseCreate'))
            );
            return null;
        }
    };

    const startUpdatingExercise = async (id, updateExerciseDto) => {
        try {
            const { data } = await calendarApi.patch(`/exercises/${id}`, updateExerciseDto);
            dispatch(onSetSelectedExercise(data));
            return data;
        } catch (error) {
            dispatch(
                onExercisesError(error.response?.data?.message || i18n.t('errors.exerciseUpdate'))
            );
            return null;
        }
    };

    const startDeletingExercise = async (id) => {
        try {
            await calendarApi.delete(`/exercises/${id}`);
            return { ok: true };
        } catch (error) {
            // El mensaje se devuelve (no se guarda en el store) para que la página
            // lo muestre en el momento, sin dejar un error viejo en el formulario de edición.
            return {
                ok: false,
                message: getErrorMessage(error, i18n.t('errors.exerciseDelete')),
            };
        }
    };

    return {
        isLoading,
        exercises,
        selectedExercise,
        errorMessage,

        startSearchingExercises,
        startLoadingExercise,
        startCreatingExercise,
        startUpdatingExercise,
        startDeletingExercise,
    };
};
