import type { ChangeEventHandler, FocusEventHandler } from 'react';
import { FormField } from '../FormField';
import { MUSCLE_GROUPS, MUSCLES_BY_GROUP, formatMuscleLabel } from '../../calendar/muscleGroups';

interface MuscleSelectProps {
    id: string;
    name: string;
    value: string;
    onChange: ChangeEventHandler<HTMLSelectElement>;
    onBlur?: FocusEventHandler<HTMLSelectElement>;
    error?: string;
    label?: string;
}

export const MuscleSelect = ({
    id,
    name,
    value,
    onChange,
    onBlur,
    error,
    label = 'Primary muscle',
}: MuscleSelectProps) => (
    <FormField
        id={id}
        label={label}
        as="select"
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        error={error}
    >
        <option value="">Select a muscle...</option>
        {MUSCLE_GROUPS.map((group) => (
            <optgroup key={group.key} label={group.label}>
                {MUSCLES_BY_GROUP[group.key].map((muscle) => (
                    <option key={muscle} value={muscle}>
                        {formatMuscleLabel(muscle)}
                    </option>
                ))}
            </optgroup>
        ))}
    </FormField>
);
