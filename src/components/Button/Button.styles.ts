import styled, { css } from 'styled-components';
import { radius, spacing } from '../../theme';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'accent';
export type ButtonSize = 'sm' | 'md' | 'lg';

const variantStyles = {
    primary: css`
        background: var(--app-primary);
        color: var(--app-on-primary);

        &:hover:not(:disabled) {
            background: var(--app-primary-light);
        }
    `,
    secondary: css`
        background: var(--app-secondary);
        color: var(--app-secondary-text);
        border-color: var(--app-border);

        &:hover:not(:disabled) {
            background: var(--app-secondary-hover);
        }
    `,
    ghost: css`
        background: transparent;
        color: var(--app-text-secondary);
        border-color: var(--app-border);

        &:hover:not(:disabled) {
            color: var(--app-text);
            border-color: var(--app-border-strong);
            background: var(--app-surface-hover);
        }
    `,
    danger: css`
        background: transparent;
        color: var(--app-danger);
        border-color: var(--app-border);

        &:hover:not(:disabled) {
            background: color-mix(in srgb, var(--app-danger) 12%, transparent);
            border-color: color-mix(in srgb, var(--app-danger) 30%, transparent);
        }
    `,
    accent: css`
        background: var(--app-accent);
        color: var(--app-on-accent);

        &:hover:not(:disabled) {
            background: var(--app-accent-light);
        }
    `,
};

const sizeStyles = {
    sm: css`
        height: 32px;
        padding: 0 ${spacing[3]};
        font-size: 0.8125rem;
        border-radius: ${radius.sm};
    `,
    md: css`
        height: 40px;
        padding: 0 ${spacing[4]};
        font-size: 0.875rem;
    `,
    lg: css`
        height: 48px;
        padding: 0 ${spacing[5]};
        font-size: 0.9375rem;
        border-radius: ${radius.lg};
    `,
};

export const StyledButton = styled.button<{
    $variant: ButtonVariant;
    $size: ButtonSize;
    $fullWidth: boolean;
}>`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: ${spacing[2]};
    border: 1px solid transparent;
    border-radius: ${radius.md};
    font-weight: 600;
    font-family: inherit;
    cursor: pointer;
    white-space: nowrap;
    width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};
    transition:
        background 0.15s ease,
        border-color 0.15s ease,
        color 0.15s ease,
        opacity 0.15s ease;

    ${({ $variant }) => variantStyles[$variant]};
    ${({ $size }) => sizeStyles[$size]};

    &:disabled {
        opacity: 0.45;
        cursor: not-allowed;
        pointer-events: none;
    }
`;

export const ButtonIcon = styled.span`
    display: inline-flex;
    align-items: center;
    font-size: 0.9em;
`;
