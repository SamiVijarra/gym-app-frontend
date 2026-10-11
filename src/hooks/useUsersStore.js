import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import calendarApi from '../api/calendarApi';
import { onLoadingProfile, onProfileError, onSetProfile } from '../store';
import i18n from '../i18n';

export const useUsersStore = () => {
    const dispatch = useDispatch();
    const { isLoading, profile, errorMessage } = useSelector((state) => state.users);
    const { user } = useSelector((state) => state.auth);

    const startLoadingProfile = useCallback(async () => {
        dispatch(onLoadingProfile());
        try {
            const { data } = await calendarApi.get(`/users/${user.id}`);
            dispatch(onSetProfile(data));
        } catch (error) {
            dispatch(onProfileError(error.response?.data?.message || i18n.t('errors.profileLoad')));
        }
    }, [dispatch, user.id]);

    const startUpdatingProfile = async (profileData) => {
        dispatch(onLoadingProfile());
        try {
            const { data } = await calendarApi.patch(`/users/${user.id}`, profileData);
            dispatch(onSetProfile(data));
            return true;
        } catch (error) {
            dispatch(
                onProfileError(error.response?.data?.message || i18n.t('errors.profileUpdate'))
            );
            return false;
        }
    };

    const startChangingPassword = async (currentPassword, newPassword) => {
        try {
            await calendarApi.patch(`/users/${user.id}/password`, { currentPassword, newPassword });
            return { ok: true, message: i18n.t('errors.passwordUpdated') };
        } catch (error) {
            const message = error.response?.data?.message;
            return {
                ok: false,
                message:
                    (Array.isArray(message) ? message[0] : message) ||
                    i18n.t('errors.passwordUpdate'),
            };
        }
    };

    return {
        isLoading,
        profile,
        errorMessage,

        startLoadingProfile,
        startUpdatingProfile,
        startChangingPassword,
    };
};
