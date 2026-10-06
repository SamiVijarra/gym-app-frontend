import { useEffect, useState } from 'react';
import { useCalendarStore } from '../../hooks';
import { ExercisePicker } from './ExercisePicker';
import { Button } from '../../components/Button';
import { FormField } from '../../components/FormField';
import { EmptyState } from '../../components/EmptyState';
import { ExerciseCard } from '../../components/ExerciseCard';
import { SetsTable } from '../../components/SetsTable';
import { Card } from '../../components/Card';

let rowKeySeed = 0;
const nextRowKey = () => `row-${++rowKeySeed}`;

const toRowSet = (set) => ({
    weight: set.weight ?? '',
    reps: set.reps ?? '',
    restSeconds: set.restSeconds ?? '',
    notes: '',
    touched: false,
});

const buildInitialRows = (initialExercises) =>
    (initialExercises ?? []).map((item) => ({
        key: nextRowKey(),
        exerciseId: item.exercise.id,
        exercise: item.exercise,
        notes: item.notes ?? '',
        sets: (item.suggestedSets ?? []).map(toRowSet),
    }));

export const SessionBuilder = ({
    date,
    routineDayId,
    calendarEntryId,
    initialExercises,
    onDone,
}) => {
    const [rows, setRows] = useState(() => buildInitialRows(initialExercises));
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { startCompletingSession, startLoadingLastSets, errorMessage } = useCalendarStore();

    useEffect(() => {
        setRows(buildInitialRows(initialExercises));
    }, [initialExercises]);

    const addExerciseRow = async (exercise) => {
        const key = nextRowKey();
        setRows((current) => [
            ...current,
            { key, exerciseId: exercise.id, exercise, notes: '', sets: [] },
        ]);

        const lastSets = await startLoadingLastSets(exercise.id);
        if (lastSets.length === 0) return;

        setRows((current) =>
            current.map((row) =>
                row.key === key && row.sets.length === 0
                    ? { ...row, sets: lastSets.map(toRowSet) }
                    : row
            )
        );
    };

    const removeRow = (key) => {
        setRows((current) => current.filter((row) => row.key !== key));
    };

    const updateRowNotes = (key, notes) => {
        setRows((current) => current.map((row) => (row.key === key ? { ...row, notes } : row)));
    };

    const addSet = (key) => {
        setRows((current) =>
            current.map((row) =>
                row.key === key
                    ? {
                          ...row,
                          sets: [
                              ...row.sets,
                              { weight: '', reps: '', restSeconds: '', notes: '', touched: false },
                          ],
                      }
                    : row
            )
        );
    };

    const updateSet = (key, setIndex, field, value) => {
        setRows((current) =>
            current.map((row) => {
                if (row.key !== key) return row;
                const sets = row.sets.map((set, index) =>
                    index === setIndex ? { ...set, [field]: value } : set
                );
                return { ...row, sets };
            })
        );
    };

    const touchSet = (key, setIndex) => updateSet(key, setIndex, 'touched', true);

    const removeSet = (key, setIndex) => {
        setRows((current) =>
            current.map((row) =>
                row.key === key
                    ? { ...row, sets: row.sets.filter((_, index) => index !== setIndex) }
                    : row
            )
        );
    };

    const isSetComplete = (set) => set.weight !== '' && set.reps !== '';

    const hasCompleteSet = rows.some((row) => row.sets.some(isSetComplete));
    const hasIncompleteSet = rows.some((row) => row.sets.some((set) => !isSetComplete(set)));
    const canSubmit = hasCompleteSet && !hasIncompleteSet;

    const onSubmit = async (event) => {
        event.preventDefault();

        const exercisesPayload = rows
            .map((row) => ({
                exerciseId: row.exerciseId,
                notes: row.notes || undefined,
                sets: row.sets
                    .filter((set) => set.weight !== '' && set.reps !== '')
                    .map((set) => ({
                        weight: Number(set.weight),
                        reps: Number(set.reps),
                        restSeconds: set.restSeconds !== '' ? Number(set.restSeconds) : undefined,
                        notes: set.notes || undefined,
                    })),
            }))
            .filter((row) => row.sets.length > 0);
        if (exercisesPayload.length === 0) return;

        setIsSubmitting(true);
        const success = await startCompletingSession({
            date,
            routineDayId,
            calendarEntryId,
            exercises: exercisesPayload,
        });
        setIsSubmitting(false);
        if (success) onDone();
    };
    return (
        <form onSubmit={onSubmit}>
            {rows.length === 0 && (
                <EmptyState
                    icon="fa-calendar-plus"
                    title="No exercises yet"
                    description="Search and add exercises below to log this session."
                />
            )}

            <Button
                type="submit"
                variant="primary"
                className="mt-3"
                disabled={isSubmitting || !canSubmit}
            >
                {isSubmitting ? 'Saving...' : 'Save session'}
            </Button>

            <Card variant="accent" className="routine-add-exercise-spacing">
                <div className="routine-add-exercise-header">
                    <div>
                        <span className="routine-section-label">EXERCISES</span>
                        <h2>Add exercise</h2>
                        <p>Pick a muscle group or search, then add exercises to this session</p>
                    </div>
                </div>

                <ExercisePicker
                    idPrefix="session-builder"
                    onSelect={addExerciseRow}
                    excludeIds={rows.map((row) => row.exerciseId)}
                />
            </Card>

            <div className="routine-exercises">
                {rows.map((row) => (
                    <ExerciseCard
                        key={row.key}
                        image={row.exercise.images?.[0]?.url}
                        name={row.exercise.name}
                        tags={[
                            ...(row.exercise.primaryMuscles ?? []).map((m) => ({ label: m })),
                            ...(row.exercise.equipment
                                ? [{ label: row.exercise.equipment, muted: true }]
                                : []),
                        ]}
                        actions={
                            <Button variant="danger" size="sm" onClick={() => removeRow(row.key)}>
                                Remove
                            </Button>
                        }
                    >
                        <div style={{ padding: '0 24px 24px' }}>
                            <FormField
                                id={`notes-${row.key}`}
                                label="Notes for this exercise (optional)"
                                value={row.notes}
                                onChange={(e) => updateRowNotes(row.key, e.target.value)}
                            />

                            <SetsTable columns={['Set', 'Weight', 'Reps', 'Rest', 'Notes', '']}>
                                {row.sets.map((set, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>
                                            <input
                                                type="number"
                                                step="0.5"
                                                className={`routine-form-input${set.touched && set.weight === '' ? ' routine-form-input-invalid' : ''}`}
                                                value={set.weight}
                                                aria-label="Weight (kg)"
                                                aria-invalid={set.touched && set.weight === ''}
                                                onChange={(e) =>
                                                    updateSet(
                                                        row.key,
                                                        index,
                                                        'weight',
                                                        e.target.value
                                                    )
                                                }
                                                onBlur={() => touchSet(row.key, index)}
                                            />
                                            {set.touched && set.weight === '' && (
                                                <span className="field-error-text">Required</span>
                                            )}
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                className={`routine-form-input${set.touched && set.reps === '' ? ' routine-form-input-invalid' : ''}`}
                                                value={set.reps}
                                                aria-label="Reps"
                                                aria-invalid={set.touched && set.reps === ''}
                                                onChange={(e) =>
                                                    updateSet(
                                                        row.key,
                                                        index,
                                                        'reps',
                                                        e.target.value
                                                    )
                                                }
                                                onBlur={() => touchSet(row.key, index)}
                                            />
                                            {set.touched && set.reps === '' && (
                                                <span className="field-error-text">Required</span>
                                            )}
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                className="routine-form-input"
                                                value={set.restSeconds}
                                                aria-label="Rest (seconds)"
                                                onChange={(e) =>
                                                    updateSet(
                                                        row.key,
                                                        index,
                                                        'restSeconds',
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                className="routine-form-input"
                                                value={set.notes}
                                                aria-label="Notes"
                                                onChange={(e) =>
                                                    updateSet(
                                                        row.key,
                                                        index,
                                                        'notes',
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </td>
                                        <td>
                                            <Button
                                                variant="danger"
                                                size="icon"
                                                onClick={() => removeSet(row.key, index)}
                                                aria-label="Remove set"
                                            >
                                                <i className="fas fa-xmark"></i>
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </SetsTable>

                            <Button
                                variant="primary"
                                size="sm"
                                className="mt-2"
                                onClick={() => addSet(row.key)}
                            >
                                + Set
                            </Button>
                        </div>
                    </ExerciseCard>
                ))}
            </div>

            {errorMessage && <p className="field-error-text mt-2">{errorMessage}</p>}

            {rows.length > 0 && !hasCompleteSet && (
                <p className="field-error-text mt-2">
                    Add weight and reps to at least one set before saving.
                </p>
            )}
            {hasCompleteSet && hasIncompleteSet && (
                <p className="field-error-text mt-2">
                    Complete or remove the sets that are missing weight or reps.
                </p>
            )}
        </form>
    );
};
