import { useEffect, useState } from 'react';
import { useExercisesStore, useRoutinesStore } from '../../hooks';
import { Button } from '../../components/Button';
import { FormField } from '../../components/FormField';

export const AddExerciseForm = ({ dayId }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [notes, setNotes] = useState('');
    const [selectedExercise, setSelectedExercise] = useState(null);
    const { exercises, startSearchingExercises } = useExercisesStore();
    const { startAddingExercise } = useRoutinesStore();

    useEffect(() => {
        if (searchTerm.trim().length === 0) return;
        const timeoutId = setTimeout(() => {
            startSearchingExercises({ name: searchTerm });
        }, 400);
        return () => clearTimeout(timeoutId);
    }, [searchTerm]);

    const onSelectExercise = (exercise) => {
        setSelectedExercise(exercise);
        setSearchTerm('');
    };

    const onConfirmAdd = async () => {
        await startAddingExercise(dayId, {
            exerciseId: selectedExercise.id,
            notes: notes || undefined,
        });
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
                <>
                    <FormField
                        id="add-exercise-search"
                        label="Search Exercise"
                        placeholder="Search an exercise to add..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />

                    {searchTerm.trim().length > 0 && (
                        <ul className="list-group mt-2">
                            {exercises.map((exercise) => (
                                <li
                                    key={exercise.id}
                                    className="list-group-item list-group-item-action"
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => onSelectExercise(exercise)}
                                >
                                    <strong>{exercise.name}</strong>
                                    <div className="text-muted small">
                                        {exercise.primaryMuscles?.join(', ')} — {exercise.equipment}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </>
            )}

            {selectedExercise && (
                <div>
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
                        <Button variant="primary" size="sm" onClick={onConfirmAdd}>
                            Add
                        </Button>
                        <Button variant="secondary" size="sm" onClick={onCancel}>
                            Cancel
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};
