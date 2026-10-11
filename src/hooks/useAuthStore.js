import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import calendarApi from '../api/calendarApi';
import { clearErrorMessage, onChecking, onLogin, onLogout } from '../store';
import { getErrorMessage } from '../helpers';
import i18n from '../i18n';

const clearSession = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('token-init-date');
};

export const useAuthStore = () => {
    const { status, user, errorMessage } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const startLogin = async ({ email, password }) => {
        dispatch(onChecking());

        try {
            const { data } = await calendarApi.post('/auth/login', { email, password });
            localStorage.setItem('token', data.token);
            localStorage.setItem('token-init-date', new Date().getTime());

            dispatch(onLogin({ id: data.id, name: data.name, email: data.email }));
        } catch (error) {
            dispatch(onLogout(getErrorMessage(error, i18n.t('errors.invalidCredentials'))));
            setTimeout(() => {
                dispatch(clearErrorMessage());
            }, 10);
        }
    };

    const startRegister = async ({ name, email, password }) => {
        dispatch(onChecking());

        try {
            const { data } = await calendarApi.post('/auth/register', { name, email, password });
            localStorage.setItem('token', data.token);
            localStorage.setItem('token-init-date', new Date().getTime());

            dispatch(onLogin({ id: data.id, name: data.name, email: data.email }));
        } catch (error) {
            dispatch(onLogout(getErrorMessage(error, i18n.t('errors.registration'))));
            setTimeout(() => {
                dispatch(clearErrorMessage());
            }, 10);
        }
    };

    const checkAuthToken = useCallback(async () => {
        const token = localStorage.getItem('token');
        if (!token) return dispatch(onLogout());

        try {
            const { data } = await calendarApi.get('/auth/check-status');
            localStorage.setItem('token', data.token);
            localStorage.setItem('token-init-date', new Date().getTime());

            dispatch(onLogin({ id: data.id, name: data.name, email: data.email }));
            // eslint-disable-next-line no-unused-vars
        } catch (error) {
            clearSession();
            dispatch(onLogout());
        }
    }, [dispatch]);

    const startLogout = () => {
        clearSession();
        dispatch(onLogout());
    };

    return {
        status,
        user,
        errorMessage,

        startLogin,
        startRegister,
        checkAuthToken,
        startLogout,
    };
};
