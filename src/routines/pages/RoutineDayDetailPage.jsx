import { useState } from 'react';
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

export const RoutineDayDetailPage = () => {
    const { dayId } = useParams();
    const { days, isLoading, startRemovingExercise } = useRoutinesStore();
    const [selectedExerciseId, setSelectedExerciseId] = useState(null);

    const day = days.find((d) => d.id === dayId);

    const onToggleExercise = (routineExerciseId) => {
        setSelectedExerciseId((current) =>
            current === routineExerciseId ? null : routineExerciseId
        );
    };

    const onDeleteExercise = async (event, routineExercise) => {
        const result = await Swal.fire({
            title: 'Delete exercise?',
            text: `"${routineExercise.exercise.name}" and all its sets will be permanently deleted from this day.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete',
            cancelButtonText: 'Cancel',
        });

        if (result.isConfirmed) {
            await startRemovingExercise(routineExercise.id);
            if (selectedExerciseId === routineExercise.id) setSelectedExerciseId(null);
        }
    };

    if (isLoading) {
        return <LoadingState label="Loading..." />;
    }

    if (!day) {
        return <LoadingState label="Day not found" />;
    }

    return (
        <main className="routine-detail-page">
            <div className="routine-detail-container">
                <Breadcrumb
                    items={[
                        { label: 'Home', to: '/' },
                        { label: 'Routine', to: '/routine' },
                        { label: day.description },
                    ]}
                />

                <PageHeader
                    eyebrow={`DAY ${day.dayNumber}`}
                    title={day.description}
                    meta={[
                        `${day.exercises.length} ${day.exercises.length === 1 ? 'exercise' : 'exercises'}`,
                        'Programmed routine',
                    ]}
                />

                <Card variant="accent" className="routine-add-exercise-spacing">
                    <div>
                        <span className="routine-section-label">EXERCISES</span>
                        <h2>Add Exercise</h2>
                        <p>Search and add exercises</p>
                    </div>
                    <AddExerciseForm dayId={day.id} />
                </Card>

                {day.exercises.length === 0 && (
                    <EmptyState
                        icon="fa-plus"
                        title="There are no exercises yet"
                        description="Add the first exercise to start building this day."
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
                                    label: m,
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
                                        aria-label="Delete exercise"
                                    >
                                        <i className="fas fa-trash"></i>
                                    </Button>
                                    <Button
                                        as={Link}
                                        to={`/exercises/${routineExercise.exercise.id}/progress`}
                                        variant="ghost"
                                        size="icon"
                                        aria-label="View progress"
                                        title="View progress"
                                    >
                                        <i className="fas fa-chart-line"></i>
                                    </Button>
                                </>
                            }
                        >
                            {routineExercise.exercise.instructions?.length > 0 && (
                                <details className="routine-instructions">
                                    <summary>View instructions</summary>
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
                                        <span className="routine-section-label">Series</span>
                                        <span className="routine-section-description">
                                            Register your performance
                                        </span>
                                    </div>
                                    <span className="routine-set-count">
                                        {routineExercise.sets.length}
                                        {''}
                                        {routineExercise.sets.length === 1 ? 'set' : 'sets'}
                                    </span>
                                </div>
                                <SetsTable columns={['Set', 'Weight', 'Reps', 'Rest', 'Notes', '']}>
                                    {routineExercise.sets.map((set) => (
                                        <SetRow key={set.id} set={set} />
                                    ))}
                                </SetsTable>
                                <div className="routine-add-set">
                                    <div className="routine-add-set-title">Add Set</div>
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
