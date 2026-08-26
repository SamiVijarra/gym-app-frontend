import { Link } from 'react-router-dom';
import { useAuthStore } from '../hooks';
import { ThemeToggle } from './ThemeToggle';

export const Navbar = () => {
    const { startLogout, user } = useAuthStore();

    return (
        <nav className="gym-navbar">
            <div className="gym-navbar-inner">
                <div className="gym-navbar-left">
                    <Link to="/" className="gym-navbar-brand">
                        <span className="gym-navbar-brand-icon">
                            <i className="fas fa-calendar-alt"></i>
                        </span>
                        <span>{user.name}</span>
                    </Link>
                    <div className="gym-navbar-links">
                        <Link to="/profile" className="gym-navbar-link">
                            Perfil
                        </Link>

                        <Link to="/exercises" className="gym-navbar-link">
                            Ejercicios
                        </Link>

                        <Link to="/routine" className="gym-navbar-link">
                            Rutina
                        </Link>
                        <Link to="/calendar" className="gym-navbar-link">
                            Calendario
                        </Link>
                    </div>
                </div>
                <div className="gym-navbar-actions">
                    <ThemeToggle />
                    <button className="gym-navbar-logout" onClick={startLogout}>
                        <i className="fas fa-sign-out-alt"></i>
                        <span>Salir</span>
                    </button>
                </div>
            </div>
        </nav>
    );
};
