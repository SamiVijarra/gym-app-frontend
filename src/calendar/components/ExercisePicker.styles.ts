import styled from 'styled-components';
import { radius, spacing } from '../../theme';

export const GroupButtons = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: ${spacing[2]};
    margin-bottom: ${spacing[3]};
`;

export const GroupButton = styled.button<{ $color: string; $active: boolean }>`
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    border-radius: ${radius.full};
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;
    color: ${({ $active }) => ($active ? 'var(--app-text)' : 'var(--app-text-secondary)')};
    background: ${({ $active, $color }) =>
        $active ? `color-mix(in srgb, ${$color} 22%, transparent)` : 'var(--app-surface-2)'};
    border: 1px solid ${({ $active, $color }) => ($active ? $color : 'var(--app-border)')};

    &:hover {
        border-color: ${({ $color }) => $color};
    }
`;

export const GroupDot = styled.span<{ $color: string }>`
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${({ $color }) => $color};
`;

export const Results = styled.ul`
    margin: ${spacing[3]} 0 0;
    padding: 0;
    max-height: 280px;
    overflow-y: auto;
    list-style: none;
    border: 1px solid var(--app-border);
    border-radius: ${radius.md};
`;

export const ResultButton = styled.button`
    display: block;
    width: 100%;
    padding: 10px 14px;
    text-align: left;
    cursor: pointer;
    color: var(--app-text);
    background: transparent;
    border: 0;
    border-bottom: 1px solid var(--app-border);

    &:hover {
        background: var(--app-surface-hover);
    }
`;

export const ResultName = styled.strong`
    display: block;
    font-size: 14px;
`;

export const ResultMeta = styled.span`
    display: block;
    margin-top: 2px;
    font-size: 12px;
    color: var(--app-text-secondary);
`;

export const Hint = styled.p`
    margin: ${spacing[3]} 0 0;
    font-size: 13px;
    color: var(--app-text-secondary);
`;
