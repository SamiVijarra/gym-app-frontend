import { useDispatch, useSelector } from 'react-redux';
import {
    onCalendarError,
    onLoadingCalendar,
    onSetCalendarEntries,
} from '../store/calendar/calendarSlice';
import calendarApi from '../api/calendarApi';

export const useCalendarStore = () => {
    const dispatch = useDispatch();
    const { isLoading, entries, errorMessage } = useSelector((state) => state.calendar);

    const startLoadingMonth = async (year, month) => {
        dispatch(onLoadingCalendar());
        try {
            const { data } = await calendarApi.get('/calendar', { params: { year, month } });
            dispatch(onSetCalendarEntries(data));
        } catch (error) {
            dispatch(
                onCalendarError(error.response?.data?.message || 'No se pudo cargar el calendario')
            );
        }
    };
    return {
        isLoading,
        entries,
        errorMessage,

        startLoadingMonth,
    };
};
