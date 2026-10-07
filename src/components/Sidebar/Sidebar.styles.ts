import { Link, NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { spacing } from '../../theme';

export const SidebarOverlay = styled.div<{ $isOpen: boolean }>`
    display: ${({ $isOpen }) => ($isOpen ? 'block' : 'none')};
    position: fixed;
    inset: 0;
    z-index: 40;
    background: rgba(0, 0, 0, 0.5);

    @media (min-width: 769px) {
        display: none;
    }
`;

export const SidebarAside = styled.aside<{ $isOpen: boolean; $isCollapsed: boolean }>`
    display: flex;
    flex-direction: column;
    width: ${({ $isCollapsed }) => ($isCollapsed ? '72px' : '220px')};
    flex-shrink: 0;
    padding: ${spacing[5]} ${({ $isCollapsed }) => ($isCollapsed ? spacing[2] : spacing[3])};
    background: var(--app-surface);
    border-right: 1px solid var(--app-border);
    transition: width 0.2s ease;

    @media (min-width: 769px) {
        position: sticky;
        top: 0;
        align-self: flex-start;
        height: 100vh;
        overflow-y: auto;
    }

    @media (max-width: 768px) {
        width: 220px;
        padding: ${spacing[5]} ${spacing[3]};
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        z-index: 50;
        transform: translateX(${({ $isOpen }) => ($isOpen ? '0' : '-100%')});
        transition: transform 0.2s ease;
        box-shadow: var(--app-shadow-lg);
    }
`;

export const SidebarBrand = styled.div<{ $isCollapsed: boolean }>`
    display: flex;
    align-items: center;
    justify-content: ${({ $isCollapsed }) => ($isCollapsed ? 'center' : 'flex-start')};
    margin-bottom: ${spacing[6]};
    padding: ${({ $isCollapsed }) => ($isCollapsed ? '0' : `0 ${spacing[2]}`)};
    color: var(--app-text);
    font-weight: 700;

    @media (max-width: 768px) {
        justify-content: flex-start;
        padding: 0 ${spacing[2]};
    }
`;

export const SidebarBrandLink = styled(Link)`
    display: flex;
    align-items: center;
    gap: ${spacing[2]};
    min-width: 0;
    color: inherit;
    text-decoration: none;
`;

export const SidebarBrandIcon = styled.span`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    flex-shrink: 0;
    color: var(--app-on-primary);
    background: var(--app-primary);
    border-radius: var(--app-radius-md);
`;

export const SidebarCloseButton = styled.button`
    display: none;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    margin-left: auto;
    color: var(--app-text-secondary);
    background: transparent;
    border: 1px solid var(--app-border);
    border-radius: var(--app-radius-sm);
    cursor: pointer;

    @media (max-width: 768px) {
        display: flex;
    }
`;

export const SidebarFooter = styled.div`
    margin-top: auto;
    padding-top: ${spacing[4]};

    @media (max-width: 768px) {
        display: none;
    }
`;

export const SidebarCollapseButton = styled.button<{ $isCollapsed: boolean }>`
    display: flex;
    align-items: center;
    justify-content: ${({ $isCollapsed }) => ($isCollapsed ? 'center' : 'flex-start')};
    gap: ${spacing[3]};
    width: 100%;
    padding: 10px ${({ $isCollapsed }) => ($isCollapsed ? '0' : spacing[3])};
    color: var(--app-text-muted);
    background: transparent;
    border: 1px solid transparent;
    border-radius: var(--app-radius-md);
    font-family: inherit;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition:
        color 0.15s ease,
        background 0.15s ease;

    &:hover {
        color: var(--app-text);
        background: var(--app-surface-hover);
    }

    i {
        width: 16px;
        text-align: center;
    }
`;

export const SidebarNav = styled.nav`
    display: flex;
    flex-direction: column;
    gap: ${spacing[1]};
`;

export const SidebarLink = styled(NavLink)<{ $isCollapsed: boolean }>`
    display: flex;
    align-items: center;
    justify-content: ${({ $isCollapsed }) => ($isCollapsed ? 'center' : 'flex-start')};
    gap: ${spacing[3]};
    padding: 10px ${({ $isCollapsed }) => ($isCollapsed ? '0' : spacing[3])};
    overflow: hidden;
    color: var(--app-text-secondary);
    border-radius: var(--app-radius-md);
    font-size: 14px;
    font-weight: 500;
    text-decoration: none;
    white-space: nowrap;
    transition:
        color 0.15s ease,
        background 0.15s ease;

    &:hover {
        color: var(--app-text);
        background: var(--app-surface-hover);
    }

    &.active {
        color: var(--app-accent);
        background: color-mix(in srgb, var(--app-accent) 12%, transparent);
    }

    i {
        width: 18px;
        text-align: center;
    }

    @media (max-width: 768px) {
        justify-content: flex-start;
        padding: 10px ${spacing[3]};
    }
`;

export const SidebarLabel = styled.span<{ $isCollapsed: boolean }>`
    white-space: nowrap;

    @media (min-width: 769px) {
        display: ${({ $isCollapsed }) => ($isCollapsed ? 'none' : 'inline')};
    }
`;
