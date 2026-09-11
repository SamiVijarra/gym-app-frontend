import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { spacing } from '../../theme';

export const BreadcrumbNav = styled.nav`
    margin-bottom: ${spacing[4]};
`;

export const BreadcrumbList = styled.ol`
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: ${spacing[1]};
    margin: 0;
    padding: 0;
    list-style: none;
`;

export const BreadcrumbItem = styled.li`
    display: flex;
    align-items: center;
    gap: ${spacing[1]};
    font-size: 13px;
`;

export const BreadcrumbLink = styled(Link)`
    color: var(--app-text-secondary);
    text-decoration: none;

    &:hover {
        color: var(--app-text);
    }
`;

export const BreadcrumbCurrent = styled.span`
    color: var(--app-text);
    font-weight: 600;
`;

export const BreadcrumbSeparator = styled.span`
    color: var(--app-text-muted);
`;
