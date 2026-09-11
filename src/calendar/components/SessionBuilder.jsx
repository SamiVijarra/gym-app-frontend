import { useEffect, useState } from 'react';
import { useCalendarStore, useExercisesStore } from '../../hooks';
import { Button } from '../../components/Button';

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
                <section className="routine-empty-state">
                    <div className="routine-empty-icon">+</div>
                    <h2>No exercises yet</h2>
                    <p>Search and add exercises below to log this session.</p>
                </section>
            )}

            <div className="routine-exercises">
                {rows.map((row) => (
                    <article key={row.key} className="routine-exercise-card">
                        <div className="routine-exercise-header">
                            {row.exercise.images?.[0] && (
                                <img
                                    src={row.exercise.images[0].url}
                                    alt={row.exercise.name}
                                    className="routine-exercise-image"
                                />
                            )}

                            <div className="routine-exercise-info">
                                <h2 className="routine-exercise-name">{row.exercise.name}</h2>

                                <div className="routine-exercise-tag">
                                    {row.exercise.primaryMuscles?.map((muscle) => (
                                        <span key={muscle} className="routine-tag">
                                            {muscle}
                                        </span>
                                    ))}

                                    {row.exercise.equipment && (
                                        <span className="routine-tag routine-tag-muted">
                                            {row.exercise.equipment}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <Button variant="danger" size="sm" onClick={() => removeRow(row.key)}>
                                Remove
                            </Button>
                        </div>

                        <div className="routine-form-field mt-2 mb-2">
                            <label htmlFor={`notes-${row.key}`}>
                                Notes for this exercise (optional)
                            </label>
                            <input
                                id={`notes-${row.key}`}
                                type="text"
                                className="routine-form-input"
                                value={row.notes}
                                onChange={(e) => updateRowNotes(row.key, e.target.value)}
                            />
                        </div>

                        <div className="routine-table-wrapper">
                            <table className="routine-sets-table">
                                <thead>
                                    <tr>
                                        <th>Set</th>
                                        <th>Weight</th>
                                        <th>Reps</th>
                                        <th>Rest</th>
                                        <th>Notes</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
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
                                </tbody>
                            </table>
                        </div>

                        <Button
                            variant="primary"
                            size="sm"
                            className="mt-2"
                            onClick={() => addSet(row.key)}
                        >
                            + Set
                        </Button>
                    </article>
                ))}
            </div>

            <section className="routine-add-exercise">
                <div className="routine-add-exercise-header">
                    <div>
                        <span className="routine-section-label">EXERCISES</span>
                        <h2>Add exercise</h2>
                        <p>Search and add exercises to this session</p>
                    </div>
                </div>

                <div className="routine-form-field">
                    <label htmlFor="session-builder-search">Search exercise</label>
                    <input
                        id="session-builder-search"
                        type="text"
                        className="routine-form-input"
                        placeholder="Search exercise to add..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

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

            {errorMessage && <p className="field-error-text mt-2">{errorMessage}</p>}

            {!canSubmit && rows.length > 0 && (
                <p className="field-error-text mt-2">
                    Add weight and reps to at least one set before saving.
                </p>
            )}

            <Button
                type="submit"
                variant="primary"
                className="mt-3"
                disabled={isSubmitting || !canSubmit}
            >
                {isSubmitting ? 'Saving...' : 'Save session'}
            </Button>
        </form>
    );
};
