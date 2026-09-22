import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { useExercisesStore, useForm } from '../../hooks';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { FormField } from '../../components/FormField';

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

    const [touched, setTouched] = useState({ name: false, primaryMuscles: false });

    const onFieldBlur = (field) => setTouched((current) => ({ ...current, [field]: true }));

    const nameError = touched.name && !name;
    const primaryMusclesError = touched.primaryMuscles && !primaryMuscles;

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
        <main className="app-page exercises-page">
            <div className="app-page-container exercises-page-container">
                <header className="app-page-header exercises-page-header">
                    <span className="app-page-eyebrow exercises-page-eyebrow">EXERCISES</span>

                    <h1 className="app-page-title">Exercises Catalog</h1>

                    <p className="app-page-subtitle">
                        Search for exercises and view their information to complete your workout.
                    </p>
                </header>
                <Card variant="surface">
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
                        <FormField
                            id="name"
                            label="Name"
                            placeholder="Hip Thrust"
                            name="name"
                            value={name}
                            onChange={onInputChange}
                            onBlur={() => onFieldBlur('name')}
                            error={nameError ? 'Name is required.' : undefined}
                        />

                        <FormField
                            id="primaryMuscles"
                            label="Primary Muscles"
                            placeholder="Glutes, Hamstrings"
                            name="primaryMuscles"
                            value={primaryMuscles}
                            onChange={onInputChange}
                            onBlur={() => onFieldBlur('primaryMuscles')}
                            error={primaryMusclesError ? 'Primary muscles is required.' : undefined}
                        />

                        <FormField
                            id="equipment"
                            label="Equipment"
                            placeholder="Smith Machine, Barbell, Dumbbell"
                            name="equipment"
                            value={equipment}
                            onChange={onInputChange}
                        />

                        <FormField
                            id="imageUrl"
                            label="ImageUrl"
                            placeholder="https://example.com/image.jpg"
                            name="imageUrl"
                            value={imageUrl}
                            onChange={onInputChange}
                        />

                        <FormField
                            id="instructions"
                            label="Instructions"
                            placeholder="Describe the exercise..."
                            name="instructions"
                            rows={3}
                            value={instructions}
                            onChange={onInputChange}
                        />

                        <Button
                            variant="primary"
                            type="submit"
                            disabled={isCreating || !name || !primaryMuscles}
                        >
                            <i className="fas fa-plus"></i>
                            {isCreating ? 'Creating...' : 'Create Exercise'}
                        </Button>
                    </form>
                </Card>
                <section className="exercises-search-section">
                    <div className="exercises-search-header">
                        <span>SEARCH</span>
                    </div>

                    <div className="exercises-search">
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
                            <Button
                                variant="secondary"
                                size="icon"
                                onClick={() => setSearchTerm('')}
                                aria-label="Clear search"
                            >
                                <i className="fas fa-times"></i>
                            </Button>
                        )}
                    </div>
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
                                            <img src={exercise.images[0].url} alt={exercise.name} />
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
    );
};
