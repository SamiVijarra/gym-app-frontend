import { useState } from 'react';
import { useRoutinesStore } from '../../hooks';

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
  }

  return (
    <form onSubmit={onSubmit} className="d-flex gap-2 mt-2 align-items-end flex-wrap">
      <div>
        <label className="form-label small mb-0">Peso (kg)</label>
        <input type="number" step="0.5" className="form-control form-control-sm" value={weight} onChange={(e) => setWeight(e.target.value)} />
      </div>
      <div>
        <label className="form-label small mb-0">Reps</label>
        <input type="number" className="form-control form-control-sm" value={reps} onChange={(e) => setReps(e.target.value)} />
      </div>
      <div>
        <label className="form-label small mb-0">Descanso (seg)</label>
        <input type="number" className="form-control form-control-sm" value={restSeconds} onChange={(e) => setRestSeconds(e.target.value)} />
      </div>
      <div style={{ minWidth: '150px' }}>
        <label className="form-label small mb-0">Notas</label>
        <input type="text" className="form-control form-control-sm" value={notes} onChange={(e) => setNotes(e.target.value)} />
      </div>
      <button className="btn btn-sm btn-outline-success" type="submit">
        + Serie
      </button>
    </form>
  );
}