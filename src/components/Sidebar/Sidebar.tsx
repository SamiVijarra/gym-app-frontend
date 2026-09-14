import { Link } from 'react-router-dom';
import {
    SidebarAside,
    SidebarBrand,
    SidebarBrandIcon,
    SidebarCloseButton,
    SidebarCollapseButton,
    SidebarLink,
    SidebarNav,
    SidebarOverlay,
} from './Sidebar.styles';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    isCollapsed: boolean;
    onToggleCollapse: () => void;
}

const LINKS = [
    { to: '/routine', label: 'Routine', icon: 'fa-calendar-alt' },
    { to: '/exercises', label: 'Exercises', icon: 'fa-dumbbell' },
    { to: '/profile', label: 'Profile', icon: 'fa-user' },
    { to: '/calendar', label: 'Calendar', icon: 'fa-calendar-check' },
];

export const Sidebar = ({ isOpen, onClose, isCollapsed, onToggleCollapse }: SidebarProps) => {
    return (
        <>
            <SidebarOverlay $isOpen={isOpen} onClick={onClose} />
            <SidebarAside $isOpen={isOpen} $isCollapsed={isCollapsed}>
                <SidebarBrand>
                    <Link
                        to="/"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            textDecoration: 'none',
                            color: 'inherit',
                            overflow: 'hidden',
                        }}
                    >
                        <SidebarBrandIcon>
                            <i className="fas fa-calendar-alt"></i>
                        </SidebarBrandIcon>
                        {!isCollapsed && <span style={{ whiteSpace: 'nowrap' }}>Gym Tracker</span>}
                    </Link>

                    <SidebarCloseButton onClick={onClose} aria-label="Close menu">
                        <i className="fas fa-xmark"></i>
                    </SidebarCloseButton>

                    <SidebarCollapseButton
                        onClick={onToggleCollapse}
                        aria-label={isCollapsed ? 'Expand menu' : 'Collapse menu'}
                        title={isCollapsed ? 'Expand menu' : 'Collapse menu'}
                    >
                        <i
                            className={`fas ${isCollapsed ? 'fa-angles-right' : 'fa-angles-left'}`}
                        ></i>
                    </SidebarCollapseButton>
                </SidebarBrand>

                <SidebarNav>
                    {LINKS.map((link) => (
                        <SidebarLink
                            key={link.to}
                            to={link.to}
                            onClick={onClose}
                            title={link.label}
                        >
                            <i className={`fas ${link.icon}`}></i>
                            {!isCollapsed && link.label}
                        </SidebarLink>
                    ))}
                </SidebarNav>
            </SidebarAside>
        </>
    );
};
