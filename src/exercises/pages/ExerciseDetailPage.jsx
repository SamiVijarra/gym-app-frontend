import { useEffect, useMemo, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuthStore, useExercisesStore, useForm, useRoutinesStore } from '../../hooks';
import { Navbar } from '../../components/Navbar';

export const ExerciseDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const { selectedExercise, startLoadingExercise, startUpdatingExercise } = useExercisesStore();
    const { days, startAddingExercise, startCreatingDay, startLoadingRoutine } = useRoutinesStore();

    const [notes, setNotes] = useState('');
    const [mode, setMode] = useState('existing'); // 'existing' | 'new'
    const [selectedDayId, setSelectedDayId] = useState('');
    const [newDayNumber, setNewDayNumber] = useState('');
    const [newDayDescription, setNewDayDescription] = useState('');

    const [isEditing, setIsEditing] = useState(false);
    const [isSavingEdit, setIsSavingEdit] = useState(false);

    const editFieldsInitial = useMemo(
        () => ({
            name: selectedExercise?.name ?? '',
            primaryMuscles: selectedExercise?.primaryMuscles?.join(', ') ?? '',
            equipment: selectedExercise?.equipment ?? '',
            instructions: selectedExercise?.instructions?.join('\n') ?? '',
            imageUrl: selectedExercise?.images?.[0]?.url ?? '',
        }),
        [selectedExercise]
    );

    const {
        name: editName,
        primaryMuscles: editPrimaryMuscles,
        equipment: editEquipment,
        instructions: editInstructions,
        imageUrl: editImageUrl,
        onInputChange: onEditInputChange,
    } = useForm(editFieldsInitial);

    useEffect(() => {
        startLoadingExercise(id);
        startLoadingRoutine();
    }, [id]);

    const canEdit = selectedExercise?.createdBy?.id === user?.id;

    const onSaveEdit = async (event) => {
        event.preventDefault();
        setIsSavingEdit(true);
        const updated = await startUpdatingExercise(id, {
            name: editName,
            primaryMuscles: editPrimaryMuscles
                .split(',')
                .map((m) => m.trim())
                .filter(Boolean),
            equipment: editEquipment || undefined,
            instructions: editInstructions
                ? editInstructions
                      .split('\n')
                      .map((line) => line.trim())
                      .filter(Boolean)
                : undefined,
            images: editImageUrl ? [editImageUrl] : undefined,
        });
        setIsSavingEdit(false);
        if (updated) setIsEditing(false);
    };

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
                            <span>Loading exercise...</span>
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
                        Return to exercises
                    </Link>

                    <header className="exercise-detail-header">
                        <span className="exercise-detail-eyebrow">EXERCISE</span>

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

                        {canEdit && (
                            <button
                                type="button"
                                className="btn btn-sm btn-outline-secondary mt-2"
                                onClick={() => setIsEditing((current) => !current)}
                            >
                                <i className="fas fa-pen"></i>{' '}
                                {isEditing ? 'Cancel' : 'Edit exercise'}
                            </button>
                        )}
                    </header>

                    {isEditing ? (
                        <section className="routine-create-card">
                            <div className="routine-create-header">
                                <div className="routine-create-icon">
                                    <i className="fas fa-pen"></i>
                                </div>

                                <div>
                                    <h2>Edit exercise</h2>
                                    <p>Add or update the image and instructions any time.</p>
                                </div>
                            </div>

                            <form onSubmit={onSaveEdit} className="routine-create-form">
                                <div className="routine-form-field">
                                    <label htmlFor="edit-name">Name</label>
                                    <input
                                        id="edit-name"
                                        type="text"
                                        className="routine-form-input"
                                        name="name"
                                        value={editName}
                                        onChange={onEditInputChange}
                                    />
                                </div>

                                <div className="routine-form-field">
                                    <label htmlFor="edit-primaryMuscles">Primary Muscles</label>
                                    <input
                                        id="edit-primaryMuscles"
                                        type="text"
                                        className="routine-form-input"
                                        name="primaryMuscles"
                                        value={editPrimaryMuscles}
                                        onChange={onEditInputChange}
                                    />
                                </div>

                                <div className="routine-form-field">
                                    <label htmlFor="edit-equipment">Equipment (optional)</label>
                                    <input
                                        id="edit-equipment"
                                        type="text"
                                        className="routine-form-input"
                                        name="equipment"
                                        value={editEquipment}
                                        onChange={onEditInputChange}
                                    />
                                </div>

                                <div className="routine-form-field">
                                    <label htmlFor="edit-imageUrl">Image URL (optional)</label>
                                    <input
                                        id="edit-imageUrl"
                                        type="text"
                                        className="routine-form-input"
                                        placeholder="https://example.com/image.jpg"
                                        name="imageUrl"
                                        value={editImageUrl}
                                        onChange={onEditInputChange}
                                    />
                                </div>

                                <div
                                    className="routine-form-field"
                                    style={{ gridColumn: '1 / -1' }}
                                >
                                    <label htmlFor="edit-instructions">
                                        Instructions (optional)
                                    </label>
                                    <textarea
                                        id="edit-instructions"
                                        className="routine-form-input"
                                        placeholder="Describe the exercise..."
                                        name="instructions"
                                        rows={3}
                                        value={editInstructions}
                                        onChange={onEditInputChange}
                                    />
                                </div>

                                <button
                                    className="routine-create-button"
                                    type="submit"
                                    disabled={isSavingEdit}
                                >
                                    <i className="fas fa-check"></i>
                                    {isSavingEdit ? 'Saving...' : 'Save changes'}
                                </button>
                            </form>
                        </section>
                    ) : (
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
                                            Instructions
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
                    )}

                    <section className="exercise-add-card">
                        <div className="exercise-add-header">
                            <div className="exercise-add-icon">
                                <i className="fas fa-calendar-plus" />
                            </div>

                            <div>
                                <h2>Add to my routine</h2>
                                <p>Choose where you want to incorporate this exercise.</p>
                            </div>
                        </div>

                        <div className="exercise-add-field">
                            <label htmlFor="exercise-notes">Notes</label>

                            <input
                                id="exercise-notes"
                                type="text"
                                className="exercise-add-input"
                                placeholder="Optional notes for this exercise..."
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
                                Existing Day
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
                                Create New Day
                            </button>
                        </div>

                        {mode === 'existing' && (
                            <div className="exercise-add-row">
                                <select
                                    className="exercise-add-input"
                                    value={selectedDayId}
                                    onChange={(e) => setSelectedDayId(e.target.value)}
                                >
                                    <option value="">Choose a day...</option>

                                    {days.map((day) => (
                                        <option key={day.id} value={day.id}>
                                            Day {day.dayNumber} — {day.description}
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
                                    Add
                                </button>
                            </div>
                        )}

                        {mode === 'new' && (
                            <div className="exercise-add-row exercise-add-new-row">
                                <div className="exercise-day-number-field">
                                    <label htmlFor="new-day-number">Day</label>

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
                                    <label htmlFor="new-day-description">Description</label>

                                    <input
                                        id="new-day-description"
                                        type="text"
                                        className="exercise-add-input"
                                        placeholder="legs, chest, back..."
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
                                    Create and Add
                                </button>
                            </div>
                        )}
                    </section>
                </div>
            </main>
        </>
    );
};
