import { useEffect, useMemo, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

import { useAuthStore, useExercisesStore, useForm, useRoutinesStore } from '../../hooks';
import { Button } from '../../components/Button';
import { ToggleGroup } from '../../components/ToggleGroup';
import { Breadcrumb } from '../../components/Breadcrumb';
import { Card } from '../../components/Card';
import { FormField } from '../../components/FormField';
import { PageHeader } from '../../components/PageHeader';
import { LoadingState } from '../../components/LoadingState';

export const ExerciseDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const {
        selectedExercise,
        startLoadingExercise,
        startUpdatingExercise,
        startDeletingExercise,
        errorMessage,
    } = useExercisesStore();
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

    const [touched, setTouched] = useState({ name: false, primaryMuscles: false });
    const onFieldBlur = (field) => setTouched((current) => ({ ...current, [field]: true }));
    const editNameError = touched.name && !editName;
    const editPrimaryMusclesError = touched.primaryMuscles && !editPrimaryMuscles;

    useEffect(() => {
        startLoadingExercise(id);
        startLoadingRoutine();
    }, [id]);

    const canEdit = selectedExercise?.createdBy?.id === user?.id;

    const onSaveEdit = async (event) => {
        event.preventDefault();
        if (!editName || !editPrimaryMuscles) return;
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

    const onDeleteExercise = async () => {
        const result = await Swal.fire({
            title: 'Delete exercise?',
            text: `"${selectedExercise.name}" will be permanently removed from the catalog.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete',
            cancelButtonText: 'Cancel',
        });

        if (result.isConfirmed) {
            const deleted = await startDeletingExercise(id);
            if (deleted) navigate('/exercises');
        }
    };

    if (!selectedExercise) {
        return <LoadingState label="Loading exercise..." />;
    }

    return (
        <main className="exercise-detail-page">
            <div className="exercise-detail-container">
                <Breadcrumb
                    items={[
                        { label: 'Home', to: '/' },
                        { label: 'Exercises', to: '/exercises' },
                        { label: selectedExercise.name },
                    ]}
                />

                <PageHeader
                    eyebrow="EXERCISE"
                    title={selectedExercise.name}
                    meta={[
                        selectedExercise.primaryMuscles?.length > 0
                            ? selectedExercise.primaryMuscles.join(', ')
                            : null,
                        selectedExercise.equipment || null,
                    ].filter(Boolean)}
                />

                {canEdit && (
                    <div className="d-flex gap-2 mt-2">
                        <Button
                            variant="secondary"
                            type="button"
                            onClick={() => setIsEditing((current) => !current)}
                        >
                            <i className="fas fa-pen"></i> {isEditing ? 'Cancel' : 'Edit exercise'}
                        </Button>

                        <Button variant="danger" type="button" onClick={onDeleteExercise}>
                            <i className="fas fa-trash"></i> Delete exercise
                        </Button>
                    </div>
                )}

                <Button as={Link} to={`/exercises/${id}/progress`} variant="secondary">
                    <i className="fas fa-chart-line"></i> View progress
                </Button>

                {isEditing ? (
                    <Card variant="surface">
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
                            <FormField
                                id="edit-name"
                                label="Name"
                                name="name"
                                value={editName}
                                onChange={onEditInputChange}
                                onBlur={() => onFieldBlur('name')}
                                error={editNameError ? 'Name is required.' : undefined}
                            />

                            <FormField
                                id="edit-primaryMuscles"
                                label="Primary Muscles"
                                name="primaryMuscles"
                                value={editPrimaryMuscles}
                                onChange={onEditInputChange}
                                onBlur={() => onFieldBlur('primaryMuscles')}
                                error={
                                    editPrimaryMusclesError
                                        ? 'Primary muscles is required.'
                                        : undefined
                                }
                            />

                            <FormField
                                id="edit-equipment"
                                label="Equipment (optional)"
                                name="equipment"
                                value={editEquipment}
                                onChange={onEditInputChange}
                            />

                            <FormField
                                id="edit-imageUrl"
                                label="Image URL (optional)"
                                placeholder="https://example.com/image.jpg"
                                name="imageUrl"
                                value={editImageUrl}
                                onChange={onEditInputChange}
                            />

                            <FormField
                                id="edit-instructions"
                                label="Instructions (optional)"
                                placeholder="Describe the exercise..."
                                name="instructions"
                                rows={3}
                                value={editInstructions}
                                onChange={onEditInputChange}
                            />

                            {errorMessage && (
                                <p className="text-danger" style={{ gridColumn: '1 / -1' }}>
                                    {errorMessage}
                                </p>
                            )}

                            <Button
                                type="submit"
                                variant="primary"
                                disabled={isSavingEdit || !editName || !editPrimaryMuscles}
                            >
                                <i className="fas fa-check"></i>
                                {isSavingEdit ? 'Saving...' : 'Save changes'}
                            </Button>
                        </form>
                    </Card>
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

                <Card variant="accent">
                    <div className="exercise-add-header">
                        <div className="exercise-add-icon">
                            <i className="fas fa-calendar-plus" />
                        </div>

                        <div>
                            <h2>Add to my routine</h2>
                            <p>Choose where you want to incorporate this exercise.</p>
                        </div>
                    </div>

                    <FormField
                        id="exercise-notes"
                        label="Notes"
                        placeholder="Optional notes for this exercise..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                    />

                    <ToggleGroup
                        options={[
                            {
                                value: 'existing',
                                label: 'Existing Day',
                                icon: <i className="fas fa-calendar-check" />,
                            },
                            {
                                value: 'new',
                                label: 'Create New Day',
                                icon: <i className="fas fa-plus" />,
                            },
                        ]}
                        value={mode}
                        onChange={setMode}
                    />

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

                            <Button
                                variant="primary"
                                disabled={!selectedDayId}
                                onClick={onAddToExistingDay}
                            >
                                <i className="fas fa-plus" />
                                Add
                            </Button>
                        </div>
                    )}

                    {mode === 'new' && (
                        <div className="exercise-add-row exercise-add-new-row">
                            <FormField
                                id="new-day-number"
                                label="Day"
                                placeholder="N°"
                                value={newDayNumber}
                                onChange={(e) => setNewDayNumber(e.target.value)}
                            />

                            <FormField
                                id="new-day-description"
                                label="Description"
                                placeholder="legs, chest, back..."
                                value={newDayDescription}
                                onChange={(e) => setNewDayDescription(e.target.value)}
                            />

                            <Button
                                variant="primary"
                                disabled={!newDayNumber || !newDayDescription}
                                onClick={onCreateDayAndAdd}
                            >
                                <i className="fas fa-plus" />
                                Create and Add
                            </Button>
                        </div>
                    )}
                </Card>
            </div>
        </main>
    );
};
