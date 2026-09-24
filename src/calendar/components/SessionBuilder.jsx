import { useEffect, useState } from 'react';
import { useCalendarStore, useExercisesStore } from '../../hooks';
import { Button } from '../../components/Button';
import { FormField } from '../../components/FormField';
import { EmptyState } from '../../components/EmptyState';
import { ExerciseCard } from '../../components/ExerciseCard';
import { SetsTable } from '../../components/SetsTable';

let rowKeySeed = 0;
const nextRowKey = () => `row-${++rowKeySeed}`;

const buildInitialRows = (initialExercises) =>
    (initialExercises ?? []).map((item) => ({
        key: nextRowKey(),
        exerciseId: item.exercise.id,
        exercise: item.exercise,
        notes: item.notes ?? '',
        sets: (item.suggestedSets ?? []).map((set) => ({
            weight: set.weight ?? '',
            reps: set.reps ?? '',
            restSeconds: set.restSeconds ?? '',
            notes: '',
        })),
    }));

export const SessionBuilder = ({
    date,
    routineDayId,
    calendarEntryId,
    initialExercises,
    onDone,
}) => {
    const [rows, setRows] = useState(() => buildInitialRows(initialExercises));
    const [searchTerm, setSearchTerm] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { exercises: searchResults, startSearchingExercises } = useExercisesStore();
    const { startCompletingSession, errorMessage } = useCalendarStore();

    useEffect(() => {
        setRows(buildInitialRows(initialExercises));
    }, [initialExercises]);

    useEffect(() => {
        if (searchTerm.trim().length === 0) return;
        const timeoutId = setTimeout(() => {
            startSearchingExercises({ name: searchTerm });
        }, 400);
        return () => clearTimeout(timeoutId);
    }, [searchTerm]);

    const addExerciseRow = (exercise) => {
        setRows((current) => [
            ...current,
            { key: nextRowKey(), exerciseId: exercise.id, exercise, notes: '', sets: [] },
        ]);
        setSearchTerm('');
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
                          sets: [...row.sets, { weight: '', reps: '', restSeconds: '', notes: '' }],
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

    const removeSet = (key, setIndex) => {
        setRows((current) =>
            current.map((row) =>
                row.key === key
                    ? { ...row, sets: row.sets.filter((_, index) => index !== setIndex) }
                    : row
            )
        );
    };

    const canSubmit = rows.some((row) =>
        row.sets.some((set) => set.weight !== '' && set.reps !== '')
    );

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

            <section className="routine-add-exercise routine-add-exercise-spacing">
                <div className="routine-add-exercise-header">
                    <div>
                        <span className="routine-section-label">EXERCISES</span>
                        <h2>Add exercise</h2>
                        <p>Search and add exercises to this session</p>
                    </div>
                </div>

                <FormField
                    id="session-builder-search"
                    label="Search exercise"
                    placeholder="Search exercise to add..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                {searchTerm.trim().length > 0 && (
                    <ul className="list-group mt-2">
                        {searchResults.map((exercise) => (
                            <li
                                key={exercise.id}
                                className="list-group-item list-group-item-action"
                                style={{ cursor: 'pointer' }}
                                onClick={() => addExerciseRow(exercise)}
                            >
                                <strong>{exercise.name}</strong>
                                <div className="text-muted small">
                                    {exercise.primaryMuscles?.join(', ')} — {exercise.equipment}
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </section>

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
                                                className="routine-form-input"
                                                value={set.weight}
                                                aria-label="Weight (kg)"
                                                onChange={(e) =>
                                                    updateSet(
                                                        row.key,
                                                        index,
                                                        'weight',
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                className="routine-form-input"
                                                value={set.reps}
                                                aria-label="Reps"
                                                onChange={(e) =>
                                                    updateSet(
                                                        row.key,
                                                        index,
                                                        'reps',
                                                        e.target.value
                                                    )
                                                }
                                            />
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

            {!canSubmit && rows.length > 0 && (
                <p className="field-error-text mt-2">
                    Add weight and reps to at least one set before saving.
                </p>
            )}
        </form>
    );
};
