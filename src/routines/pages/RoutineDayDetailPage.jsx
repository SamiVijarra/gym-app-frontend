import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useRoutinesStore } from '../../hooks';
import { AddExerciseForm } from '../components/AddExerciseForm';
import { AddSetForm } from '../components/AddSetForm';
import { SetRow } from '../components/SetRow';
import { Button } from '../../components/Button';
import { Breadcrumb } from '../../components/Breadcrumb';
import { Card } from '../../components/Card';
import { PageHeader } from '../../components/PageHeader';
import { SectionLabel } from '../../components/SectionLabel';
import { EmptyState } from '../../components/EmptyState';
import { LoadingState } from '../../components/LoadingState';
import { ExerciseCard } from '../../components/ExerciseCard';
import { SetsTable } from '../../components/SetsTable';
import { useTranslation } from 'react-i18next';
import { useMuscleLabels } from '../../i18n/muscles';

export const RoutineDayDetailPage = () => {
    const { t } = useTranslation();
    const { muscleLabel } = useMuscleLabels();
    const { dayId } = useParams();
    const { days, isLoading, startLoadingRoutine, startRemovingExercise } = useRoutinesStore();
    const [selectedExerciseId, setSelectedExerciseId] = useState(null);

    useEffect(() => {
        startLoadingRoutine();
    }, [startLoadingRoutine]);

    const day = days.find((d) => d.id === dayId);

    const onToggleExercise = (routineExerciseId) => {
        setSelectedExerciseId((current) =>
            current === routineExerciseId ? null : routineExerciseId
        );
    };

    const onDeleteExercise = async (routineExercise) => {
        const result = await Swal.fire({
            title: t('routine.deleteExerciseTitle'),
            text: t('routine.deleteExerciseText', { name: routineExercise.exercise.name }),
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: t('common.yesDelete'),
            cancelButtonText: t('common.cancel'),
        });

        if (result.isConfirmed) {
            await startRemovingExercise(routineExercise.id);
            if (selectedExerciseId === routineExercise.id) setSelectedExerciseId(null);
        }
    };

    if (isLoading) {
        return (
            <main className="routine-detail-page">
                <div className="routine-detail-container">
                    <LoadingState label={t('common.loading')} />
                </div>
            </main>
        );
    }

    if (!day) {
        return (
            <main className="routine-detail-page">
                <div className="routine-detail-container">
                    <LoadingState label={t('routine.dayNotFound')} />
                </div>
            </main>
        );
    }

    return (
        <main className="routine-detail-page">
            <div className="routine-detail-container">
                <Breadcrumb
                    items={[
                        { label: t('nav.home'), to: '/' },
                        { label: t('nav.routine'), to: '/routine' },
                        { label: day.description },
                    ]}
                />

                <PageHeader
                    eyebrow={t('routine.dayEyebrow', { number: day.dayNumber })}
                    title={day.description}
                    meta={[
                        t('counts.exercise', { count: day.exercises.length }),
                        t('routine.programmed'),
                    ]}
                />

                <Card variant="accent" className="routine-add-exercise-spacing">
                    <div className="routine-add-exercise-header">
                        <span className="routine-section-label">
                            {t('calendar.exercisesLabel')}
                        </span>
                        <h2>{t('routine.addExerciseTitle')}</h2>
                        <p>{t('routine.addExerciseText')}</p>
                    </div>
                    <AddExerciseForm dayId={day.id} />
                </Card>

                {day.exercises.length === 0 && (
                    <EmptyState
                        icon="fa-plus"
                        title={t('routine.noExercisesTitle')}
                        description={t('routine.noExercisesText')}
                    />
                )}

                <div className="routine-exercises">
                    {day.exercises.map((routineExercise, index) => (
                        <ExerciseCard
                            key={routineExercise.id}
                            number={index + 1}
                            image={routineExercise.exercise.images?.[0]?.url}
                            name={routineExercise.exercise.name}
                            notes={routineExercise.notes}
                            tags={[
                                ...(routineExercise.exercise.primaryMuscles ?? []).map((m) => ({
                                    label: muscleLabel(m),
                                })),
                                ...(routineExercise.exercise.equipment
                                    ? [{ label: routineExercise.exercise.equipment, muted: true }]
                                    : []),
                            ]}
                            collapsible
                            isOpen={selectedExerciseId === routineExercise.id}
                            onToggleOpen={() => onToggleExercise(routineExercise.id)}
                            actions={
                                <>
                                    <Button
                                        variant="danger"
                                        size="icon"
                                        onClick={() => onDeleteExercise(routineExercise)}
                                        aria-label={t('routine.deleteExerciseAria')}
                                    >
                                        <i className="fas fa-trash"></i>
                                    </Button>
                                    <Button
                                        as={Link}
                                        to={`/exercises/${routineExercise.exercise.id}/progress`}
                                        variant="ghost"
                                        size="icon"
                                        aria-label={t('common.viewProgress')}
                                        title={t('common.viewProgress')}
                                    >
                                        <i className="fas fa-chart-line"></i>
                                    </Button>
                                </>
                            }
                        >
                            {routineExercise.exercise.instructions?.length > 0 && (
                                <details className="routine-instructions">
                                    <summary>{t('routine.viewInstructions')}</summary>
                                    <ol>
                                        {routineExercise.exercise.instructions.map(
                                            (step, stepIndex) => (
                                                <li key={stepIndex}>{step}</li>
                                            )
                                        )}
                                    </ol>
                                </details>
                            )}
                            <div className="routine-sets-section">
                                <div className="routine-sets-header">
                                    <div>
                                        <span className="routine-section-label">
                                            {t('routine.series')}
                                        </span>
                                        <span className="routine-section-description">
                                            {t('routine.seriesText')}
                                        </span>
                                    </div>
                                    <span className="routine-set-count">
                                        {t('counts.set', { count: routineExercise.sets.length })}
                                    </span>
                                </div>
                                <SetsTable
                                    columns={[
                                        t('common.set'),
                                        t('common.weight'),
                                        t('common.reps'),
                                        t('common.rest'),
                                        t('common.notes'),
                                        '',
                                    ]}
                                >
                                    {routineExercise.sets.map((set) => (
                                        <SetRow key={set.id} set={set} />
                                    ))}
                                </SetsTable>
                                <div className="routine-add-set">
                                    <div className="routine-add-set-title">
                                        {t('routine.addSetTitle')}
                                    </div>
                                    <AddSetForm routineExerciseId={routineExercise.id} />
                                </div>
                            </div>
                        </ExerciseCard>
                    ))}
                </div>
            </div>
        </main>
    );
};
