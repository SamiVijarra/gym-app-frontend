import { useState } from 'react';
import { useRoutinesStore } from '../../hooks';
import { Button } from '../../components/Button';

export const AddSetForm = ({ routineExerciseId }) => {
    const [weight, setWeight] = useState('');
    const [reps, setReps] = useState('');
    const [restSeconds, setRestSeconds] = useState('');
    const [notes, setNotes] = useState('');
    const { startAddingSet } = useRoutinesStore();

    const onSubmit = async (event) => {
        event.preventDefault();
        if (!weight || !reps) return;

        await startAddingSet(routineExerciseId, {
            weight: Number(weight),
            reps: Number(reps),
            restSeconds: restSeconds ? Number(restSeconds) : undefined,
            notes: notes || undefined,
        });

        setWeight('');
        setReps('');
        setRestSeconds('');
        setNotes('');
    };

    return (
        <form onSubmit={onSubmit} className="add-set-form">
            <div className="add-set-form-row">
                <div className="routine-form-field">
                    <label htmlFor="add-set-weight">Weight (kg)</label>
                    <input
                        id="add-set-weight"
                        type="number"
                        step="0.5"
                        className="routine-form-input"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                    />
                </div>
                <div className="routine-form-field">
                    <label htmlFor="add-set-reps">Reps</label>
                    <input
                        id="add-set-reps"
                        type="number"
                        className="routine-form-input"
                        value={reps}
                        onChange={(e) => setReps(e.target.value)}
                    />
                </div>
                <div className="routine-form-field">
                    <label htmlFor="add-set-rest">Rest (seg)</label>
                    <input
                        id="add-set-rest"
                        type="number"
                        className="routine-form-input"
                        value={restSeconds}
                        onChange={(e) => setRestSeconds(e.target.value)}
                    />
                </div>
                <div className="routine-form-field">
                    <label htmlFor="add-set-notes">Notes</label>
                    <input
                        id="add-set-notes"
                        type="text"
                        className="routine-form-input"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                    />
                </div>
                <Button type="submit" variant="primary" size="sm" disabled={!weight || !reps}>
                    + Serie
                </Button>
            </div>

            <div className="routine-form-field">
                <label htmlFor="add-set-notes">Notes</label>
                <input
                    id="add-set-notes"
                    type="text"
                    className="routine-form-input"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                />
            </div>
        </form>
    );
};
