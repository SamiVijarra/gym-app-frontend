import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCalendarStore } from '../../hooks';

const InlineNotesEditor = ({ initialNotes, onSave }) => {
    const [notes, setNotes] = useState(initialNotes ?? '');
    const [isSaving, setIsSaving] = useState(false);

    const onSubmit = async (event) => {
        event.preventDefault();
        setIsSaving(true);
        await onSave(notes);
        setIsSaving(false);
    };

    return (
        <form onSubmit={onSubmit} className="d-flex gap-2 align-items-center">
            <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
            />
            <button className="btn btn-sm btn-outline-success" type="submit" disabled={isSaving}>
                {isSaving ? '...' : 'Save'}
            </button>
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
                        <Link
                            to={`/exercises/${historyExercise.exercise.id}/progress`}
                            className="routine-day-delete routine-icon-button-progress"
                            aria-label="View progress"
                            title="View progress"
                        >
                            <i className="fas fa-chart-line"></i>
                        </Link>
                    </div>

                    <InlineNotesEditor
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
