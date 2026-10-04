export type MuscleGroupKey = 'chest' | 'back' | 'shoulders' | 'arms' | 'legs' | 'glutes' | 'core';

export interface MuscleGroupInfo {
    key: MuscleGroupKey;
    label: string;
    color: string;
}

export const MUSCLE_GROUPS: MuscleGroupInfo[] = [
    { key: 'chest', label: 'Chest', color: '#3b82f6' },
    { key: 'back', label: 'Back', color: '#22c55e' },
    { key: 'shoulders', label: 'Shoulders', color: '#f97316' },
    { key: 'arms', label: 'Arms', color: '#a855f7' },
    { key: 'legs', label: 'Legs', color: '#eab308' },
    { key: 'glutes', label: 'Glutes', color: '#ef4444' },
    { key: 'core', label: 'Core', color: '#ec4899' },
];

export const getMuscleGroupInfo = (key: string): MuscleGroupInfo | undefined =>
    MUSCLE_GROUPS.find((group) => group.key === key);

export const mergeMuscleGroups = (entries: { muscleGroups?: string[] }[]): MuscleGroupKey[] =>
    MUSCLE_GROUPS.filter((group) =>
        entries.some((entry) => entry.muscleGroups?.includes(group.key))
    ).map((group) => group.key);
