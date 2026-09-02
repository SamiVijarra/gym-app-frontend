import { useState } from 'react';
import Swal from 'sweetalert2';
import { useRoutinesStore } from '../../hooks';

export const SetRow = ({ set }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [weight, setWeight] = useState(set.weight);
    const [reps, setReps] = useState(set.reps);
    const [restSeconds, setRestSeconds] = useState(set.restSeconds ?? '');
    const [notes, setNotes] = useState(set.notes ?? '');
    const { startUpdatingSet, startRemovingSet } = useRoutinesStore();

    const onSave = async () => {
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
            title: 'Delete set?',
            text: `Set ${set.order} will be permanently deleted.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete',
            cancelButtonText: 'Cancel',
        });

        if (result.isConfirmed) {
            await startRemovingSet(set.id);
        }
    };

    if (!isEditing) {
        return (
            <tr>
                <td>{set.order}</td>
                <td>{set.weight} kg</td>
                <td>{set.reps}</td>
                <td>{set.restSeconds ? `${set.restSeconds}s` : '-'}</td>
                <td>{set.notes || '-'}</td>
                <td>
                    <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => setIsEditing(true)}
                    >
                        <i className="fas fa-pen"></i>
                    </button>
                    <button className="btn btn-sm btn-outline-danger" onClick={onDelete}>
                        <i className="fas fa-trash"></i>
                    </button>
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
                    className="form-control form-control-sm"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                />
            </td>
            <td>
                <input
                    type="number"
                    className="form-control form-control-sm"
                    value={reps}
                    onChange={(e) => setReps(e.target.value)}
                />
            </td>
            <td>
                <input
                    type="number"
                    className="form-control form-control-sm"
                    value={restSeconds}
                    onChange={(e) => setRestSeconds(e.target.value)}
                />
            </td>
            <td>
                <input
                    type="text"
                    className="form-control form-control-sm"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                />
            </td>
            <td>
                <button className="btn btn-sm btn-success me-1" onClick={onSave}>
                    <i className="fas fa-check"></i>
                </button>
                <button className="btn btn-sm btn-outline-secondary" onClick={onCancel}>
                    <i className="fas fa-xmark"></i>
                </button>
            </td>
        </tr>
    );
};
