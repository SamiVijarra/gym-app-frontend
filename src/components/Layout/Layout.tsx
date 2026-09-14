import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from '../Navbar';
import { Sidebar } from '../Sidebar';
import { AppShell, AppShellMain } from './Layout.styles';

const COLLAPSE_STORAGE_KEY = 'sidebar-collapsed';

export const Layout = () => {
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(
        () => localStorage.getItem(COLLAPSE_STORAGE_KEY) === 'true'
    );

    useEffect(() => {
        if (location.pathname === '/') {
            setIsCollapsed(true);
        }
    }, [location.pathname]);

    useEffect(() => {
        localStorage.setItem(COLLAPSE_STORAGE_KEY, String(isCollapsed));
    }, [isCollapsed]);

    return (
        <AppShell>
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                isCollapsed={isCollapsed}
                onToggleCollapse={() => setIsCollapsed((current) => !current)}
            />
            <AppShellMain>
                <Navbar onOpenSidebar={() => setIsSidebarOpen(true)} />
                <Outlet />
            </AppShellMain>
        </AppShell>
    );
};
