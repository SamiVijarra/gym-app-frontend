import { useTranslation } from 'react-i18next';
import { formatMuscleLabel } from '../calendar/muscleGroups';

const toKey = (muscle: string) =>
    muscle
        .trim()
        .toLowerCase()
        .replace(/\s+(\w)/g, (_, letter: string) => letter.toUpperCase());

export const useMuscleLabels = () => {
    const { t } = useTranslation();

    return {
        groupLabel: (key: string) => t(`muscleGroups.${key}`, { defaultValue: key }),
        muscleLabel: (muscle: string) =>
            t(`muscles.${toKey(muscle)}`, { defaultValue: formatMuscleLabel(muscle) }),
    };
};
