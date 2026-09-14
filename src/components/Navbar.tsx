import { useAuthStore } from '../hooks';
import { ThemeToggle } from './ThemeToggle';

interface NavbarProps {
    onOpenSidebar: () => void;
}

const getInitials = (name: string) =>
    name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((word) => word[0]?.toUpperCase())
        .join('');

export const Navbar = ({ onOpenSidebar }: NavbarProps) => {
    const { user } = useAuthStore();

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

                    <ThemeToggle />
                </div>

                <span className="gym-navbar-avatar" title={user.name}>
                    {getInitials(user.name)}
                </span>
            </div>
        </nav>
    );
};
