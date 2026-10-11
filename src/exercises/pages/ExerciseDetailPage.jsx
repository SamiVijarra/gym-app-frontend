import { useEffect, useMemo, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

import { useAuthStore, useExercisesStore, useForm, useRoutinesStore } from '../../hooks';
import { Button } from '../../components/Button';
import { ToggleGroup } from '../../components/ToggleGroup';
import { Breadcrumb } from '../../components/Breadcrumb';
import { Card } from '../../components/Card';
import { FormField } from '../../components/FormField';
import { MuscleSelect } from '../../components/MuscleSelect';
import { PageHeader } from '../../components/PageHeader';
import { LoadingState } from '../../components/LoadingState';
import { toKnownMuscle } from '../../calendar/muscleGroups';
import { useTranslation } from 'react-i18next';
import { useMuscleLabels } from '../../i18n/muscles';

export const ExerciseDetailPage = () => {
    const { t } = useTranslation();
    const { muscleLabel } = useMuscleLabels();
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
            primaryMuscles: toKnownMuscle(selectedExercise?.primaryMuscles?.[0]),
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
    }, [id, startLoadingExercise, startLoadingRoutine]);

    const canEdit = selectedExercise?.createdBy?.id === user?.id;

    const onSaveEdit = async (event) => {
        event.preventDefault();
        if (!editName || !editPrimaryMuscles) return;
        setIsSavingEdit(true);
        const updated = await startUpdatingExercise(id, {
            name: editName,
            primaryMuscles: [editPrimaryMuscles],
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
            title: t('exercises.deleteTitle'),
            text: t('exercises.deleteText', { name: selectedExercise.name }),
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: t('common.yesDelete'),
            cancelButtonText: t('common.cancel'),
        });

        if (result.isConfirmed) {
            const { ok, message } = await startDeletingExercise(id);
            if (ok) {
                navigate('/exercises');
            } else {
                Swal.fire(t('exercises.deleteFailed'), message, 'error');
            }
        }
    };

    if (!selectedExercise) {
        return (
            <main className="exercise-detail-page">
                <div className="exercise-detail-container">
                    <LoadingState label={t('exercises.loadingOne')} />
                </div>
            </main>
        );
    }

    return (
        <main className="exercise-detail-page">
            <div className="exercise-detail-container">
                <Breadcrumb
                    items={[
                        { label: t('nav.home'), to: '/' },
                        { label: t('nav.exercises'), to: '/exercises' },
                        { label: selectedExercise.name },
                    ]}
                />

                <PageHeader
                    eyebrow={t('exercises.detailEyebrow')}
                    title={selectedExercise.name}
                    meta={[
                        selectedExercise.primaryMuscles?.length > 0
                            ? selectedExercise.primaryMuscles.map(muscleLabel).join(', ')
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
                            <i className="fas fa-pen"></i>{' '}
                            {isEditing ? t('common.cancel') : t('exercises.edit')}
                        </Button>

                        <Button variant="danger" type="button" onClick={onDeleteExercise}>
                            <i className="fas fa-trash"></i> {t('exercises.delete')}
                        </Button>
                    </div>
                )}

                <Button as={Link} to={`/exercises/${id}/progress`} variant="secondary">
                    <i className="fas fa-chart-line"></i> {t('common.viewProgress')}
                </Button>

                {isEditing ? (
                    <Card variant="surface">
                        <div className="routine-create-header">
                            <div className="routine-create-icon">
                                <i className="fas fa-pen"></i>
                            </div>
                            <div>
                                <h2>{t('exercises.editTitle')}</h2>
                                <p>{t('exercises.editText')}</p>
                            </div>
                        </div>

                        <form onSubmit={onSaveEdit} className="routine-create-form">
                            <FormField
                                id="edit-name"
                                label={t('exercises.name')}
                                name="name"
                                value={editName}
                                onChange={onEditInputChange}
                                onBlur={() => onFieldBlur('name')}
                                error={editNameError ? t('exercises.nameRequired') : undefined}
                            />

                            <MuscleSelect
                                id="edit-primaryMuscles"
                                name="primaryMuscles"
                                value={editPrimaryMuscles}
                                onChange={onEditInputChange}
                                onBlur={() => onFieldBlur('primaryMuscles')}
                                error={
                                    editPrimaryMusclesError
                                        ? t('exercises.muscleRequired')
                                        : undefined
                                }
                            />

                            <FormField
                                id="edit-equipment"
                                label={t('exercises.equipmentOptional')}
                                name="equipment"
                                value={editEquipment}
                                onChange={onEditInputChange}
                            />

                            <FormField
                                id="edit-imageUrl"
                                label={t('exercises.imageUrlOptional')}
                                placeholder={t('exercises.imageUrlPlaceholder')}
                                name="imageUrl"
                                value={editImageUrl}
                                onChange={onEditInputChange}
                            />

                            <FormField
                                id="edit-instructions"
                                label={t('exercises.instructionsOptional')}
                                placeholder={t('exercises.instructionsPlaceholder')}
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
                                {isSavingEdit ? t('common.saving') : t('exercises.saveChanges')}
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
                                        {t('exercises.instructions')}
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
                            <h2>{t('exercises.addTitle')}</h2>
                            <p>{t('exercises.addText')}</p>
                        </div>
                    </div>

                    <FormField
                        id="exercise-notes"
                        label={t('exercises.notesLabel')}
                        placeholder={t('exercises.notesPlaceholder')}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                    />

                    <ToggleGroup
                        options={[
                            {
                                value: 'existing',
                                label: t('exercises.existingDay'),
                                icon: <i className="fas fa-calendar-check" />,
                            },
                            {
                                value: 'new',
                                label: t('exercises.newDay'),
                                icon: <i className="fas fa-plus" />,
                            },
                        ]}
                        value={mode}
                        onChange={setMode}
                    />

                    {mode === 'existing' && (
                        <div className="exercise-add-row">
                            <FormField
                                id="exercise-day"
                                label={t('exercises.existingDay')}
                                as="select"
                                value={selectedDayId}
                                onChange={(e) => setSelectedDayId(e.target.value)}
                            >
                                <option value="">{t('exercises.chooseDay')}</option>

                                {days.map((day) => (
                                    <option key={day.id} value={day.id}>
                                        {t('common.dayWithDescription', {
                                            number: day.dayNumber,
                                            description: day.description,
                                        })}
                                    </option>
                                ))}
                            </FormField>

                            <Button
                                variant="primary"
                                className="form-field-row-button"
                                disabled={!selectedDayId}
                                onClick={onAddToExistingDay}
                            >
                                <i className="fas fa-plus" />
                                {t('common.add')}
                            </Button>
                        </div>
                    )}

                    {mode === 'new' && (
                        <div className="exercise-add-row exercise-add-new-row">
                            <FormField
                                id="new-day-number"
                                label={t('exercises.dayLabel')}
                                placeholder={t('exercises.dayPlaceholder')}
                                className="exercise-day-number-field"
                                value={newDayNumber}
                                onChange={(e) => setNewDayNumber(e.target.value)}
                            />

                            <FormField
                                id="new-day-description"
                                label={t('exercises.descriptionLabel')}
                                placeholder={t('exercises.descriptionPlaceholder')}
                                className="exercise-day-description-field"
                                value={newDayDescription}
                                onChange={(e) => setNewDayDescription(e.target.value)}
                            />
                            <Button
                                variant="primary"
                                className="form-field-row-button"
                                disabled={!newDayNumber || !newDayDescription}
                                onClick={onCreateDayAndAdd}
                            >
                                <i className="fas fa-plus" />
                                {t('exercises.createAndAdd')}
                            </Button>
                        </div>
                    )}
                </Card>
            </div>
        </main>
    );
};
