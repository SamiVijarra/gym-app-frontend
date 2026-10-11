import type { ChangeEventHandler, FocusEventHandler } from 'react';
import { FormField } from '../FormField';
import { MUSCLE_GROUPS, MUSCLES_BY_GROUP } from '../../calendar/muscleGroups';
import { useTranslation } from 'react-i18next';
import { useMuscleLabels } from '../../i18n/muscles';

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
    label,
}: MuscleSelectProps) => {
    const { t } = useTranslation();
    const { groupLabel, muscleLabel } = useMuscleLabels();

    return (
        <FormField
            id={id}
            label={label ?? t('muscleSelect.label')}
            as="select"
            name={name}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            error={error}
        >
            <option value="">{t('muscleSelect.placeholder')}</option>
            {MUSCLE_GROUPS.map((group) => (
                <optgroup key={group.key} label={groupLabel(group.key)}>
                    {MUSCLES_BY_GROUP[group.key].map((muscle) => (
                        <option key={muscle} value={muscle}>
                            {muscleLabel(muscle)}
                        </option>
                    ))}
                </optgroup>
            ))}
        </FormField>
    );
};
