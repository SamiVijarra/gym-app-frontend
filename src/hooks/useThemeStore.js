import { useDispatch, useSelector } from 'react-redux';
import { onToggleTheme } from '../store';

export const useThemeStore = () => {
  const dispatch = useDispatch();
  const { mode } = useSelector((state) => state.theme);

  const toggleTheme = () => {
    dispatch(onToggleTheme());
  };

  return {
    mode,
    toggleTheme,
  };
};
