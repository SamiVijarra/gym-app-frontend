import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { useExercisesStore } from '../../hooks';
import { Navbar } from '../../components/Navbar';

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
            <main className="app-page exercises-page">
                <div className="app-page-container exercises-page-container">
                    <header className="app-page-header exercises-page-header">
                        <span className="app-page-eyebrow exercises-page-eyebrow">EXERCISES</span>

                        <h1 className="app-page-title">Catálogo de ejercicios</h1>

                        <p className="app-page-subtitle">
                            Buscá ejercicios y consultá su información para completar tu
                            entrenamiento.
                        </p>
                    </header>
                    <section className="exercises-search">
                        <div className="exercises-search-icon">
                            <i className="fas fa-search"></i>
                        </div>
                        <input
                            type="text"
                            placeholder="Buscar ejercicio..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {searchTerm && (
                            <button
                                type="button"
                                className="exercises-search-clear"
                                onClick={() => setSearchTerm('')}
                                aria-label="Limpiar búsqueda"
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        )}
                    </section>

                    {isLoading && (
                        <div className="exercises-page-loading">
                            <div className="exercises-loading-spinner"></div>

                            <span>Buscando ejercicios...</span>
                        </div>
                    )}

                    {!isLoading && searchTerm.trim().length === 0 && (
                        <div className="exercises-page-empty">
                            <div className="exercises-empty-icon">
                                <i className="fas fa-dumbbell"></i>
                            </div>

                            <h2>Buscá un ejercicio</h2>

                            <p>
                                Escribí el nombre de un ejercicio para comenzar a explorar el
                                catálogo.
                            </p>
                        </div>
                    )}

                    {!isLoading && searchTerm.trim().length > 0 && exercises.length === 0 && (
                        <div className="exercises-page-empty">
                            <div className="exercises-empty-icon">
                                <i className="fas fa-search"></i>
                            </div>
                            <h2>No encontramos ejercicios</h2>

                            <p>Probá con otro nombre o término de búsqueda.</p>
                        </div>
                    )}
                    {!isLoading && exercises.length > 0 && (
                        <section className="exercises-results">
                            <div className="exercises-results-header">
                                <span>RESULTADOS</span>
                                <p>
                                    {exercises.length}{' '}
                                    {exercises.length === 1 ? 'ejercicio' : 'ejercicios'}
                                </p>
                            </div>
                            <div className="exercises-grid">
                                {exercises.map((exercise) => (
                                    <Link
                                        key={exercise.id}
                                        to={`/exercises/${exercise.id}`}
                                        className="exercise-card"
                                    >
                                        <div className="exercise-card-image">
                                            {exercise.images?.[0] ? (
                                                <img
                                                    src={exercise.images[0].url}
                                                    alt={exercise.name}
                                                />
                                            ) : (
                                                <div className="exercise-card-placeholder">
                                                    <i className="fas fa-dumbbell"></i>
                                                </div>
                                            )}
                                        </div>
                                        <div className="exercise-card-body">
                                            <div className="exercise-card-info">
                                                <h2>{exercise.name}</h2>
                                                {exercise.primaryMuscles?.length > 0 && (
                                                    <p>{exercise.primaryMuscles.join(' · ')}</p>
                                                )}
                                            </div>

                                            <div className="exercise-card-arrow">→</div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </main>
        </>
    );
};
