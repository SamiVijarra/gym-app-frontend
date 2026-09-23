import styled from 'styled-components';
import { spacing } from '../../theme';

export const StyledWrapper = styled.div`
    display: flex;
    align-items: baseline;
    gap: ${spacing[2]};
    margin-bottom: ${spacing[3]};
`;

export const Label = styled.span`
    color: var(--app-text-muted);
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
`;

export const Meta = styled.p`
    margin: 0;
    color: var(--app-text-muted);
    font-size: 11px;
`;
