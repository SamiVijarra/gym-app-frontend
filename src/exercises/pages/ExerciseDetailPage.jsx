import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useExercisesStore, useRoutinesStore } from '../../hooks';
import { Navbar } from '../../components/Navbar';

export const ExerciseDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { selectedExercise, startLoadingExercise } = useExercisesStore();
    const { days, startAddingExercise, startCreatingDay, startLoadingRoutine } = useRoutinesStore();

    const [notes, setNotes] = useState('');
    const [mode, setMode] = useState('existing'); // 'existing' | 'new'
    const [selectedDayId, setSelectedDayId] = useState('');
    const [newDayNumber, setNewDayNumber] = useState('');
    const [newDayDescription, setNewDayDescription] = useState('');

    useEffect(() => {
        startLoadingExercise(id);
        startLoadingRoutine();
    }, [id]);

    const onAddToExistingDay = async () => {
        if (!selectedDayId) return;
        await startAddingExercise(selectedDayId, { exerciseId: id, notes: notes || undefined });
        navigate(`/routine/${selectedDayId}`);
    };

    const onCreateDayAndAdd = async () => {
        if (!newDayNumber || !newDayDescription) return;
        const newDay = await startCreatingDay({
            dayNumber: Number(newDayNumber),
            description: newDayDescription,
        });
        if (!newDay) return;
        await startAddingExercise(newDay.id, { exerciseId: id, notes: notes || undefined });
        navigate(`/routine/${newDay.id}`);
    };

    if (!selectedExercise) {
        return (
            <>
                <Navbar />

                <main className="exercise-detail-page">
                    <div className="exercise-detail-container">
                        <div className="exercise-detail-loading">
                            <div className="exercise-detail-loading-spinner" />
                            <span>Cargando ejercicio...</span>
                        </div>
                    </div>
                </main>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <main className="exercise-detail-page">
                <div className="exercise-detail-container">
                    <Link to="/exercises" className="exercise-detail-back-link">
                        <span>←</span>
                        Volver a ejercicios
                    </Link>

                    <header className="exercise-detail-header">
                        <span className="exercise-detail-eyebrow">EJERCICIO</span>

                        <h1 className="exercise-detail-title">{selectedExercise.name}</h1>

                        <div className="exercise-detail-meta">
                            {selectedExercise.primaryMuscles?.length > 0 && (
                                <span>{selectedExercise.primaryMuscles.join(', ')}</span>
                            )}

                            {selectedExercise.equipment && (
                                <>
                                    <span className="exercise-detail-meta-dot">•</span>

                                    <span>{selectedExercise.equipment}</span>
                                </>
                            )}
                        </div>
                    </header>

                    <section className="exercise-detail-main">
                        <div className="exercise-detail-image">
                            {selectedExercise.images?.[0] ? (
                                <img
                                    src={selectedExercise.images[0].url}
                                    alt={selectedExercise.name}
                                />
                            ) : (
                                <div className="exercise-detail-image-placeholder">
                                    <i className="fas fa-dumbbell" />
                                </div>
                            )}
                        </div>

                        {selectedExercise.instructions?.length > 0 && (
                            <details className="exercise-detail-instructions">
                                <summary>
                                    <span>
                                        <i className="fas fa-list-ol" />
                                        Instrucciones
                                    </span>

                                    <span className="exercise-detail-summary-arrow">+</span>
                                </summary>

                                <ol>
                                    {selectedExercise.instructions.map((step, index) => (
                                        <li key={index}>{step}</li>
                                    ))}
                                </ol>
                            </details>
                        )}
                    </section>

                    <section className="exercise-add-card">
                        <div className="exercise-add-header">
                            <div className="exercise-add-icon">
                                <i className="fas fa-calendar-plus" />
                            </div>

                            <div>
                                <h2>Agregar a mi rutina</h2>
                                <p>Elegí dónde querés incorporar este ejercicio.</p>
                            </div>
                        </div>

                        <div className="exercise-add-field">
                            <label htmlFor="exercise-notes">Notas</label>

                            <input
                                id="exercise-notes"
                                type="text"
                                className="exercise-add-input"
                                placeholder="Ej. con mancuernas"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                            />
                        </div>

                        <div className="exercise-mode-switch">
                            <button
                                type="button"
                                className={
                                    mode === 'existing'
                                        ? 'exercise-mode-button active'
                                        : 'exercise-mode-button'
                                }
                                onClick={() => setMode('existing')}
                            >
                                <i className="fas fa-calendar-check" />
                                Día existente
                            </button>

                            <button
                                type="button"
                                className={
                                    mode === 'new'
                                        ? 'exercise-mode-button active'
                                        : 'exercise-mode-button'
                                }
                                onClick={() => setMode('new')}
                            >
                                <i className="fas fa-plus" />
                                Crear día nuevo
                            </button>
                        </div>

                        {mode === 'existing' && (
                            <div className="exercise-add-row">
                                <select
                                    className="exercise-add-input"
                                    value={selectedDayId}
                                    onChange={(e) => setSelectedDayId(e.target.value)}
                                >
                                    <option value="">Elegí un día...</option>

                                    {days.map((day) => (
                                        <option key={day.id} value={day.id}>
                                            Día {day.dayNumber} — {day.description}
                                        </option>
                                    ))}
                                </select>

                                <button
                                    type="button"
                                    className="exercise-add-button"
                                    disabled={!selectedDayId}
                                    onClick={onAddToExistingDay}
                                >
                                    <i className="fas fa-plus" />
                                    Agregar
                                </button>
                            </div>
                        )}

                        {mode === 'new' && (
                            <div className="exercise-add-row exercise-add-new-row">
                                <div className="exercise-day-number-field">
                                    <label htmlFor="new-day-number">Día</label>

                                    <input
                                        id="new-day-number"
                                        type="number"
                                        className="exercise-add-input"
                                        placeholder="N°"
                                        value={newDayNumber}
                                        onChange={(e) => setNewDayNumber(e.target.value)}
                                    />
                                </div>

                                <div className="exercise-day-description-field">
                                    <label htmlFor="new-day-description">Descripción</label>

                                    <input
                                        id="new-day-description"
                                        type="text"
                                        className="exercise-add-input"
                                        placeholder="Ej. Pecho y tríceps"
                                        value={newDayDescription}
                                        onChange={(e) => setNewDayDescription(e.target.value)}
                                    />
                                </div>

                                <button
                                    type="button"
                                    className="exercise-add-button"
                                    disabled={!newDayNumber || !newDayDescription}
                                    onClick={onCreateDayAndAdd}
                                >
                                    <i className="fas fa-plus" />
                                    Crear y agregar
                                </button>
                            </div>
                        )}
                    </section>
                </div>
            </main>
        </>
    );
};
