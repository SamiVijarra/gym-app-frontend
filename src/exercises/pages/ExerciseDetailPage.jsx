import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useExercisesStore, useRoutinesStore } from '../../hooks';
import { Navbar } from '../../components/Navbar';

export const ExerciseDetailPage = () => {

  const { id } = useParams();
  const navigate = useNavigate();
  const { selectedExercise, startLoadingExercise } = useExercisesStore();
  const { days, startAddingExercise, startCreatingDay, startLoadingRoutine } = useRoutinesStore();

  const [notes, setNotes] = useState('');
  const [mode, setMode] = useState('existing'); // 'existing' | 'new'
  const [selectedDayId, setSelectedDayId] = useState('');
  const [newDayNumber, setNewDayNumber] = useState('');
  const [newDayDescription, setNewDayDescription] = useState('');

  useEffect(() => {
    startLoadingExercise(id);
    startLoadingRoutine();
  }, [id]);

  const onAddToExistingDay = async () => {
    if (!selectedDayId) return;
    await startAddingExercise(selectedDayId, { exerciseId: id, notes: notes || undefined });
    navigate(`/routine/${selectedDayId}`);
  }

  const onCreateDayAndAdd = async () => {
    if (!newDayNumber || !newDayDescription) return;
    const newDay = await startCreatingDay({ dayNumber: Number(newDayNumber), description: newDayDescription });
    if (!newDay) return;
    await startAddingExercise(newDay.id, { exerciseId: id, notes: notes || undefined });
    navigate(`/routine/${newDay.id}`);
  }

  if (!selectedExercise) return <h3>Cargando...</h3>;

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <Link to="/exercises" className="btn btn-outline-secondary btn-sm mb-3">← Volver a ejercicios</Link>

        <h2>{selectedExercise.name}</h2>
        <p className="text-muted">
          {selectedExercise.primaryMuscles?.join(', ')}
          {selectedExercise.equipment && ` — ${selectedExercise.equipment}`}
        </p>

        {selectedExercise.images?.[0] && (
          <img src={selectedExercise.images[0].url} alt={selectedExercise.name} style={{ maxWidth: '300px' }} className="mb-3" />
        )}

        {selectedExercise.instructions?.length > 0 && (
          <details className="mb-4">
            <summary style={{ cursor: 'pointer' }}>Ver instrucciones</summary>
            <ol className="mt-2">
              {selectedExercise.instructions.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          </details>
        )}

        <hr />
        <h4>Agregar a mi rutina</h4>

        <div className="form-group mb-3">
          <label>Notas (opcional)</label>
          <input type="text" className="form-control" placeholder="ej. con mancuernas" value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>

        <div className="btn-group mb-3">
          <button className={`btn btn-sm ${mode === 'existing' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setMode('existing')}>
            A un día existente
          </button>
          <button className={`btn btn-sm ${mode === 'new' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setMode('new')}>
            Crear día nuevo
          </button>
        </div>

        {mode === 'existing' && (
          <div className="d-flex gap-2">
            <select className="form-select" value={selectedDayId} onChange={(e) => setSelectedDayId(e.target.value)}>
              <option value="">Elegí un día...</option>
              {days.map((day) => (
                <option key={day.id} value={day.id}>
                  Día {day.dayNumber} — {day.description}
                </option>
              ))}
            </select>
            <button className="btn btn-success" onClick={onAddToExistingDay}>Agregar</button>
          </div>
        )}

        {mode === 'new' && (
          <div className="d-flex gap-2">
            <input type="number" className="form-control" style={{ maxWidth: '100px' }} placeholder="N° día" value={newDayNumber} onChange={(e) => setNewDayNumber(e.target.value)} />
            <input type="text" className="form-control" placeholder="Descripción" value={newDayDescription} onChange={(e) => setNewDayDescription(e.target.value)} />
            <button className="btn btn-success" onClick={onCreateDayAndAdd}>Crear y agregar</button>
          </div>
        )}
      </div>
    </>
  );
}