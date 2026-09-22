import styled from 'styled-components';
import { spacing } from '../../theme';

export const StyledHeader = styled.header`
    margin-bottom: ${spacing[7]};
`;

export const Eyebrow = styled.span`
    display: block;
    margin-bottom: ${spacing[2]};
    color: var(--app-primary);
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.16em;
`;

export const Title = styled.h1`
    margin: 0;
    color: var(--app-text);
    font-size: clamp(30px, 4vw, 44px);
    line-height: 1.1;
    font-weight: 700;
    letter-spacing: -0.035em;
`;

export const Subtitle = styled.p`
    max-width: 560px;
    margin: ${spacing[3]} 0 0;
    color: var(--app-text-secondary);
    font-size: 14px;
    line-height: 1.6;
`;

export const Meta = styled.div`
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: ${spacing[2]};
    margin-top: ${spacing[3]};
    color: var(--app-text-secondary);
    font-size: 13px;
`;

export const MetaDot = styled.span`
    color: var(--app-text-muted);
`;
