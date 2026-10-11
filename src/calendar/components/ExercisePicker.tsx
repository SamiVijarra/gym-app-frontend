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
import { useTranslation } from 'react-i18next';
import { useMuscleLabels } from '../../i18n/muscles';

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
    const { t } = useTranslation();
    const { groupLabel, muscleLabel } = useMuscleLabels();
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
            <GroupButtons role="group" aria-label={t('exercisePicker.groups')}>
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
                        {groupLabel(item.key)}
                    </GroupButton>
                ))}
            </GroupButtons>

            <FormField
                id={`${idPrefix}-search`}
                label={t('exercisePicker.searchLabel')}
                placeholder={t('exercisePicker.searchPlaceholder')}
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
            />

            {!hasQuery && <Hint>{t('exercisePicker.hint')}</Hint>}

            {hasQuery && isLoading && <Hint>{t('exercisePicker.loading')}</Hint>}

            {hasQuery && !isLoading && results.length === 0 && (
                <Hint>{t('exercisePicker.empty')}</Hint>
            )}

            {hasQuery && results.length > 0 && (
                <Results>
                    {results.map((exercise) => (
                        <li key={exercise.id}>
                            <ResultButton type="button" onClick={() => onSelect(exercise)}>
                                <ResultName>{exercise.name}</ResultName>
                                <ResultMeta>
                                    {exercise.primaryMuscles?.map(muscleLabel).join(', ')}
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
