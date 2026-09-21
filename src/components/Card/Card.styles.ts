import styled, { css } from 'styled-components';
import { radius, spacing } from '../../theme';

export type CardVariant = 'surface' | 'accent';

const variantStyles = {
    surface: css`
        background: var(--app-surface);
        border: 1px solid var(--app-border);
    `,
    accent: css`
        background: linear-gradient(135deg, rgba(139, 92, 246, 0.08), rgba(139, 92, 246, 0.025));
        border: 1px dashed rgba(139, 92, 246, 0.25);
    `,
};

export const StyledCard = styled.section<{ $variant: CardVariant }>`
    padding: ${spacing[6]};
    border-radius: ${radius.xl};
    box-shadow: var(--app-shadow);
    ${({ $variant }) => variantStyles[$variant]};
`;
