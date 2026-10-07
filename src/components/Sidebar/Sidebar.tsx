import {
    SidebarAside,
    SidebarBrand,
    SidebarBrandIcon,
    SidebarBrandLink,
    SidebarCloseButton,
    SidebarCollapseButton,
    SidebarFooter,
    SidebarLabel,
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
                <SidebarBrand $isCollapsed={isCollapsed}>
                    <SidebarBrandLink to="/" onClick={onClose} aria-label="Gym Tracker home">
                        <SidebarBrandIcon>
                            <i className="fas fa-calendar-alt"></i>
                        </SidebarBrandIcon>
                        <SidebarLabel $isCollapsed={isCollapsed}>Gym Tracker</SidebarLabel>
                    </SidebarBrandLink>

                    <SidebarCloseButton onClick={onClose} aria-label="Close menu">
                        <i className="fas fa-xmark"></i>
                    </SidebarCloseButton>
                </SidebarBrand>

                <SidebarNav>
                    {LINKS.map((link) => (
                        <SidebarLink
                            key={link.to}
                            to={link.to}
                            onClick={onClose}
                            title={link.label}
                            $isCollapsed={isCollapsed}
                        >
                            <i className={`fas ${link.icon}`}></i>
                            <SidebarLabel $isCollapsed={isCollapsed}>{link.label}</SidebarLabel>
                        </SidebarLink>
                    ))}
                </SidebarNav>

                <SidebarFooter>
                    <SidebarCollapseButton
                        onClick={onToggleCollapse}
                        aria-label={isCollapsed ? 'Expand menu' : 'Collapse menu'}
                        title={isCollapsed ? 'Expand menu' : 'Collapse menu'}
                        $isCollapsed={isCollapsed}
                    >
                        <i
                            className={`fas ${isCollapsed ? 'fa-angles-right' : 'fa-angles-left'}`}
                        ></i>
                        <SidebarLabel $isCollapsed={isCollapsed}>Collapse</SidebarLabel>
                    </SidebarCollapseButton>
                </SidebarFooter>
            </SidebarAside>
        </>
    );
};
