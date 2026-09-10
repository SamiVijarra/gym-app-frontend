import type { ReactNode } from 'react';
import { ButtonIcon, StyledButton } from '../Button/Button.styles';
import { ToggleGroupContainer } from './ToggleGroup.styles';

export interface ToggleGroupOption<T extends string> {
    value: T;
    label: ReactNode;
    icon?: ReactNode;
}

interface ToggleGroupProps<T extends string> {
    options: ToggleGroupOption<T>[];
    value: T;
    onChange: (value: T) => void;
}

export const ToggleGroup = <T extends string>({
    options,
    value,
    onChange,
}: ToggleGroupProps<T>) => {
    return (
        <ToggleGroupContainer role="radiogroup" $columns={options.length}>
            {options.map((option) => (
                <StyledButton
                    key={option.value}
                    type="button"
                    role="radio"
                    aria-checked={option.value === value}
                    $variant={option.value === value ? 'primary' : 'secondary'}
                    $size="md"
                    $fullWidth={false}
                    onClick={() => onChange(option.value)}
                >
                    {option.icon && <ButtonIcon>{option.icon}</ButtonIcon>}
                    {option.label}
                </StyledButton>
            ))}
        </ToggleGroupContainer>
    );
};
