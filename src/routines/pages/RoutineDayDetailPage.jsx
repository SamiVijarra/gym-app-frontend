import { useParams, Link } from 'react-router-dom';
import { useRoutinesStore } from '../../hooks';
import { Navbar } from '../../components/Navbar';
import { AddExerciseForm } from '../components/AddExerciseForm';
import { AddSetForm } from '../components/AddSetForm';
import { SetRow } from '../components/SetRow';

export const RoutineDayDetailPage = () => {
   const { dayId } = useParams();
   const { days, isLoading } = useRoutinesStore();

   const day = days.find((d) => d.id === dayId);

   if (isLoading) {
      return (
         <>
            <Navbar />
            <main className="routine-detail-page">
               <div className="routine-detail-container">
                  <p className="routine-detail-loading">Cargando...</p>
               </div>
            </main>
         </>
      );
   }

   if (!day) {
      return (
         <>
            <Navbar />
            <main className="routine-detail-page">
               <div className="routine-detail-container">
                  <p className="routine-detail-loading">Día no encontrado</p>
               </div>
            </main>
         </>
      );
   }

   return (
      <>
         <Navbar />

         <main className="routine-detail-page">
            <div className="routine-detail-container">
               <Link to="/routine" className="routine-back-link">
                  <span>←</span>
                  Volver a mi rutina
               </Link>

               <header className="routine-detail-header">
                  <div className="routine-detail-eyebrow">DÍA {day.dayNumber}</div>

                  <h1 className="routine-detail-title">{day.description}</h1>

                  <div className="routine-detail-meta">
                     <span>
                        {day.exercises.length}{' '}
                        {day.exercises.length === 1 ? 'ejercicio' : 'ejercicios'}
                     </span>

                     <span className="routine-detail-meta-dot">•</span>

                     <span>Rutina programada</span>
                  </div>
               </header>

               {day.exercises.length === 0 && (
                  <section className="routine-empty-state">
                     <div className="routine-empty-icon">+</div>

                     <h2>Todavía no hay ejercicios</h2>

                     <p>Agregá el primer ejercicio para empezar a construir este día.</p>
                  </section>
               )}
               <div className="routine-exercises">
                  {day.exercises.map((routineExercise, index) => (
                     <article key={routineExercise.id} className="routine-exercise-card">
                        <div className="routine-exercise-header">
                           <div className="routine-exercise-number">
                              {String(index + 1).padStart(2, '0')}
                           </div>
                           {routineExercise.exercise.images?.[0] && (
                              <img
                                 src={routineExercise.exercise.images[0].url}
                                 alt={routineExercise.exercise.name}
                                 className="routine-exercise-image"
                              />
                           )}
                           <div className="routine-exercise-info">
                              <h2 className="routine-exercise-name">
                                 {routineExercise.exercise.name}
                              </h2>
                              {routineExercise.notes && (
                                 <p className="routine-exercise-notes">{routineExercise.notes}</p>
                              )}
                              <div className="routine-exercise-tag">
                                 {routineExercise.exercise.primaryMuscles?.map((muscle) => {
                                    <span key={muscle} className="routine-tag">
                                       {muscle}
                                    </span>;
                                 })}

                                 {routineExercise.exercise.equipment && (
                                    <span className="routine-tag routine-tag-muted">
                                       {routineExercise.exercise.equipment}
                                    </span>
                                 )}
                              </div>
                           </div>
                        </div>

                        {routineExercise.exercise.instructions?.length > 0 && (
                           <details className="routine-instructions">
                              <summary>Ver instrucciones</summary>
                              <ol>
                                 {routineExercise.exercise.instructions.map((step, stepIndex) => (
                                    <li key={stepIndex}>{step}</li>
                                 ))}
                              </ol>
                           </details>
                        )}
                        <div className="routine-sets-section">
                           <div className="routine-sets-header">
                              <div>
                                 <span className="routine-section-label">Series</span>
                                 <span className="routine-section-description">
                                    Registrá tu rendimiento
                                 </span>
                              </div>
                              <span className="routine-set-count">
                                 {routineExercise.sets.length}
                                 {''}
                                 {routineExercise.sets.length === 1 ? 'serie' : 'series'}
                              </span>
                           </div>
                           <div className="routine-table-wrapper">
                              <table className="routine-sets-table">
                                 <thead>
                                    <tr>
                                       <th>Serie</th>
                                       <th>Peso</th>
                                       <th>Reps</th>
                                       <th>Descanso</th>
                                       <th>Notas</th>
                                       <th></th>
                                    </tr>
                                 </thead>
                                 <tbody>
                                    {routineExercise.sets.map((set) => (
                                       <SetRow key={set.id} set={set} />
                                    ))}
                                 </tbody>
                              </table>
                           </div>
                           <div className="routine-add-set">
                              <div className="routine-add-set-title">Agregar serie</div>
                              <AddSetForm routineExerciseId={routineExercise.id} />
                           </div>
                        </div>
                     </article>
                  ))}
               </div>
               <section className="routine-add-exercise">
                  <div className="routine-add-exercise-header">
                     <div>
                        <span className="routine-section-label">EJERCICIOS</span>
                        <h2>Agregar ejercicio</h2>
                        <p>Buscá y agrega ejercicios</p>
                     </div>
                  </div>
                  <AddExerciseForm dayId={day.id} />
               </section>
            </div>
         </main>
      </>
   );
};
