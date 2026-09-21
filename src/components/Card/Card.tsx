import type { HTMLAttributes, ReactNode } from 'react';
import { StyledCard, type CardVariant } from './Card.styles';

interface CardProps extends HTMLAttributes<HTMLElement> {
    children: ReactNode;
    variant?: CardVariant;
}

export const Card = ({ children, variant = 'surface', ...rest }: CardProps) => {
    return (
        <StyledCard $variant={variant} {...rest}>
            {children}
        </StyledCard>
    );
};
