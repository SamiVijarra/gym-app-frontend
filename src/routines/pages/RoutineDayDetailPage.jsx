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
        event.stopPropagation();

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
        return (
            <main className="routine-detail-page">
                <div className="routine-detail-container">
                    <p className="routine-detail-loading">Loading...</p>
                </div>
            </main>
        );
    }

    if (!day) {
        return (
            <main className="routine-detail-page">
                <div className="routine-detail-container">
                    <p className="routine-detail-loading">Day not found</p>
                </div>
            </main>
        );
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
                    <section className="routine-empty-state">
                        <div className="routine-empty-icon">+</div>

                        <h2>There are no exercises yet</h2>

                        <p>Add the first exercise to start building this day.</p>
                    </section>
                )}

                <div className="routine-exercises">
                    {day.exercises.map((routineExercise, index) => {
                        const isSelected = selectedExerciseId === routineExercise.id;

                        return (
                            <article key={routineExercise.id} className="routine-exercise-card">
                                <div
                                    className="routine-exercise-header routine-exercise-header-clickable"
                                    onClick={() => onToggleExercise(routineExercise.id)}
                                    role="button"
                                    tabIndex={0}
                                    aria-expanded={isSelected}
                                    onKeyDown={(event) => {
                                        if (event.key === 'Enter' || event.key === ' ') {
                                            event.preventDefault();
                                            onToggleExercise(routineExercise.id);
                                        }
                                    }}
                                >
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
                                            <p className="routine-exercise-notes">
                                                {routineExercise.notes}
                                            </p>
                                        )}
                                        <div className="routine-exercise-tag">
                                            {routineExercise.exercise.primaryMuscles?.map(
                                                (muscle) => (
                                                    <span key={muscle} className="routine-tag">
                                                        {muscle}
                                                    </span>
                                                )
                                            )}

                                            {routineExercise.exercise.equipment && (
                                                <span className="routine-tag routine-tag-muted">
                                                    {routineExercise.exercise.equipment}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div
                                        className="routine-exercise-actions"
                                        onClick={(event) => event.stopPropagation()}
                                    >
                                        <Button
                                            variant="danger"
                                            size="icon"
                                            onClick={(event) =>
                                                onDeleteExercise(event, routineExercise)
                                            }
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
                                    </div>

                                    <i
                                        className={
                                            isSelected
                                                ? 'fas fa-chevron-down routine-exercise-chevron routine-exercise-chevron-open'
                                                : 'fas fa-chevron-down routine-exercise-chevron'
                                        }
                                    ></i>
                                </div>

                                {isSelected && (
                                    <div className="routine-exercise-detail">
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
                                                    <span className="routine-section-label">
                                                        Series
                                                    </span>
                                                    <span className="routine-section-description">
                                                        Register your performance
                                                    </span>
                                                </div>
                                                <span className="routine-set-count">
                                                    {routineExercise.sets.length}
                                                    {''}
                                                    {routineExercise.sets.length === 1
                                                        ? 'set'
                                                        : 'sets'}
                                                </span>
                                            </div>
                                            <div className="routine-table-wrapper">
                                                <table className="routine-sets-table">
                                                    <thead>
                                                        <tr>
                                                            <th>Set</th>
                                                            <th>Weight</th>
                                                            <th>Reps</th>
                                                            <th>Rest</th>
                                                            <th>Notes</th>
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
                                                <div className="routine-add-set-title">Add Set</div>
                                                <AddSetForm
                                                    routineExerciseId={routineExercise.id}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </article>
                        );
                    })}
                </div>
            </div>
        </main>
    );
};
