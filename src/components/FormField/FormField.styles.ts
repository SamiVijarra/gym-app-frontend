import styled, { css } from 'styled-components';
import { radius, spacing } from '../../theme';

export const FieldWrapper = styled.div<{ $fullWidth?: boolean }>`
    flex: ${({ $fullWidth }) => ($fullWidth ? '1 1 100%' : '1')};
    min-width: 0;
`;

export const FieldLabel = styled.label`
    display: block;
    margin-bottom: ${spacing[2]};
    color: var(--app-text-muted);
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
`;

const controlStyles = css<{ $invalid?: boolean }>`
    width: 100%;
    min-height: 40px;
    padding: 0 ${spacing[3]};
    box-sizing: border-box;
    color: var(--app-text);
    background: var(--app-bg);
    border: 1px solid var(--app-border-strong);
    border-radius: ${radius.sm};
    outline: none;
    font-family: inherit;
    font-size: 12px;
    transition:
        border-color 0.15s ease,
        box-shadow 0.15s ease,
        background-color 0.15s ease;

    &::placeholder {
        color: var(--app-text-muted);
    }

    &:focus {
        background: var(--app-surface-2);
        border-color: color-mix(in srgb, var(--app-primary) 65%, transparent);
        box-shadow: 0 0 0 3px color-mix(in srgb, var(--app-primary) 10%, transparent);
    }

    ${({ $invalid }) =>
        $invalid &&
        css`
            border-color: var(--app-danger) !important;
            box-shadow: 0 0 0 3px color-mix(in srgb, var(--app-danger) 18%, transparent) !important;
        `};
`;

export const StyledInput = styled.input<{ $invalid?: boolean }>`
    ${controlStyles};
`;

export const StyledTextarea = styled.textarea<{ $invalid?: boolean }>`
    ${controlStyles};
    min-height: 80px;
    padding-top: 10px;
    resize: vertical;
`;

export const StyledSelect = styled.select<{ $invalid?: boolean }>`
    ${controlStyles};
    cursor: pointer;
`;

export const FieldError = styled.span`
    display: block;
    margin-top: ${spacing[2]};
    color: var(--app-danger);
    font-size: 12px;
    white-space: nowrap;
    overflow: hidden;
    height: 15px;
`;
