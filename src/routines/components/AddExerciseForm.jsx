import { useState } from 'react';
import { useRoutinesStore } from '../../hooks';
import { Button } from '../../components/Button';
import { FormField } from '../../components/FormField';
import { ExercisePicker } from '../../calendar/components/ExercisePicker';

export const AddExerciseForm = ({ dayId }) => {
    const [notes, setNotes] = useState('');
    const [selectedExercise, setSelectedExercise] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    const { startAddingExercise } = useRoutinesStore();

    const onConfirmAdd = async () => {
        if (!selectedExercise || isAdding) return;
        setIsAdding(true);
        await startAddingExercise(dayId, {
            exerciseId: selectedExercise.id,
            notes: notes || undefined,
        });
        setIsAdding(false);
        setSelectedExercise(null);
        setNotes('');
    };

    const onCancel = () => {
        setSelectedExercise(null);
        setNotes('');
    };

    return (
        <div className="add-exercise-form">
            {!selectedExercise && (
                <ExercisePicker idPrefix="add-exercise" onSelect={setSelectedExercise} />
            )}

            {selectedExercise && (
                <>
                    <div className="mb-2">
                        <strong>{selectedExercise.name}</strong>
                        <div className="text-muted small">
                            {selectedExercise.primaryMuscles?.join(', ')} —{' '}
                            {selectedExercise.equipment}
                        </div>
                        {selectedExercise.images?.[0] && (
                            <img
                                src={selectedExercise.images[0].url}
                                alt={selectedExercise.name}
                                style={{ maxWidth: '150px' }}
                                className="mt-1"
                            />
                        )}
                    </div>

                    <FormField
                        id="add-exercise-notes"
                        label="Notes (optional)"
                        placeholder="ex. with dumbbells"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                    />

                    <div className="add-exercise-form-actions">
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={onConfirmAdd}
                            disabled={isAdding}
                        >
                            {isAdding ? 'Adding...' : 'Add'}
                        </Button>
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={onCancel}
                            disabled={isAdding}
                        >
                            Cancel
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
};
