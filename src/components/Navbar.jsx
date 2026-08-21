import { Link } from 'react-router-dom';
import { useAuthStore } from '../hooks';
import { ThemeToggle } from './ThemeToggle';

export const Navbar = () => {
  const { startLogout, user } = useAuthStore();

  return (
    <div className="navbar navbar-dark bg-dark mb-4 px-4 d-flex justify-content-between">
      <div className="d-flex align-items-center gap-3">
        <Link to="/" className="navbar-brand mb-0">
          <i className="fas fa-calendar-alt"></i>
          &nbsp;
          {user.name}
        </Link>
        <Link to="/profile" className="text-light text-decoration-none">
          Perfil
        </Link>
        <Link to="/exercises" className="text-light text-decoration-none">
          Ejercicios
        </Link>
        <Link to="/routine" className="text-light text-decoration-none">
          Rutina
        </Link>
      </div>
      <div className="d-flex align-items-center gap-2">
        <ThemeToggle />
        <button className="btn btn-outline-danger" onClick={startLogout}>
          <i className="fas fa-sign-out-alt"></i>
          &nbsp;
          <span>Salir</span>
        </button>
      </div>
    </div>
  );
};
