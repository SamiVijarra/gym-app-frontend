import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useForm, useRoutinesStore } from '../../hooks';
import { Navbar } from '../../components/Navbar';

const newDayFields = { dayNumber: '', description: '' };

export const RoutinePage = () => {
    const { days, isLoading, startLoadingRoutine, startCreatingDay } = useRoutinesStore();

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

    return (
        <>
            <Navbar />
            <main className="app-page routine-page">
                <div className="app-page-container routine-page-container">
                    <header className="app-page-header routine-page-header">
                        <span className="app-page-eyebrow routine-page-eyebrow">TRAINING</span>

                        <h1 className="app-page-title">Mi rutina</h1>

                        <p className="app-page-subtitle">
                            Organizá tus días de entrenamiento y mantené todo tu progreso en un solo
                            lugar.
                        </p>
                    </header>
                    <section className="routine-create-card">
                        <div className="routine-create-header">
                            <div className="routine-create-icon">
                                <i className="fas fa-plus"></i>
                            </div>

                            <div>
                                <h2>Nuevo día</h2>

                                <p>Agregá un nuevo día a tu rutina.</p>
                            </div>
                        </div>

                        <form onSubmit={onCreateDay} className="routine-create-form">
                            <div className="routine-form-field routine-form-day">
                                <label htmlFor="dayNumber">Día</label>

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
                                <label htmlFor="description">Descripción</label>

                                <input
                                    id="description"
                                    type="text"
                                    className="routine-form-input"
                                    placeholder="Pecho, hombros y tríceps"
                                    name="description"
                                    value={description}
                                    onChange={onInputChange}
                                />
                            </div>

                            <button className="routine-create-button" type="submit">
                                <i className="fas fa-plus"></i>
                                Crear día
                            </button>
                        </form>
                    </section>

                    <section className="routine-days-section">
                        <div className="routine-days-header">
                            <div>
                                <span>TU RUTINA</span>

                                <p>
                                    {days.length} {days.length === 1 ? 'día' : 'días'}
                                </p>
                            </div>
                        </div>

                        {isLoading && (
                            <div className="routine-page-loading">
                                <div className="routine-loading-spinner"></div>

                                <span>Cargando rutina...</span>
                            </div>
                        )}

                        {!isLoading && days.length === 0 && (
                            <div className="routine-page-empty">
                                <div className="routine-page-empty-icon">
                                    <i className="fas fa-calendar-plus"></i>
                                </div>

                                <h2>Todavía no tenés días</h2>

                                <p>
                                    Creá tu primer día de entrenamiento usando el formulario de
                                    arriba.
                                </p>
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
                                            <span>DÍA</span>

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
                                                        ? 'ejercicio'
                                                        : 'ejercicios'}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="routine-day-arrow">→</div>
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
