import styled from 'styled-components';
import { spacing } from '../../theme';

export const ToggleGroupContainer = styled.div<{ $columns: number }>`
    display: grid;
    grid-template-columns: repeat(${({ $columns }) => $columns}, 1fr);
    gap: ${spacing[2]};
`;
