import { Link } from 'react-router-dom'
import { useAuthStore } from '../../hooks'

export const HomePage = () => {
  const { user, startLogout } = useAuthStore();

  return (
    <div className="container mt-5">
      <h2>¡Bienvenido, {user.name}!</h2>
      <p></p>
      <Link to="/profile" className="btn btn-primary me-2">Mi perfil</Link>
      <Link to="/exercises" className="btn btn-primary me-2">Ejercicios</Link>
      <Link to="/routines" className="btn btn-primary me-2">Rutinas</Link>
      <button className="btn btn-danger" onClick={startLogout}>Cerrar sesión</button>
    </div>
  )
}