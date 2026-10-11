export type MuscleGroupKey = 'chest' | 'back' | 'shoulders' | 'arms' | 'legs' | 'glutes' | 'core';

export interface MuscleGroupInfo {
    key: MuscleGroupKey;
    color: string;
}

export const MUSCLE_GROUPS: MuscleGroupInfo[] = [
    { key: 'chest', color: '#3b82f6' },
    { key: 'back', color: '#22c55e' },
    { key: 'shoulders', color: '#f97316' },
    { key: 'arms', color: '#a855f7' },
    { key: 'legs', color: '#eab308' },
    { key: 'glutes', color: '#ef4444' },
    { key: 'core', color: '#ec4899' },
];

export const getMuscleGroupInfo = (key: string): MuscleGroupInfo | undefined =>
    MUSCLE_GROUPS.find((group) => group.key === key);

export const mergeMuscleGroups = (entries: { muscleGroups?: string[] }[]): MuscleGroupKey[] =>
    MUSCLE_GROUPS.filter((group) =>
        entries.some((entry) => entry.muscleGroups?.includes(group.key))
    ).map((group) => group.key);

export const MUSCLES_BY_GROUP: Record<MuscleGroupKey, string[]> = {
    chest: ['chest'],
    back: ['lats', 'lower back', 'middle back', 'traps'],
    shoulders: ['neck', 'shoulders'],
    arms: ['biceps', 'forearms', 'triceps'],
    legs: ['abductors', 'adductors', 'calves', 'hamstrings', 'quadriceps'],
    glutes: ['glutes'],
    core: ['abdominals'],
};

const KNOWN_MUSCLES = Object.values(MUSCLES_BY_GROUP).flat();

export const toKnownMuscle = (muscle?: string): string => {
    const normalized = muscle?.trim().toLowerCase() ?? '';
    return KNOWN_MUSCLES.includes(normalized) ? normalized : '';
};

export const formatMuscleLabel = (muscle: string): string =>
    muscle.charAt(0).toUpperCase() + muscle.slice(1);
