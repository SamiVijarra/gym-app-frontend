import { useEffect, useState } from 'react';
import { useExercisesStore, useRoutinesStore } from '../../hooks';

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
  }

  const onConfirmAdd = async () => {
    await startAddingExercise(dayId, { exerciseId: selectedExercise.id, notes: notes || undefined });
    setSelectedExercise(null);
    setNotes('');
  }

  const onCancel = () => {
    setSelectedExercise(null);
    setNotes('');
  }

  return (
    <div className="border rounded p-2 mt-2">

      {!selectedExercise && (
        <>
          <input
            type="text"
            className="form-control mb-1"
            placeholder="Buscar ejercicio para agregar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {searchTerm.trim().length > 0 && (
            <ul className="list-group">
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
              {selectedExercise.primaryMuscles?.join(', ')} — {selectedExercise.equipment}
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

          <input
            type="text"
            className="form-control mb-2"
            placeholder="Notas (opcional, ej. con mancuernas)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          <button className="btn btn-success btn-sm me-2" onClick={onConfirmAdd}>
            Agregar
          </button>
          <button className="btn btn-outline-secondary btn-sm" onClick={onCancel}>
            Cancelar
          </button>
        </div>
      )}
    </div>
  );
}