import { useDispatch, useSelector } from 'react-redux';
import calendarApi from '../api/calendarApi';
import { onLoadingExercises, onSetExercises, onExercisesError } from '../store';

export const useExercisesStore = () => {

  const dispatch = useDispatch();
  const { isLoading, exercises, errorMessage } = useSelector(state => state.exercises);

  const startSearchingExercises = async ({ name, muscle, equipment } = {}) => {
    dispatch(onLoadingExercises());
    try {
      const { data } = await calendarApi.get('/exercises', {
        params: { name, muscle, equipment },
      });
      dispatch(onSetExercises(data));
    } catch (error) {
      dispatch(onExercisesError(error.response?.data?.message || 'No se pudieron cargar los ejercicios'));
    }
  }

  return {
    isLoading,
    exercises,
    errorMessage,

    startSearchingExercises,
  }
}