import { useParams, Link } from 'react-router-dom';
import { useRoutinesStore } from '../../hooks';
import { Navbar } from '../../components/Navbar';
import { AddExerciseForm } from '../components/AddExerciseForm';
import { AddSetForm } from '../components/AddSetForm';
import { SetRow } from '../components/SetRow';

export const RoutineDayDetailPage = () => {

  const { dayId } = useParams();
  const { days, isLoading } = useRoutinesStore();

  const day = days.find(d => d.id === dayId);

  if (isLoading) return <h3>Cargando...</h3>;
  if (!day) return <h3>Día no encontrado</h3>;

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <Link to="/routine" className="btn btn-outline-secondary btn-sm mb-3">← Volver a mi rutina</Link>

        <h2>Día {day.dayNumber} — {day.description}</h2>

        {day.exercises.length === 0 && <p className="text-muted">Sin ejercicios todavía.</p>}

        {day.exercises.map((routineExercise) => (
          <div key={routineExercise.id} className="mb-4 pb-3 border-bottom">
            <div className="d-flex gap-3">
              {routineExercise.exercise.images?.[0] && (
                <img src={routineExercise.exercise.images[0].url} alt={routineExercise.exercise.name} style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
              )}
              <div>
                <strong>{routineExercise.exercise.name}</strong>
                {routineExercise.notes && <span className="text-muted"> ({routineExercise.notes})</span>}
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
                  <th>Serie</th><th>Peso</th><th>Reps</th><th>Descanso</th><th>Notas</th><th></th>
                </tr>
              </thead>
              <tbody>
                {routineExercise.sets.map((set) => (
                  <SetRow key={set.id} set={set} />
                ))}
              </tbody>
            </table>

            <AddSetForm routineExerciseId={routineExercise.id} />
          </div>
        ))}

        <AddExerciseForm dayId={day.id} />
      </div>
    </>
  );
}