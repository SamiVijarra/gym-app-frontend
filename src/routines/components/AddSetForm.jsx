import { useState } from 'react';
import { useRoutinesStore } from '../../hooks';
import { Button } from '../../components/Button';
import { FormField } from '../../components/FormField';
import { useTranslation } from 'react-i18next';

export const AddSetForm = ({ routineExerciseId }) => {
    const { t } = useTranslation();
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
                    label={t('common.weightKg')}
                    type="number"
                    step="0.5"
                    className="form-field-narrow"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    onBlur={() => onFieldBlur('weight')}
                    error={weightError ? t('routine.weightRequired') : undefined}
                />

                <FormField
                    id="add-set-reps"
                    label={t('common.reps')}
                    type="number"
                    className="form-field-narrow"
                    value={reps}
                    onChange={(e) => setReps(e.target.value)}
                    onBlur={() => onFieldBlur('reps')}
                    error={repsError ? t('routine.repsRequired') : undefined}
                />

                <FormField
                    id="add-set-rest"
                    label={t('common.restSec')}
                    type="number"
                    className="form-field-narrow"
                    value={restSeconds}
                    onChange={(e) => setRestSeconds(e.target.value)}
                />
                <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    className="form-field-row-button"
                    disabled={!weight || !reps}
                >
                    {t('common.addSet')}
                </Button>
            </div>
            <FormField
                id="add-set-notes"
                label={t('common.notes')}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
            />
        </form>
    );
};
