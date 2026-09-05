import type { ButtonHTMLAttributes, ElementType, ReactNode } from 'react';
import { ButtonIcon, StyledButton, type ButtonSize, type ButtonVariant } from './Button.styles';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    variant?: ButtonVariant;
    size?: ButtonSize;
    fullWidth?: boolean;
    icon?: ReactNode;
    as?: ElementType;
}

export const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    type = 'button',
    fullWidth = false,
    icon,
    as,
    ...rest
}: ButtonProps) => {
    return (
        <StyledButton
            as={as}
            type={as ? undefined : type}
            $variant={variant}
            $size={size}
            $fullWidth={fullWidth}
            {...rest}
        >
            {icon && <ButtonIcon>{icon}</ButtonIcon>}
            {children}
        </StyledButton>
    );
};
