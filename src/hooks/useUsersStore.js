import { useDispatch, useSelector } from "react-redux"
import calendarApi from "../api/calendarApi";
import { onLoadingProfile, onProfileError, onSetProfile } from "../store";


export const useUsersStore = () => {

  const dispatch = useDispatch();
  const { isLoading, profile, errorMessage } = useSelector(state => state.users);
  const { user } = useSelector(state => state.auth);

  const startLoadingProfile = async () => {
    dispatch(onLoadingProfile());
    try {
      const { data } = await calendarApi.get(`/users/${user.id}`);
      dispatch(onSetProfile(data));
    } catch (error) {
      dispatch(onProfileError(error.response?.data?.message || 'No se pudo cargar el perfil'));
    }
  }

  const startUpdatingProfile = async (profileData) => {
    dispatch(onLoadingProfile());
    try {
      const {data} = await calendarApi.patch(`/users/${user.id}`, profileData);
      dispatch(onSetProfile(data));
    } catch (error) {
      dispatch(onProfileError(error.response?.data?.message || 'No se puedo actualizar el perfil'));
    }
  }
  return {
    isLoading, 
    profile,
    errorMessage,

    startLoadingProfile,
    startUpdatingProfile
  }
}