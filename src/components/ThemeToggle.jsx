import { useThemeStore } from '../hooks';

export const ThemeToggle = () => {
    const { mode, toggleTheme } = useThemeStore();

    return (
        <button className="theme-toggle" onClick={toggleTheme}>
            {mode === 'dark' ? '🌙 Dark' : '☀️ Light'}
        </button>
    );
};
