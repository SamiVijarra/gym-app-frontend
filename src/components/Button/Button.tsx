import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { ButtonIcon, StyledButton, type ButtonSize, type ButtonVariant } from './Button.styles';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    variant?: ButtonVariant;
    size?: ButtonSize;
    fullWidth?: boolean;
    icon?: ReactNode;
}

export const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    type = 'button',
    fullWidth = false,
    icon,
    ...rest
}: ButtonProps) => {
    return (
        <StyledButton type={type} $variant={variant} $size={size} $fullWidth={fullWidth} {...rest}>
            {icon && <ButtonIcon>{icon}</ButtonIcon>}
            {children}
        </StyledButton>
    );
};
