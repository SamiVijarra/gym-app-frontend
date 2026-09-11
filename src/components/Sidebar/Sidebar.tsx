import { Link } from 'react-router-dom';
import {
    SidebarAside,
    SidebarBrand,
    SidebarBrandIcon,
    SidebarCloseButton,
    SidebarLink,
    SidebarNav,
    SidebarOverlay,
} from './Sidebar.styles';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const LINKS = [
    { to: '/profile', label: 'Profile', icon: 'fa-user' },
    { to: '/exercises', label: 'Exercises', icon: 'fa-dumbbell' },
    { to: '/routine', label: 'Routine', icon: 'fa-calendar-alt' },
    { to: '/calendar', label: 'Calendar', icon: 'fa-calendar-check' },
];

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
    return (
        <>
            <SidebarOverlay $isOpen={isOpen} onClick={onClose} />
            <SidebarAside $isOpen={isOpen}>
                <SidebarBrand>
                    <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <SidebarBrandIcon>
                            <i className="fas fa-calendar-alt"></i>
                        </SidebarBrandIcon>
                        <span>Gym Tracker</span>
                    </Link>
                    <SidebarCloseButton onClick={onClose} aria-label="Close menu">
                        <i className="fas fa-xmark"></i>
                    </SidebarCloseButton>
                </SidebarBrand>

                <SidebarNav>
                    {LINKS.map((link) => (
                        <SidebarLink key={link.to} to={link.to} onClick={onClose}>
                            <i className={`fas ${link.icon}`}></i>
                            {link.label}
                        </SidebarLink>
                    ))}
                </SidebarNav>
            </SidebarAside>
        </>
    );
};
