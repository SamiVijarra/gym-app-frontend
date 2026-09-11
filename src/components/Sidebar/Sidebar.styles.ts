import { NavLink } from 'react-router-dom';
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

export const SidebarAside = styled.aside<{ $isOpen: boolean }>`
    display: flex;
    flex-direction: column;
    width: 220px;
    flex-shrink: 0;
    padding: ${spacing[5]} ${spacing[4]};
    background: var(--app-surface);
    border-right: 1px solid var(--app-border);

    @media (max-width: 768px) {
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

export const SidebarBrand = styled.div`
    display: flex;
    align-items: center;
    gap: ${spacing[2]};
    margin-bottom: ${spacing[6]};
    padding: 0 ${spacing[2]};
    color: var(--app-text);
    font-weight: 700;
`;

export const SidebarBrandIcon = styled.span`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
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

export const SidebarNav = styled.nav`
    display: flex;
    flex-direction: column;
    gap: ${spacing[1]};
`;

export const SidebarLink = styled(NavLink)`
    display: flex;
    align-items: center;
    gap: ${spacing[3]};
    padding: 10px ${spacing[3]};
    color: var(--app-text-secondary);
    border-radius: var(--app-radius-md);
    font-size: 14px;
    font-weight: 500;
    text-decoration: none;
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
`;
