import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../Navbar';
import { Sidebar } from '../Sidebar';
import { AppShell, AppShellMain } from './Layout.styles';

export const Layout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <AppShell>
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            <AppShellMain>
                <Navbar onOpenSidebar={() => setIsSidebarOpen(true)} />
                <Outlet />
            </AppShellMain>
        </AppShell>
    );
};
