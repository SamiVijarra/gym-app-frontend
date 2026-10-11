import i18n from '../i18n';

export const getErrorMessage = (error, fallback = i18n.t('errors.generic')) => {
    const message = error?.response?.data?.message;

    if (Array.isArray(message)) return message.join('. ');
    if (typeof message === 'string' && message) return message;

    return fallback;
};
