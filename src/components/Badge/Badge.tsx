import type { ReactNode } from 'react';
import { StyledBadge, type BadgeStatus } from './Badge.styles';

interface BadgeProps {
    status: BadgeStatus;
    children: ReactNode;
}

export const Badge = ({ status, children }: BadgeProps) => {
    return <StyledBadge $status={status}>{children}</StyledBadge>;
};
