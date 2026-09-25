import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { radius, spacing } from '../../theme';

export const StyledLink = styled(Link)`
    display: flex;
    align-items: center;
    gap: ${spacing[4]};
    padding: ${spacing[4]} ${spacing[5]};
    color: var(--app-text);
    background: var(--app-surface);
    border: 1px solid var(--app-border);
    border-radius: ${radius.lg};
    box-shadow: 0 5px 18px rgba(0, 0, 0, 0.05);
    text-decoration: none;
    transition:
        transform 0.15s ease,
        background-color 0.15s ease,
        border-color 0.15s ease,
        box-shadow 0.15s ease;

    &:hover {
        color: var(--app-text);
        background: var(--app-surface-hover);
        border-color: color-mix(in srgb, var(--app-primary) 25%, var(--app-border));
        box-shadow: 0 10px 28px rgba(0, 0, 0, 0.08);
        transform: translateY(-2px);
    }
`;

export const Info = styled.div`
    flex: 1;
    min-width: 0;
`;

export const Title = styled.h2`
    overflow: hidden;
    margin: 0;
    color: var(--app-text);
    font-size: 16px;
    font-weight: 700;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

export const Subtitle = styled.p`
    margin: 4px 0 0;
    color: var(--app-text-secondary);
    font-size: 11px;
`;

export const Meta = styled.div`
    display: flex;
    align-items: center;
    gap: ${spacing[2]};
    margin-top: 7px;
    color: var(--app-text-secondary);
    font-size: 11px;

    i {
        color: var(--app-primary-light);
        font-size: 10px;
    }
`;

export const Arrow = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    flex-shrink: 0;
    color: var(--app-text-muted);
    background: var(--app-surface-2);
    border: 1px solid var(--app-border);
    border-radius: ${radius.sm};
    font-size: 16px;
    transition:
        color 0.15s ease,
        background-color 0.15s ease,
        transform 0.15s ease;

    ${StyledLink}:hover & {
        color: var(--app-primary-light);
        background: color-mix(in srgb, var(--app-primary) 10%, transparent);
        transform: translateX(3px);
    }
`;

export const ActionSlot = styled.div`
    flex-shrink: 0;
`;

export const IconMedia = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 42px;
    height: 42px;
    flex-shrink: 0;
    color: var(--app-primary-light);
    background: color-mix(in srgb, var(--app-primary) 9%, transparent);
    border: 1px solid color-mix(in srgb, var(--app-primary) 12%, transparent);
    border-radius: ${radius.md};
    font-size: 15px;
`;

export const DayNumberMedia = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 64px;
    height: 64px;
    flex-shrink: 0;
    background: color-mix(in srgb, var(--app-primary) 8%, transparent);
    border: 1px solid color-mix(in srgb, var(--app-primary) 13%, transparent);
    border-radius: ${radius.lg};

    span {
        color: var(--app-primary-light);
        font-size: 8px;
        font-weight: 700;
        letter-spacing: 0.1em;
    }

    strong {
        margin-top: 2px;
        color: var(--app-text);
        font-size: 23px;
        line-height: 1;
        font-weight: 700;
        letter-spacing: -0.04em;
    }
`;
