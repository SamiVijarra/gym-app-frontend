import { useEffect } from 'react';
import { useForm, useRoutinesStore } from '../../hooks';
import { Navbar } from '../../components/Navbar';
import { AddExerciseForm } from '../components/AddExerciseForm';

const newDayFields = { dayNumber: '', description: '' };

export const RoutinePage = () => {

  const { days, isLoading, startLoadingRoutine, startCreatingDay } = useRoutinesStore();

  const { dayNumber, description, onInputChange, onResetForm } = useForm(newDayFields);

  useEffect(() => {
    startLoadingRoutine();
  }, []);

  const onCreateDay = async (event) => {
    event.preventDefault();
    if (!dayNumber || !description) return;
    await startCreatingDay({ dayNumber: Number(dayNumber), description });
    onResetForm();
  }

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <h2>Mi rutina</h2>

        <form onSubmit={onCreateDay} className="mb-4 d-flex gap-2">
          <input
            type="number"
            className="form-control"
            style={{ maxWidth: '100px' }}
            placeholder="N° día"
            name="dayNumber"
            value={dayNumber}
            onChange={onInputChange}
          />
          <input
            type="text"
            className="form-control"
            placeholder="Descripción (ej. Pecho, hombros y tríceps)"
            name="description"
            value={description}
            onChange={onInputChange}
          />
          <button className="btn btn-success" type="submit">Crear día</button>
        </form>

        {isLoading && <p>Cargando rutina...</p>}

        {!isLoading && days.length === 0 && (
          <p className="text-muted">Todavía no tenés días cargados.</p>
        )}

        {days.map((day) => (
          <div className="card mb-3" key={day.id}>
            <div className="card-header">
              Día {day.dayNumber} — {day.description}
            </div>
            <div className="card-body">
              <AddExerciseForm dayId={day.id} />
              {day.exercises.length === 0 && <p className="text-muted">Sin ejercicios todavía.</p>}

              {day.exercises.map((routineExercise) => (
  <div key={routineExercise.id} className="mb-4 pb-3 border-bottom">
    <div className="d-flex gap-3">
      {routineExercise.exercise.images?.[0] && (
        <img
          src={routineExercise.exercise.images[0].url}
          alt={routineExercise.exercise.name}
          style={{ width: '100px', height: '100px', objectFit: 'cover' }}
        />
      )}
      <div>
        <strong>{routineExercise.exercise.name}</strong>
        {routineExercise.notes && (
          <span className="text-muted"> ({routineExercise.notes})</span>
        )}
        <div className="text-muted small">
          {routineExercise.exercise.primaryMuscles?.join(', ')}
          {routineExercise.exercise.equipment && ` — ${routineExercise.exercise.equipment}`}
        </div>

        {routineExercise.exercise.instructions?.length > 0 && (
          <details className="mt-1">
            <summary style={{ cursor: 'pointer' }}>Ver instrucciones</summary>
            <ol className="small mt-1">
              {routineExercise.exercise.instructions.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          </details>
        )}
      </div>
    </div>
    <table className="table table-sm mt-2">
                    <thead>
                      <tr>
                        <th>Serie</th>
                        <th>Peso</th>
                        <th>Reps</th>
                        <th>Descanso</th>
                      </tr>
                    </thead>
                    <tbody>
                      {routineExercise.sets.map((set) => (
                        <tr key={set.id}>
                          <td>{set.order}</td>
                          <td>{set.weight} kg</td>
                          <td>{set.reps}</td>
                          <td>{set.restSeconds ? `${set.restSeconds}s` : '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}