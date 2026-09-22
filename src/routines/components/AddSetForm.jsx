import { useState } from 'react';
import { useRoutinesStore } from '../../hooks';
import { Button } from '../../components/Button';
import { FormField } from '../../components/FormField';

export const AddSetForm = ({ routineExerciseId }) => {
    const [weight, setWeight] = useState('');
    const [reps, setReps] = useState('');
    const [restSeconds, setRestSeconds] = useState('');
    const [notes, setNotes] = useState('');
    const { startAddingSet } = useRoutinesStore();
    const [touched, setTouched] = useState({ weight: false, reps: false });
    const onFieldBlur = (field) => setTouched((current) => ({ ...current, [field]: true }));
    const weightError = touched.weight && !weight;
    const repsError = touched.reps && !reps;

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
                <FormField
                    id="add-set-weight"
                    label="Weight (kg)"
                    step="0.5"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    onBlur={() => onFieldBlur('weight')}
                />
                {weightError && <span className="field-error-text">Weight is required.</span>}

                <FormField
                    id="add-set-reps"
                    label="Reps"
                    value={reps}
                    onChange={(e) => setReps(e.target.value)}
                    onBlur={() => onFieldBlur('reps')}
                />
                {repsError && <span className="field-error-text">Reps is required.</span>}

                <FormField
                    id="add-set-rest"
                    label="Rest (seg)"
                    value={restSeconds}
                    onChange={(e) => setRestSeconds(e.target.value)}
                />

                <Button type="submit" variant="primary" size="sm" disabled={!weight || !reps}>
                    + Set
                </Button>
            </div>

            <FormField
                id="add-set-notes"
                label="Notes"
                className="routine-form-input"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
            />
        </form>
    );
};
