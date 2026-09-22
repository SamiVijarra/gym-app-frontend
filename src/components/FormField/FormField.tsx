import type {
    InputHTMLAttributes,
    ReactNode,
    SelectHTMLAttributes,
    TextareaHTMLAttributes,
} from 'react';
import {
    FieldError,
    FieldLabel,
    FieldWrapper,
    StyledInput,
    StyledSelect,
    StyledTextarea,
} from './FormField.styles';

interface BaseProps {
    id: string;
    label: string;
    error?: string;
    fullWidth?: boolean;
}

type InputProps = BaseProps & InputHTMLAttributes<HTMLInputElement> & { as?: 'input' };
type TextareaProps = BaseProps & TextareaHTMLAttributes<HTMLTextAreaElement> & { as: 'textarea' };
type SelectProps = BaseProps &
    SelectHTMLAttributes<HTMLSelectElement> & { as: 'select'; children: ReactNode };

type FormFieldProps = InputProps | TextareaProps | SelectProps;

export const FormField = ({
    id,
    label,
    error,
    fullWidth,
    as = 'input',
    ...rest
}: FormFieldProps) => {
    return (
        <FieldWrapper $fullWidth={fullWidth}>
            <FieldLabel htmlFor={id}>{label}</FieldLabel>

            {as === 'textarea' && (
                <StyledTextarea
                    id={id}
                    $invalid={!!error}
                    {...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)}
                />
            )}
            {as === 'select' && (
                <StyledSelect
                    id={id}
                    $invalid={!!error}
                    {...(rest as SelectHTMLAttributes<HTMLSelectElement>)}
                >
                    {(rest as SelectProps).children}
                </StyledSelect>
            )}
            {as === 'input' && (
                <StyledInput
                    id={id}
                    $invalid={!!error}
                    {...(rest as InputHTMLAttributes<HTMLInputElement>)}
                />
            )}

            <FieldError style={{ visibility: error ? 'visible' : 'hidden' }}>
                {error || 'placeholder'}
            </FieldError>
        </FieldWrapper>
    );
};
