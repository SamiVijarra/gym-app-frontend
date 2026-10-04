import { useEffect, useState } from 'react';
import { useExercisesStore } from '../../hooks';
import { FormField } from '../../components/FormField';
import { MUSCLE_GROUPS, type MuscleGroupKey } from '../muscleGroups';
import {
    GroupButton,
    GroupButtons,
    GroupDot,
    Hint,
    ResultButton,
    ResultMeta,
    ResultName,
    Results,
} from './ExercisePicker.styles';

interface PickerExercise {
    id: string;
    name: string;
    primaryMuscles?: string[];
    equipment?: string;
}

interface ExercisePickerProps {
    onSelect: (exercise: PickerExercise) => void;
    excludeIds?: string[];
    idPrefix?: string;
}

const MIN_SEARCH_LENGTH = 3;

export const ExercisePicker = ({
    onSelect,
    excludeIds = [],
    idPrefix = 'exercise-picker',
}: ExercisePickerProps) => {
    const { exercises, isLoading, startSearchingExercises } = useExercisesStore();

    const [group, setGroup] = useState<MuscleGroupKey | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const term = searchTerm.trim();
    const hasName = term.length >= MIN_SEARCH_LENGTH;
    const hasQuery = group !== null || hasName;

    useEffect(() => {
        if (!hasQuery) return;
        const timeoutId = setTimeout(
            () => {
                startSearchingExercises({
                    muscleGroup: group ?? undefined,
                    name: hasName ? term : undefined,
                });
            },
            hasName ? 400 : 0
        );
        return () => clearTimeout(timeoutId);
    }, [group, term]);

    const results: PickerExercise[] = hasQuery
        ? exercises.filter((exercise: PickerExercise) => !excludeIds.includes(exercise.id))
        : [];

    const onToggleGroup = (key: MuscleGroupKey) => {
        setGroup((current) => (current === key ? null : key));
    };

    return (
        <div>
            <GroupButtons role="group" aria-label="Muscle groups">
                {MUSCLE_GROUPS.map((item) => (
                    <GroupButton
                        key={item.key}
                        type="button"
                        $color={item.color}
                        $active={group === item.key}
                        aria-pressed={group === item.key}
                        onClick={() => onToggleGroup(item.key)}
                    >
                        <GroupDot $color={item.color} />
                        {item.label}
                    </GroupButton>
                ))}
            </GroupButtons>

            <FormField
                id={`${idPrefix}-search`}
                label="Search by name"
                placeholder="Type at least 3 letters..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
            />

            {!hasQuery && <Hint>Choose a muscle group or search by name to see exercises.</Hint>}

            {hasQuery && isLoading && <Hint>Loading exercises...</Hint>}

            {hasQuery && !isLoading && results.length === 0 && <Hint>No exercises found.</Hint>}

            {hasQuery && results.length > 0 && (
                <Results>
                    {results.map((exercise) => (
                        <li key={exercise.id}>
                            <ResultButton type="button" onClick={() => onSelect(exercise)}>
                                <ResultName>{exercise.name}</ResultName>
                                <ResultMeta>
                                    {exercise.primaryMuscles?.join(', ')}
                                    {exercise.equipment ? ` — ${exercise.equipment}` : ''}
                                </ResultMeta>
                            </ResultButton>
                        </li>
                    ))}
                </Results>
            )}
        </div>
    );
};
