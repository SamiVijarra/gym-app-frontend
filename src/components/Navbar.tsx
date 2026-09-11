import { Link } from 'react-router-dom';
import { useAuthStore } from '../hooks';
import { ThemeToggle } from './ThemeToggle';

interface NavbarProps {
    onOpenSidebar: () => void;
}

export const Navbar = ({ onOpenSidebar }: NavbarProps) => {
    const { startLogout, user } = useAuthStore();

    return (
        <nav className="gym-navbar">
            <div className="gym-navbar-inner">
                <div className="gym-navbar-left">
                    <button
                        type="button"
                        className="gym-navbar-hamburger"
                        onClick={onOpenSidebar}
                        aria-label="Open menu"
                    >
                        <i className="fas fa-bars"></i>
                    </button>

                    <Link to="/" className="gym-navbar-brand">
                        <span className="gym-navbar-brand-icon">
                            <i className="fas fa-calendar-alt"></i>
                        </span>
                        <span>{user.name}</span>
                    </Link>
                </div>
                <div className="gym-navbar-actions">
                    <ThemeToggle />
                    <button className="gym-navbar-logout" onClick={startLogout}>
                        <i className="fas fa-sign-out-alt"></i>
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        </nav>
    );
};
