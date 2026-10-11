import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { useExercisesStore, useForm } from '../../hooks';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { FormField } from '../../components/FormField';
import { MuscleSelect } from '../../components/MuscleSelect';
import { PageHeader } from '../../components/PageHeader';
import { SectionLabel } from '../../components/SectionLabel';
import { EmptyState } from '../../components/EmptyState';
import { LoadingState } from '../../components/LoadingState';
import { useTranslation } from 'react-i18next';
import { useMuscleLabels } from '../../i18n/muscles';

const newExerciseFields = {
    name: '',
    primaryMuscles: '',
    equipment: '',
    instructions: '',
    imageUrl: '',
};

export const ExercisesPage = () => {
    const { t } = useTranslation();
    const { muscleLabel } = useMuscleLabels();
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
    }, [searchTerm, startSearchingExercises]);

    const onCreateExercise = async (event) => {
        event.preventDefault();
        if (!name || !primaryMuscles) return;

        setIsCreating(true);
        const created = await startCreatingExercise({
            name,
            primaryMuscles: [primaryMuscles],
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
                <PageHeader
                    eyebrow={t('exercises.eyebrow')}
                    title={t('exercises.title')}
                    subtitle={t('exercises.subtitle')}
                />
                <Card variant="surface">
                    <div className="routine-create-header">
                        <div className="routine-create-icon">
                            <i className="fas fa-plus"></i>
                        </div>
                        <div>
                            <h2>{t('exercises.newTitle')}</h2>

                            <p>{t('exercises.newText')}</p>
                        </div>
                    </div>
                    <form onSubmit={onCreateExercise} className="routine-create-form">
                        <FormField
                            id="name"
                            label={t('exercises.name')}
                            placeholder={t('exercises.namePlaceholder')}
                            name="name"
                            value={name}
                            onChange={onInputChange}
                            onBlur={() => onFieldBlur('name')}
                            error={nameError ? t('exercises.nameRequired') : undefined}
                        />

                        <MuscleSelect
                            id="primaryMuscles"
                            name="primaryMuscles"
                            value={primaryMuscles}
                            onChange={onInputChange}
                            onBlur={() => onFieldBlur('primaryMuscles')}
                            error={primaryMusclesError ? t('exercises.muscleRequired') : undefined}
                        />

                        <FormField
                            id="equipment"
                            label={t('exercises.equipment')}
                            placeholder={t('exercises.equipmentPlaceholder')}
                            name="equipment"
                            value={equipment}
                            onChange={onInputChange}
                        />

                        <FormField
                            id="imageUrl"
                            label={t('exercises.imageUrl')}
                            placeholder={t('exercises.imageUrlPlaceholder')}
                            name="imageUrl"
                            value={imageUrl}
                            onChange={onInputChange}
                        />

                        <FormField
                            id="instructions"
                            label={t('exercises.instructions')}
                            placeholder={t('exercises.instructionsPlaceholder')}
                            name="instructions"
                            rows={3}
                            value={instructions}
                            onChange={onInputChange}
                        />
                    </form>
                    <Button
                        variant="primary"
                        type="submit"
                        disabled={isCreating || !name || !primaryMuscles}
                    >
                        <i className="fas fa-plus"></i>
                        {isCreating ? t('exercises.creating') : t('exercises.create')}
                    </Button>
                </Card>
                <section className="exercises-search-section">
                    <SectionLabel>{t('exercises.searchSection')}</SectionLabel>

                    <div className="exercises-search">
                        <div className="exercises-search-icon">
                            <i className="fas fa-search"></i>
                        </div>
                        <input
                            type="text"
                            placeholder={t('exercises.searchPlaceholder')}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {searchTerm && (
                            <Button
                                variant="secondary"
                                size="icon"
                                onClick={() => setSearchTerm('')}
                                aria-label={t('exercises.clearSearch')}
                            >
                                <i className="fas fa-times"></i>
                            </Button>
                        )}
                    </div>
                </section>

                {isLoading && <LoadingState label={t('exercises.searching')} />}

                {!isLoading && searchTerm.trim().length === 0 && (
                    <EmptyState
                        icon="fa-dumbbell"
                        title={t('exercises.emptyTitle')}
                        description={t('exercises.emptyText')}
                    />
                )}

                {!isLoading && searchTerm.trim().length > 0 && exercises.length === 0 && (
                    <EmptyState
                        icon="fa-search"
                        title={t('exercises.notFoundTitle')}
                        description={t('exercises.notFoundText')}
                    />
                )}
                {!isLoading && exercises.length > 0 && (
                    <section className="exercises-results">
                        <SectionLabel
                            meta={t('exercises.resultsCount', { count: exercises.length })}
                        >
                            {t('exercises.resultsSection')}
                        </SectionLabel>
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
                                                <p>
                                                    {exercise.primaryMuscles
                                                        .map(muscleLabel)
                                                        .join(' · ')}
                                                </p>
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
