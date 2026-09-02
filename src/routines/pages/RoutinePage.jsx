import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useForm, useRoutinesStore } from '../../hooks';
import { Navbar } from '../../components/Navbar';

const newDayFields = { dayNumber: '', description: '' };

export const RoutinePage = () => {
    const { days, isLoading, startLoadingRoutine, startCreatingDay, startRemovingDay } =
        useRoutinesStore();

    const { dayNumber, description, onInputChange, onResetForm } = useForm(newDayFields);

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
        <>
            <Navbar />
            <main className="app-page routine-page">
                <div className="app-page-container routine-page-container">
                    <header className="app-page-header routine-page-header">
                        <span className="app-page-eyebrow routine-page-eyebrow">TRAINING</span>

                        <h1 className="app-page-title">My routine</h1>

                        <p className="app-page-subtitle">
                            Organize your training days and keep all your progress in one place.
                        </p>
                    </header>
                    <section className="routine-create-card">
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
                            <div className="routine-form-field routine-form-day">
                                <label htmlFor="dayNumber">Day</label>

                                <input
                                    id="dayNumber"
                                    type="number"
                                    min="1"
                                    className="routine-form-input"
                                    placeholder="01"
                                    name="dayNumber"
                                    value={dayNumber}
                                    onChange={onInputChange}
                                />
                            </div>

                            <div className="routine-form-field">
                                <label htmlFor="description">Description</label>

                                <input
                                    id="description"
                                    type="text"
                                    className="routine-form-input"
                                    placeholder="Chest, shoulders and triceps"
                                    name="description"
                                    value={description}
                                    onChange={onInputChange}
                                />
                            </div>

                            <button className="routine-create-button" type="submit">
                                <i className="fas fa-plus"></i>
                                Create day
                            </button>
                        </form>
                    </section>

                    <section className="routine-days-section">
                        <div className="routine-days-header">
                            <div>
                                <span>MY ROUTINE</span>

                                <p>
                                    {days.length} {days.length === 1 ? 'day' : 'days'}
                                </p>
                            </div>
                        </div>

                        {isLoading && (
                            <div className="routine-page-loading">
                                <div className="routine-loading-spinner"></div>

                                <span>Loading routine...</span>
                            </div>
                        )}

                        {!isLoading && days.length === 0 && (
                            <div className="routine-page-empty">
                                <div className="routine-page-empty-icon">
                                    <i className="fas fa-calendar-plus"></i>
                                </div>

                                <h2>You don't have any days yet</h2>

                                <p>Create your first training day using the form above.</p>
                            </div>
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

                                            <strong>
                                                {String(day.dayNumber).padStart(2, '0')}
                                            </strong>
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

                                        <button
                                            type="button"
                                            className="routine-day-delete"
                                            onClick={(event) => onDeleteDay(event, day)}
                                            aria-label="Eliminar día"
                                        >
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </main>
        </>
    );
};
