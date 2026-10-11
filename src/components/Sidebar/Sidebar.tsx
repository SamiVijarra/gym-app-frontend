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
import { useTranslation } from 'react-i18next';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    isCollapsed: boolean;
    onToggleCollapse: () => void;
}

const LINKS = [
    { to: '/routine', labelKey: 'nav.routine', icon: 'fa-calendar-alt' },
    { to: '/exercises', labelKey: 'nav.exercises', icon: 'fa-dumbbell' },
    { to: '/profile', labelKey: 'nav.profile', icon: 'fa-user' },
    { to: '/calendar', labelKey: 'nav.calendar', icon: 'fa-calendar-check' },
];

export const Sidebar = ({ isOpen, onClose, isCollapsed, onToggleCollapse }: SidebarProps) => {
    const { t } = useTranslation();

    return (
        <>
            <SidebarOverlay $isOpen={isOpen} onClick={onClose} />
            <SidebarAside $isOpen={isOpen} $isCollapsed={isCollapsed}>
                <SidebarBrand $isCollapsed={isCollapsed}>
                    <SidebarBrandLink to="/" onClick={onClose} aria-label={t('nav.homeLink')}>
                        <SidebarBrandIcon>
                            <i className="fas fa-calendar-alt"></i>
                        </SidebarBrandIcon>
                        <SidebarLabel $isCollapsed={isCollapsed}>Gym Tracker</SidebarLabel>
                    </SidebarBrandLink>

                    <SidebarCloseButton onClick={onClose} aria-label={t('nav.closeMenu')}>
                        <i className="fas fa-xmark"></i>
                    </SidebarCloseButton>
                </SidebarBrand>

                <SidebarNav>
                    {LINKS.map((link) => (
                        <SidebarLink
                            key={link.to}
                            to={link.to}
                            onClick={onClose}
                            title={t(link.labelKey)}
                            $isCollapsed={isCollapsed}
                        >
                            <i className={`fas ${link.icon}`}></i>
                            <SidebarLabel $isCollapsed={isCollapsed}>
                                {t(link.labelKey)}
                            </SidebarLabel>
                        </SidebarLink>
                    ))}
                </SidebarNav>

                <SidebarFooter>
                    <SidebarCollapseButton
                        onClick={onToggleCollapse}
                        aria-label={isCollapsed ? t('nav.expandMenu') : t('nav.collapseMenu')}
                        title={isCollapsed ? t('nav.expandMenu') : t('nav.collapseMenu')}
                        $isCollapsed={isCollapsed}
                    >
                        <i
                            className={`fas ${isCollapsed ? 'fa-angles-right' : 'fa-angles-left'}`}
                        ></i>
                        <SidebarLabel $isCollapsed={isCollapsed}>{t('nav.collapse')}</SidebarLabel>
                    </SidebarCollapseButton>
                </SidebarFooter>
            </SidebarAside>
        </>
    );
};
