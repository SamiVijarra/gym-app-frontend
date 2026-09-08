import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCalendarStore } from '../../hooks';
import { Button } from '../../components/Button';

const InlineNotesEditor = ({ id, initialNotes, onSave }) => {
    const [notes, setNotes] = useState(initialNotes ?? '');
    const [isSaving, setIsSaving] = useState(false);

    const onSubmit = async (event) => {
        event.preventDefault();
        setIsSaving(true);
        await onSave(notes);
        setIsSaving(false);
    };

    return (
        <form onSubmit={onSubmit} className="inline-notes-form">
            <label htmlFor={id} className="visually-hidden">
                Notes
            </label>
            <input
                id={id}
                type="text"
                className="routine-form-input"
                placeholder="Notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
            />
            <Button type="submit" variant="secondary" size="sm" disabled={isSaving}>
                {isSaving ? '...' : 'Save'}
            </Button>
        </form>
    );
};

export const HistorySessionView = ({ historyEntry }) => {
    const {
        startUpdatingHistoryExerciseNotes,
        startUpdatingHistorySetNotes,
        startLoadingHistoryEntry,
    } = useCalendarStore();
    const refresh = () => startLoadingHistoryEntry(historyEntry.id);

    return (
        <div className="routine-exercises">
            {historyEntry.exercises.map((historyExercise) => (
                <article key={historyExercise.id} className="routine-exercise-card">
                    <div className="routine-exercise-header">
                        {historyExercise.exercise.images?.[0] && (
                            <img
                                src={historyExercise.exercise.images[0].url}
                                alt={historyExercise.exercise.name}
                                className="routine-exercise-image"
                            />
                        )}

                        <div className="routine-exercise-info">
                            <h2 className="routine-exercise-name">
                                {historyExercise.exercise.name}
                            </h2>

                            <div className="routine-exercise-tag">
                                {historyExercise.exercise.primaryMuscles?.map((muscle) => (
                                    <span key={muscle} className="routine-tag">
                                        {muscle}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <Button
                            as={Link}
                            to={`/exercises/${historyExercise.exercise.id}/progress`}
                            variant="ghost"
                            size="icon"
                            aria-label="View progress"
                            title="View progress"
                        >
                            <i className="fas fa-chart-line"></i>
                        </Button>
                    </div>

                    <InlineNotesEditor
                        id={`exercise-notes-${historyExercise.id}`}
                        initialNotes={historyExercise.notes}
                        onSave={async (notes) => {
                            await startUpdatingHistoryExerciseNotes(historyExercise.id, notes);
                            await refresh();
                        }}
                    />

                    <div className="routine-table-wrapper mt-2">
                        <table className="routine-sets-table">
                            <thead>
                                <tr>
                                    <th>Set</th>
                                    <th>Weight</th>
                                    <th>Reps</th>
                                    <th>Rest</th>
                                    <th>Notes</th>
                                </tr>
                            </thead>
                            <tbody>
                                {historyExercise.sets.map((set) => (
                                    <tr key={set.id}>
                                        <td>{set.order}</td>
                                        <td>{set.weight} kg</td>
                                        <td>{set.reps}</td>
                                        <td>{set.restSeconds ? `${set.restSeconds}s` : '-'}</td>
                                        <td>
                                            <InlineNotesEditor
                                                id={`set-notes-${set.id}`}
                                                initialNotes={set.notes}
                                                onSave={async (notes) => {
                                                    await startUpdatingHistorySetNotes(
                                                        set.id,
                                                        notes
                                                    );
                                                    await refresh();
                                                }}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </article>
            ))}
        </div>
    );
};
