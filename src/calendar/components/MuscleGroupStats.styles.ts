import styled from 'styled-components';
import { colors, radius, spacing } from '../../theme';

export const Panel = styled.div`
    padding: ${spacing[4]};
    background: ${colors.surface};
    border: 1px solid ${colors.border};
    border-radius: ${radius.lg};
`;

export const MonthLabel = styled.p`
    margin: 0 0 ${spacing[3]};
    color: ${colors.textMuted};
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
`;

export const Rows = styled.ul`
    display: flex;
    flex-direction: column;
    gap: ${spacing[4]};
    margin: 0;
    padding: 0;
    list-style: none;
`;

export const RowHeader = styled.div`
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: ${spacing[3]};
    margin-bottom: ${spacing[2]};
`;

export const GroupName = styled.span`
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: ${colors.text};
    font-size: 13px;
    font-weight: 700;
`;

export const Dot = styled.span<{ $color: string }>`
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${({ $color }) => $color};
`;

export const Numbers = styled.span`
    color: ${colors.textSecondary};
    font-size: 12px;
    text-align: right;
`;

export const Track = styled.div`
    height: 6px;
    overflow: hidden;
    background: ${colors.surface2};
    border-radius: ${radius.full};
`;

export const Fill = styled.div<{ $color: string; $percent: number }>`
    width: ${({ $percent }) => $percent}%;
    height: 100%;
    background: ${({ $color }) => $color};
    border-radius: ${radius.full};
`;

export const Hint = styled.p`
    margin: 0;
    color: ${colors.textMuted};
    font-size: 12px;
`;
