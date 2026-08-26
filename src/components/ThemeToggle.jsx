import { useThemeStore } from '../hooks';

export const ThemeToggle = () => {
  const { mode, toggleTheme } = useThemeStore();

  return (
    <button className="theme-toggle" onClick={toggleTheme}>
      {mode === 'dark' ? '☀️ Claro' : '🌙 Oscuro'}
    </button>
  );
};
