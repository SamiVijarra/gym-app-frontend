import { useEffect, useState } from 'react';
import { useCalendarStore, useExercisesStore } from '../../hooks';

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

                            <button
                                type="button"
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => removeRow(row.key)}
                            >
                                Remove
                            </button>
                        </div>

                        <input
                            type="text"
                            className="form-control form-control-sm mt-2 mb-2"
                            placeholder="Notes for this exercise (optional)"
                            value={row.notes}
                            onChange={(e) => updateRowNotes(row.key, e.target.value)}
                        />

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
                                                    className="form-control form-control-sm"
                                                    value={set.weight}
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
                                                    className="form-control form-control-sm"
                                                    value={set.reps}
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
                                                    className="form-control form-control-sm"
                                                    value={set.restSeconds}
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
                                                    className="form-control form-control-sm"
                                                    value={set.notes}
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
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-outline-secondary"
                                                    onClick={() => removeSet(row.key, index)}
                                                >
                                                    ✕
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <button
                            type="button"
                            className="btn btn-sm btn-outline-success mt-2"
                            onClick={() => addSet(row.key)}
                        >
                            + Set
                        </button>
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

                <input
                    type="text"
                    className="form-control mb-1"
                    placeholder="Search exercise to add..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                {searchTerm.trim().length > 0 && (
                    <ul className="list-group">
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

            {errorMessage && <p className="text-danger mt-2">{errorMessage}</p>}

            <button className="btn btn-success mt-3" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save session'}
            </button>
        </form>
    );
};
