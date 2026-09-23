import styled from 'styled-components';
import { radius, spacing } from '../../theme';

export const Wrapper = styled.div`
    padding: 60px ${spacing[6]};
    text-align: center;
    background: var(--app-surface);
    border: 1px dashed var(--app-border-strong);
    border-radius: ${radius.xl};
`;

export const IconCircle = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    margin: 0 auto ${spacing[4]};
    color: var(--app-primary-light);
    background: color-mix(in srgb, var(--app-primary) 10%, transparent);
    border-radius: ${radius.lg};
    font-size: 22px;
`;

export const Heading = styled.h2`
    margin: 0;
    color: var(--app-text);
    font-size: 18px;
`;

export const Text = styled.p`
    max-width: 380px;
    margin: ${spacing[2]} auto 0;
    color: var(--app-text-muted);
    font-size: 13px;
    line-height: 1.6;
`;
