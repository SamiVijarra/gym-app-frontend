import styled, { keyframes } from 'styled-components';
import { spacing } from '../../theme';

const spin = keyframes`
    to {
        transform: rotate(360deg);
    }
`;

export const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: ${spacing[3]};
    min-height: 180px;
    color: var(--app-text-secondary);
    font-size: 12px;
`;

export const Spinner = styled.div`
    width: 24px;
    height: 24px;
    border: 2px solid color-mix(in srgb, var(--app-primary) 15%, transparent);
    border-top-color: var(--app-primary);
    border-radius: 50%;
    animation: ${spin} 0.7s linear infinite;
`;
