import { useThemeStore } from '../hooks';
import { useTranslation } from 'react-i18next';

export const ThemeToggle = () => {
    const { t } = useTranslation();
    const { mode, toggleTheme } = useThemeStore();

    return (
        <button className="theme-toggle" onClick={toggleTheme}>
            {mode === 'dark' ? `🌙 ${t('theme.dark')}` : `☀️ ${t('theme.light')}`}
        </button>
    );
};
