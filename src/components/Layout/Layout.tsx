import { Suspense, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../Navbar';
import { Sidebar } from '../Sidebar';
import { LoadingState } from '../LoadingState';
import { AppShell, AppShellMain } from './Layout.styles';

const COLLAPSE_STORAGE_KEY = 'sidebar-collapsed';

export const Layout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const [isCollapsed, setIsCollapsed] = useState(
        () => localStorage.getItem(COLLAPSE_STORAGE_KEY) === 'true'
    );

    const onToggleCollapse = () => {
        const next = !isCollapsed;
        setIsCollapsed(next);
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
