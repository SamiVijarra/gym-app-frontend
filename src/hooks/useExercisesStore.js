import { useDispatch, useSelector } from 'react-redux';
import calendarApi from '../api/calendarApi';
import { getErrorMessage } from '../helpers';
import {
    onLoadingExercises,
    onSetExercises,
    onExercisesError,
    onSetSelectedExercise,
} from '../store';

export const useExercisesStore = () => {
    const dispatch = useDispatch();
    const { isLoading, exercises, selectedExercise, errorMessage } = useSelector(
        (state) => state.exercises
    );

    const startSearchingExercises = async ({ name, muscle, muscleGroup, equipment } = {}) => {
        dispatch(onLoadingExercises());
        try {
            const { data } = await calendarApi.get('/exercises', {
                params: { name, muscle, muscleGroup, equipment },
            });
            dispatch(onSetExercises(data));
        } catch (error) {
            dispatch(
                onExercisesError(
                    error.response?.data?.message || 'The exercises could not be loaded'
                )
            );
        }
    };

    const startLoadingExercise = async (id) => {
        try {
            const { data } = await calendarApi.get(`/exercises/${id}`);
            dispatch(onSetSelectedExercise(data));
        } catch (error) {
            dispatch(
                onExercisesError(
                    error.response?.data?.message || 'The exercise could not be loaded'
                )
            );
        }
    };

    const startCreatingExercise = async (createExerciseDto) => {
        try {
            const { data } = await calendarApi.post('/exercises', createExerciseDto);
            return data;
        } catch (error) {
            dispatch(
                onExercisesError(
                    error.response?.data?.message || 'The exercise could not be created.'
                )
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
                onExercisesError(
                    error.response?.data?.message || 'The exercise could not be updated.'
                )
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
                message: getErrorMessage(error, 'The exercise could not be deleted.'),
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
