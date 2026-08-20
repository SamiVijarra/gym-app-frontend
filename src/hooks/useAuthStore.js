import { useDispatch, useSelector } from "react-redux"
import calendarApi from "../api/calendarApi";
import { clearErrorMessage, onChecking, onLogin, onLogout } from "../store";

export const useAuthStore = () => {

  const { status, user, errorMessage } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  const startLogin = async ({email, password}) => {
    dispatch(onChecking());

    try {
      const { data } = await calendarApi.post('/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('token-init-date', new Date().getTime());
      
      dispatch(onLogin({ id: data.id, name: data.name, email: data.email }));
      
    } catch (error) {
      dispatch(onLogout (error.response?.data?.msg || 'Credenciales incorrectas'));
        setTimeout(() => {
          dispatch(clearErrorMessage());
        }, 10);
    }
  }

  const startRegister = async ({ name, email, password }) => {
    dispatch(onChecking());

    try {
      const { data } = await calendarApi.post('/auth/register', { name, email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('token-init-date', new Date().getTime());
      
      dispatch(onLogin({ id: data.id, name: data.name, email: data.email }));
      
    } catch (error) {
      dispatch(onLogout (error.response?.data?.msg || 'Error en el registro'));
        setTimeout(() => {
          dispatch(clearErrorMessage());
        }, 10);
    }
  }

  const checkAuthToken = async () => {
    const token = localStorage.getItem('token');
    if (!token) return dispatch(onLogout());

    try {
      const { data } = await calendarApi.get('/auth/check-status');
      localStorage.setItem('token', data.token);
      localStorage.setItem('token-init-date', new Date().getTime());
      
      dispatch(onLogin({ id: data.id, name: data.name, email: data.email }));
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      localStorage.clear();
      dispatch(onLogout());
    }
  };

  const startLogout = () => {
    localStorage.clear();
    dispatch(onLogout());
  }

  return {
    status,
    user,
    errorMessage,

    startLogin,
    startRegister,
    checkAuthToken,
    startLogout
  }
}