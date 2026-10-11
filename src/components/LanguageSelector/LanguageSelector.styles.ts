import styled from 'styled-components';

export const SelectorWrapper = styled.label`
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    min-height: 34px;
    padding: 0 8px 0 11px;
    border: 1px solid var(--app-border-strong);
    border-radius: 8px;
    background: var(--app-surface);
    color: var(--app-text-secondary);
    font-size: 11px;
    font-weight: 600;
    cursor: pointer;
    transition:
        color 0.2s ease,
        background 0.2s ease,
        border-color 0.2s ease;

    &:hover,
    &:focus-within {
        color: var(--app-text);
        background: var(--app-surface-hover);
        border-color: var(--app-primary);
    }
`;

export const SelectorSelect = styled.select`
    appearance: none;
    border: 0;
    outline: 0;
    background: transparent;
    color: inherit;
    font: inherit;
    cursor: pointer;
    padding: 0 14px 0 0;

    option {
        background: var(--app-surface);
        color: var(--app-text);
    }
`;

export const SelectorChevron = styled.i`
    position: absolute;
    right: 9px;
    font-size: 9px;
    pointer-events: none;
`;
