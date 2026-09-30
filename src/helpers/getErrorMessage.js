export const getErrorMessage = (error, fallback = 'Something went wrong') => {
    const message = error?.response?.data?.message;

    if (Array.isArray(message)) return message.join('. ');
    if (typeof message === 'string' && message) return message;

    return fallback;
};
