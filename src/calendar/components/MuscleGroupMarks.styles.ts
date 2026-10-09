import styled from 'styled-components';
import { radius, spacing } from '../../theme';

export const Marks = styled.span`
    position: absolute;
    top: 6px;
    left: 6px;
    display: flex;
    flex-wrap: wrap;
    gap: 2px;
    max-width: 26px;
    pointer-events: none;

    @media (max-width: 640px) {
        top: auto;
        bottom: 5px;
        left: 50%;
        flex-wrap: nowrap;
        max-width: none;
        transform: translateX(-50%);
    }
`;

export const Mark = styled.span<{ $color: string }>`
    width: 4px;
    height: 12px;
    border-radius: 2px;
    background: ${({ $color }) => $color};

    @media (max-width: 640px) {
        width: 5px;
        height: 4px;
    }
`;

export const ChipList = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: ${spacing[2]};
`;

export const Chip = styled.span`
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 3px 10px;
    border-radius: ${radius.full};
    font-size: 11px;
    font-weight: 600;
    color: var(--app-text-secondary);
    background: var(--app-surface-2);
`;

export const Dot = styled.span<{ $color: string }>`
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${({ $color }) => $color};
`;

export const LegendWrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: ${spacing[3]};
    margin-top: ${spacing[4]};
    padding-top: ${spacing[4]};
    border-top: 1px solid var(--app-border);
`;
