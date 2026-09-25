import { useDispatch, useSelector } from 'react-redux';
import calendarApi from '../api/calendarApi';
import { onLoadingProfile, onProfileError, onSetProfile } from '../store';

export const useUsersStore = () => {
    const dispatch = useDispatch();
    const { isLoading, profile, errorMessage } = useSelector((state) => state.users);
    const { user } = useSelector((state) => state.auth);

    const startLoadingProfile = async () => {
        dispatch(onLoadingProfile());
        try {
            const { data } = await calendarApi.get(`/users/${user.id}`);
            dispatch(onSetProfile(data));
        } catch (error) {
            dispatch(
                onProfileError(error.response?.data?.message || 'The profile could not be loaded')
            );
        }
    };

    const startUpdatingProfile = async (profileData) => {
        dispatch(onLoadingProfile());
        try {
            const { data } = await calendarApi.patch(`/users/${user.id}`, profileData);
            dispatch(onSetProfile(data));
        } catch (error) {
            dispatch(
                onProfileError(error.response?.data?.message || 'The profile could not be updated')
            );
        }
    };
    return {
        isLoading,
        profile,
        errorMessage,

        startLoadingProfile,
        startUpdatingProfile,
    };
};
