import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useForm, useRoutinesStore } from '../../hooks';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { FormField } from '../../components/FormField';
import { PageHeader } from '../../components/PageHeader';
import { SectionLabel } from '../../components/SectionLabel';
import { EmptyState } from '../../components/EmptyState';

const newDayFields = { dayNumber: '', description: '' };

export const RoutinePage = () => {
    const { days, isLoading, startLoadingRoutine, startCreatingDay, startRemovingDay } =
        useRoutinesStore();

    const { dayNumber, description, onInputChange, onResetForm } = useForm(newDayFields);

    const [touched, setTouched] = useState({ dayNumber: false, description: false });
    const onFieldBlur = (field) => setTouched((current) => ({ ...current, [field]: true }));
    const dayNumberError = touched.dayNumber && !dayNumber;
    const descriptionError = touched.description && !description;

    useEffect(() => {
        startLoadingRoutine();
    }, []);

    const onCreateDay = async (event) => {
        event.preventDefault();
        if (!dayNumber || !description) return;
        await startCreatingDay({ dayNumber: Number(dayNumber), description });
        onResetForm();
    };

    const onDeleteDay = async (event, day) => {
        event.preventDefault();
        event.stopPropagation();

        const result = await Swal.fire({
            title: 'Delete day?',
            text: `"${day.description}" and all its exercises will be permanently deleted.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, deleted',
            cancelButtonText: 'Cancel',
        });

        if (result.isConfirmed) {
            await startRemovingDay(day.id);
        }
    };

    return (
        <main className="app-page routine-page">
            <div className="app-page-container routine-page-container">
                <PageHeader
                    eyebrow="TRAINING"
                    title="My routine"
                    subtitle="Organize your training days and keep all your progress in one place."
                />

                <Card variant="surface">
                    <div className="routine-create-header">
                        <div className="routine-create-icon">
                            <i className="fas fa-plus"></i>
                        </div>

                        <div>
                            <h2>New day</h2>

                            <p>Add a new day to your routine.</p>
                        </div>
                    </div>

                    <form onSubmit={onCreateDay} className="routine-create-form">
                        <FormField
                            id="dayNumber"
                            label="Day"
                            min="1"
                            placeholder="01"
                            name="dayNumber"
                            value={dayNumber}
                            onChange={onInputChange}
                            onBlur={() => onFieldBlur('dayNumber')}
                            error={dayNumberError ? 'Day number is required.' : undefined}
                        />

                        <FormField
                            id="description"
                            label="Description"
                            placeholder="Chest, shoulders and triceps"
                            name="description"
                            value={description}
                            onChange={onInputChange}
                            onBlur={() => onFieldBlur('description')}
                            error={descriptionError ? 'Description is required.' : undefined}
                        />

                        <Button
                            type="submit"
                            variant="primary"
                            disabled={!dayNumber || !description}
                        >
                            <i className="fas fa-plus"></i>
                            Create day
                        </Button>
                    </form>
                </Card>

                <section className="routine-days-section">
                    <SectionLabel meta={`${days.length} ${days.length === 1 ? 'day' : 'days'}`}>
                        MY ROUTINE
                    </SectionLabel>

                    {isLoading && (
                        <div className="routine-page-loading">
                            <div className="routine-loading-spinner"></div>

                            <span>Loading routine...</span>
                        </div>
                    )}

                    {!isLoading && days.length === 0 && (
                        <EmptyState
                            icon="fa-calendar-plus"
                            title="You don't have any days yet"
                            description="Create your first training day using the form above."
                        />
                    )}

                    {!isLoading && days.length > 0 && (
                        <div className="routine-days-list">
                            {days.map((day) => (
                                <Link
                                    key={day.id}
                                    to={`/routine/${day.id}`}
                                    className="routine-day-card"
                                >
                                    <div className="routine-day-number">
                                        <span>DAY</span>

                                        <strong>{String(day.dayNumber).padStart(2, '0')}</strong>
                                    </div>

                                    <div className="routine-day-info">
                                        <h2>{day.description}</h2>

                                        <div className="routine-day-meta">
                                            <span>
                                                <i className="fas fa-dumbbell"></i>
                                                {day.exercises.length}{' '}
                                                {day.exercises.length === 1
                                                    ? 'exercise'
                                                    : 'exercises'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="routine-day-arrow">→</div>

                                    <Button
                                        variant="danger"
                                        size="icon"
                                        onClick={(event) => onDeleteDay(event, day)}
                                        aria-label="Delete day"
                                    >
                                        <i className="fas fa-trash"></i>
                                    </Button>
                                </Link>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
};
