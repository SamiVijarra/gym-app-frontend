import styled, { css } from 'styled-components';
import { radius } from '../../theme';

export type BadgeStatus = 'planned' | 'done' | 'neutral';

const statusStyles = {
    planned: css`
        color: var(--app-primary-light);
        background: var(--app-primary-soft);
    `,
    done: css`
        color: var(--app-success);
        background: color-mix(in srgb, var(--app-success) 16%, transparent);
    `,
    neutral: css`
        color: var(--app-text-secondary);
        background: var(--app-surface-2);
    `,
};

export const StyledBadge = styled.span<{ $status: BadgeStatus }>`
    display: inline-block;
    padding: 3px 10px;
    border-radius: ${radius.full};
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.03em;
    ${({ $status }) => statusStyles[$status]};
`;
