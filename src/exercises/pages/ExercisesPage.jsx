import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { useExercisesStore, useForm } from '../../hooks';
import { Navbar } from '../../components/Navbar';

const newExerciseFields = {
    name: '',
    primaryMuscles: '',
    equipment: '',
    instructions: '',
    imageUrl: '',
};

export const ExercisesPage = () => {
    const { exercises, isLoading, startSearchingExercises, startCreatingExercise } =
        useExercisesStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    const { name, primaryMuscles, equipment, instructions, imageUrl, onInputChange, onResetForm } =
        useForm(newExerciseFields);

    useEffect(() => {
        if (searchTerm.trim().length === 0) return;

        const timeoutId = setTimeout(() => {
            startSearchingExercises({ name: searchTerm });
        }, 400);

        return () => clearTimeout(timeoutId);
    }, [searchTerm]);

    const onCreateExercise = async (event) => {
        event.preventDefault();
        if (!name || !primaryMuscles) return;

        setIsCreating(true);
        const created = await startCreatingExercise({
            name,
            primaryMuscles: primaryMuscles
                .split(',')
                .map((m) => m.trim())
                .filter(Boolean),
            equipment: equipment || undefined,
            instructions: instructions
                ? instructions
                      .split('\n')
                      .map((line) => line.trim())
                      .filter(Boolean)
                : undefined,
            images: imageUrl ? [imageUrl] : undefined,
        });
        setIsCreating(false);
        if (created) {
            onResetForm();
            setSearchTerm(created.name);
        }
    };

    return (
        <>
            <Navbar />
            <main className="app-page exercises-page">
                <div className="app-page-container exercises-page-container">
                    <header className="app-page-header exercises-page-header">
                        <span className="app-page-eyebrow exercises-page-eyebrow">EXERCISES</span>

                        <h1 className="app-page-title">Exercises Catalog</h1>

                        <p className="app-page-subtitle">
                            Search for exercises and view their information to complete your
                            workout.
                        </p>
                    </header>
                    <section className="routine-create-card">
                        <div className="routine-create-header">
                            <div className="routine-create-icon">
                                <i className="fas fa-plus"></i>
                            </div>
                            <div>
                                <h2>New exercise</h2>
                                <p>Can't find an exercise? Add it to the catalog.</p>
                            </div>
                        </div>
                        <form onSubmit={onCreateExercise} className="routine-create-form">
                            <div className="routine-form-field">
                                <label htmlFor="name">Name</label>
                                <input
                                    id="name"
                                    type="text"
                                    className="routine-form-input"
                                    placeholder="Hip Thrust"
                                    name="name"
                                    value={name}
                                    onChange={onInputChange}
                                />
                            </div>
                            <div className="routine-form-field">
                                <label htmlFor="primaryMuscles">Primary Muscles</label>
                                <input
                                    id="primaryMuscles"
                                    type="text"
                                    className="routine-form-input"
                                    placeholder="Glutes, Hamstrings"
                                    name="primaryMuscles"
                                    value={primaryMuscles}
                                    onChange={onInputChange}
                                />
                            </div>
                            <div className="routine-form-field">
                                <label htmlFor="equipment">Equipment (optional)</label>
                                <input
                                    id="equipment"
                                    type="text"
                                    className="routine-form-input"
                                    placeholder="Smith Machine, Barbell, Dumbbell"
                                    name="equipment"
                                    value={equipment}
                                    onChange={onInputChange}
                                />
                            </div>
                            <div className="routine-form-field">
                                <label htmlFor="imageUrl">Image URL (optional)</label>
                                <input
                                    id="imageUrl"
                                    type="text"
                                    className="routine-form-input"
                                    placeholder="https://example.com/image.jpg"
                                    name="imageUrl"
                                    value={imageUrl}
                                    onChange={onInputChange}
                                />
                            </div>
                            <div className="routine-form-field" style={{ gridColumn: '1 / -1' }}>
                                <label htmlFor="instructions">Instructions (optional)</label>
                                <textarea
                                    id="instructions"
                                    className="routine-form-input"
                                    placeholder="Describe the exercise..."
                                    name="instructions"
                                    rows={3}
                                    value={instructions}
                                    onChange={onInputChange}
                                />
                            </div>
                            <button
                                className="routine-create-button"
                                type="submit"
                                disabled={isCreating}
                            >
                                <i className="fas fa-plus"></i>
                                {isCreating ? 'Creating...' : 'Create Exercise'}
                            </button>
                        </form>
                    </section>
                    <section className="exercises-search">
                        <div className="exercises-search-icon">
                            <i className="fas fa-search"></i>
                        </div>
                        <input
                            type="text"
                            placeholder="Search exercises..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {searchTerm && (
                            <button
                                type="button"
                                className="exercises-search-clear"
                                onClick={() => setSearchTerm('')}
                                aria-label="Clear search"
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        )}
                    </section>

                    {isLoading && (
                        <div className="exercises-page-loading">
                            <div className="exercises-loading-spinner"></div>

                            <span>Searching for exercises...</span>
                        </div>
                    )}

                    {!isLoading && searchTerm.trim().length === 0 && (
                        <div className="exercises-page-empty">
                            <div className="exercises-empty-icon">
                                <i className="fas fa-dumbbell"></i>
                            </div>

                            <h2>Search for an exercise</h2>

                            <p>Enter the name of an exercise to start exploring the catalog.</p>
                        </div>
                    )}

                    {!isLoading && searchTerm.trim().length > 0 && exercises.length === 0 && (
                        <div className="exercises-page-empty">
                            <div className="exercises-empty-icon">
                                <i className="fas fa-search"></i>
                            </div>
                            <h2>Exercises not found</h2>

                            <p>Try searching with a different name or search term.</p>
                        </div>
                    )}
                    {!isLoading && exercises.length > 0 && (
                        <section className="exercises-results">
                            <div className="exercises-results-header">
                                <span>RESULTS</span>
                                <p>
                                    {exercises.length}{' '}
                                    {exercises.length === 1 ? 'exercise' : 'exercises'}
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
