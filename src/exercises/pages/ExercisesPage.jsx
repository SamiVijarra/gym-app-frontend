import { useEffect, useState } from 'react';
import { useExercisesStore } from '../../hooks';
import { Navbar } from '../../components/Navbar';
import { Link } from 'react-router-dom';

export const ExercisesPage = () => {

  const { exercises, isLoading, startSearchingExercises } = useExercisesStore();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (searchTerm.trim().length === 0) return;

    const timeoutId = setTimeout(() => {
      startSearchingExercises({ name: searchTerm });
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <h2>Catálogo de ejercicios</h2>
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Buscar ejercicio (ej. press, curl, squat)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {isLoading && <p>Buscando...</p>}

        {!isLoading && searchTerm.trim().length === 0 && (
          <p className="text-muted">Escribí algo para buscar en el catálogo.</p>
        )}

        {!isLoading && searchTerm.trim().length > 0 && exercises.length === 0 && (
          <p className="text-muted">No se encontraron ejercicios.</p>
        )}

        <div className="row">
          {exercises.map((exercise) => (
            <div className="col-md-4 mb-3" key={exercise.id}>
              <Link to={`/exercises/${exercise.id}`} className="text-decoration-none text-reset">
              <div className="card">
                {exercise.images?.[0] && (
                  <img src={exercise.images[0].url} className="card-img-top" alt={exercise.name} />
                  )}
                  <div className="card-body">
                    <h5 className="card-title">{exercise.name}</h5>
                    <p className="card-text">{exercise.primaryMuscles?.join(', ')}</p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
        </div>
    </>
  );
}