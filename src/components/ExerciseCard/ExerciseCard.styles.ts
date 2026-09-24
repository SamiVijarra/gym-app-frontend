import styled from 'styled-components';
import { radius, spacing } from '../../theme';

export const Card = styled.article`
    overflow: hidden;
    background: var(--app-surface);
    border: 1px solid var(--app-border);
    border-radius: ${radius.xl};
    box-shadow: var(--app-shadow);
`;

export const Header = styled.div<{ $clickable?: boolean }>`
    display: flex;
    align-items: center;
    gap: ${spacing[4]};
    padding: ${spacing[5]} ${spacing[5]};
    cursor: ${({ $clickable }) => ($clickable ? 'pointer' : 'default')};
    transition: background 0.15s ease;

    &:hover {
        background: ${({ $clickable }) => ($clickable ? 'var(--app-surface-hover)' : 'transparent')};
    }
`;

export const Number = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    flex-shrink: 0;
    color: var(--app-primary-light);
    background: color-mix(in srgb, var(--app-primary) 10%, transparent);
    border: 1px solid color-mix(in srgb, var(--app-primary) 18%, transparent);
    border-radius: ${radius.md};
    font-size: 12px;
    font-weight: 700;
`;

export const Image = styled.img`
    width: 58px;
    height: 58px;
    flex-shrink: 0;
    object-fit: cover;
    border-radius: ${radius.md};
    background: var(--app-surface-2);
`;

export const Info = styled.div`
    min-width: 0;
    flex: 1;
`;

export const Name = styled.h2`
    margin: 0;
    color: var(--app-text);
    font-size: 18px;
    line-height: 1.25;
    font-weight: 700;
    letter-spacing: -0.015em;
`;

export const Notes = styled.p`
    margin: 4px 0 0;
    color: var(--app-text-secondary);
    font-size: 12px;
`;

export const Tags = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: ${spacing[1]};
    margin-top: ${spacing[2]};
`;

export const Tag = styled.span<{ $muted?: boolean }>`
    display: inline-flex;
    align-items: center;
    padding: 4px 8px;
    color: ${({ $muted }) => ($muted ? 'var(--app-text-muted)' : '#b9a9f5')};
    background: ${({ $muted }) => ($muted ? 'var(--app-surface-2)' : 'rgba(139, 92, 246, 0.08)')};
    border-radius: ${radius.sm};
    font-size: 10px;
    font-weight: 600;
    text-transform: capitalize;
`;

export const Actions = styled.div`
    display: flex;
    gap: ${spacing[2]};
    flex-shrink: 0;
`;

export const Chevron = styled.i<{ $open?: boolean }>`
    flex-shrink: 0;
    color: var(--app-text-muted);
    font-size: 14px;
    transition: transform 0.15s ease;
    transform: rotate(${({ $open }) => ($open ? '180deg' : '0deg')});
    ${({ $open }) => $open && `color: var(--app-text);`}
`;

export const Detail = styled.div`
    border-top: 1px solid var(--app-border);
`;
