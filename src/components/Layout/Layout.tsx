import { Suspense, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from '../Navbar';
import { Sidebar } from '../Sidebar';
import { LoadingState } from '../LoadingState';
import { AppShell, AppShellMain } from './Layout.styles';

const COLLAPSE_STORAGE_KEY = 'sidebar-collapsed';

export const Layout = () => {
    const location = useLocation();
    const isHome = location.pathname === '/';

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const [preferCollapsed, setPreferCollapsed] = useState(
        () => localStorage.getItem(COLLAPSE_STORAGE_KEY) === 'true'
    );

    const [homeExpanded, setHomeExpanded] = useState(false);

    const isCollapsed = isHome ? !homeExpanded : preferCollapsed;

    const onToggleCollapse = () => {
        if (isHome) {
            setHomeExpanded((current) => !current);
            return;
        }
        const next = !preferCollapsed;
        setPreferCollapsed(next);
        localStorage.setItem(COLLAPSE_STORAGE_KEY, String(next));
    };

    return (
        <AppShell>
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                isCollapsed={isCollapsed}
                onToggleCollapse={onToggleCollapse}
            />
            <AppShellMain>
                <Navbar onOpenSidebar={() => setIsSidebarOpen(true)} />
                <Suspense fallback={<LoadingState label="Loading..." />}>
                    <Outlet />
                </Suspense>
            </AppShellMain>
        </AppShell>
    );
};
