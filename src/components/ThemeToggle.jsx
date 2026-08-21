import { useThemeStore } from '../hooks';

export const ThemeToggle = () => {
  const { mode, toggleTheme } = useThemeStore();

  return (
    <button className="btn btn-outline-secondary btn-sm" onClick={toggleTheme}>
      {mode === 'dark' ? '☀️ Claro' : '🌙 Oscuro'}
    </button>
  );
};
