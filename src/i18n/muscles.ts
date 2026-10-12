import { useTranslation } from 'react-i18next';
import i18n from 'i18next';
import { MUSCLES_BY_GROUP, MUSCLE_GROUPS, formatMuscleLabel } from '../calendar/muscleGroups';

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

export interface MuscleQuery {
    muscleGroup?: string;
    muscle?: string;
}

const normalize = (text: string) =>
    text
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim()
        .toLowerCase();

const matchesLabel = (term: string, label: string) => {
    const normalized = normalize(label);
    return normalized === term || normalized + 's' === term || normalized === term + 's';
};

export const resolveMuscleQuery = (term: string): MuscleQuery | null => {
    const normalizedTerm = normalize(term);
    if (normalizedTerm.length < 3) return null;

    const languages = Array.from(new Set([i18n.resolvedLanguage ?? 'en', 'en']));
    const labelsFor = (path: string, fallback: string) =>
        languages.map((lng) => i18n.t(path, { lng, defaultValue: fallback }));

    for (const group of MUSCLE_GROUPS) {
        const labels = labelsFor(`muscleGroups.${group.key}`, group.key);
        if (labels.some((label) => matchesLabel(normalizedTerm, label))) {
            return { muscleGroup: group.key };
        }
    }

    for (const muscle of Object.values(MUSCLES_BY_GROUP).flat()) {
        const labels = labelsFor(`muscles.${toKey(muscle)}`, formatMuscleLabel(muscle));
        if (labels.some((label) => matchesLabel(normalizedTerm, label))) {
            return { muscle };
        }
    }

    return null;
};
