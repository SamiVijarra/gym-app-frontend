import styled from 'styled-components';
import { radius } from '../../theme';

export const Wrapper = styled.div`
    overflow-x: auto;
    background: var(--app-surface-2);
    border: 1px solid var(--app-border);
    border-radius: ${radius.md};
`;

export const Table = styled.table`
    width: 100%;
    min-width: 560px;
    border-collapse: collapse;
    color: var(--app-text);
`;

export const Thead = styled.thead`
    background: var(--app-surface-hover);
`;

export const Th = styled.th`
    padding: 12px 14px;
    color: var(--app-text-muted);
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    white-space: nowrap;
    text-align: left;
`;
