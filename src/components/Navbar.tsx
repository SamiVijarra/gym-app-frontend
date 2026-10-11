import { useAuthStore } from '../hooks';
import { ThemeToggle } from './ThemeToggle';
import { useTranslation } from 'react-i18next';
import { LanguageSelector } from './LanguageSelector';

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
    const { t } = useTranslation();
    const { user } = useAuthStore();

    return (
        <nav className="gym-navbar">
            <div className="gym-navbar-inner">
                <div className="gym-navbar-left">
                    <button
                        type="button"
                        className="gym-navbar-hamburger"
                        onClick={onOpenSidebar}
                        aria-label={t('nav.openMenu')}
                    >
                        <i className="fas fa-bars"></i>
                    </button>

                    <span className="gym-navbar-avatar" title={user.name}>
                        {getInitials(user.name)}
                    </span>
                </div>

                <div className="gym-navbar-actions">
                    <LanguageSelector />
                    <ThemeToggle />
                </div>
            </div>
        </nav>
    );
};
