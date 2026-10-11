import { useState } from 'react';
import Swal from 'sweetalert2';
import { useRoutinesStore } from '../../hooks';
import { Button } from '../../components/Button';
import { useTranslation } from 'react-i18next';

export const SetRow = ({ set }) => {
    const { t } = useTranslation();
    const [isEditing, setIsEditing] = useState(false);
    const [weight, setWeight] = useState(set.weight);
    const [reps, setReps] = useState(set.reps);
    const [restSeconds, setRestSeconds] = useState(set.restSeconds ?? '');
    const [notes, setNotes] = useState(set.notes ?? '');
    const { startUpdatingSet, startRemovingSet } = useRoutinesStore();

    const onSave = async () => {
        if (!weight || !reps) return;
        await startUpdatingSet(set.id, {
            weight: Number(weight),
            reps: Number(reps),
            restSeconds: restSeconds ? Number(restSeconds) : undefined,
            notes: notes || undefined,
        });
        setIsEditing(false);
    };

    const onCancel = () => {
        setWeight(set.weight);
        setReps(set.reps);
        setRestSeconds(set.restSeconds ?? '');
        setNotes(set.notes ?? '');
        setIsEditing(false);
    };

    const onDelete = async () => {
        const result = await Swal.fire({
            title: t('routine.deleteSetTitle'),
            text: t('routine.deleteSetText', { order: set.order }),
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: t('common.yesDelete'),
            cancelButtonText: t('common.cancel'),
        });

        if (result.isConfirmed) {
            await startRemovingSet(set.id);
        }
    };

    if (!isEditing) {
        return (
            <tr>
                <td>{set.order}</td>
                <td>
                    {set.weight} {t('common.kg')}
                </td>
                <td>{set.reps}</td>
                <td>{set.restSeconds ? t('common.seconds', { value: set.restSeconds }) : '-'}</td>
                <td>{set.notes || '-'}</td>
                <td className="routine-set-actions">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsEditing(true)}
                        aria-label={t('routine.editSet')}
                    >
                        <i className="fas fa-pen"></i>
                    </Button>
                    <Button
                        variant="danger"
                        size="icon"
                        onClick={onDelete}
                        aria-label={t('routine.deleteSet')}
                    >
                        <i className="fas fa-trash"></i>
                    </Button>
                </td>
            </tr>
        );
    }

    return (
        <tr>
            <td>{set.order}</td>
            <td>
                <input
                    type="number"
                    step="0.5"
                    className="routine-form-input"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    aria-label={t('common.weightKg')}
                />
            </td>
            <td>
                <input
                    type="number"
                    className="routine-form-input"
                    value={reps}
                    onChange={(e) => setReps(e.target.value)}
                    aria-label={t('common.reps')}
                />
            </td>
            <td>
                <input
                    type="number"
                    className="routine-form-input"
                    value={restSeconds}
                    onChange={(e) => setRestSeconds(e.target.value)}
                    aria-label={t('common.restSeconds')}
                />
            </td>
            <td>
                <input
                    type="text"
                    className="routine-form-input"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    aria-label={t('common.notes')}
                />
            </td>
            <td className="routine-set-actions">
                <Button
                    variant="primary"
                    size="icon"
                    onClick={onSave}
                    disabled={!weight || !reps}
                    aria-label={t('routine.saveSet')}
                >
                    <i className="fas fa-check"></i>
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onCancel}
                    aria-label={t('common.cancel')}
                >
                    <i className="fas fa-xmark"></i>
                </Button>
            </td>
        </tr>
    );
};
