import axios from 'axios';
import { getEnvVariables } from '../helpers';
import { onLogout, store } from '../store';

const { VITE_API_URL } = getEnvVariables();

const calendarApi = axios.create({
    baseURL: VITE_API_URL,
});

const AUTH_ENDPOINTS = ['/auth/login', '/auth/register'];

calendarApi.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

calendarApi.interceptors.response.use(
    (response) => response,
    (error) => {
        const isUnauthorized = error.response?.status === 401;
        const isAuthEndpoint = AUTH_ENDPOINTS.some((url) => error.config?.url?.startsWith(url));
        const hasSession = !!localStorage.getItem('token');

        if (isUnauthorized && !isAuthEndpoint && hasSession) {
            localStorage.removeItem('token');
            localStorage.removeItem('token-init-date');
            store.dispatch(onLogout('Your session has expired. Please log in again.'));
        }

        return Promise.reject(error);
    }
);

export default calendarApi;
