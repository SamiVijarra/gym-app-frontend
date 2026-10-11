import { useEffect, useState } from 'react';
import { useCalendarStore, useRoutinesStore } from '../../hooks';
import { ExercisePicker } from './ExercisePicker';
import { Button } from '../../components/Button';
import { FormField } from '../../components/FormField';
import { Card } from '../../components/Card';
import { ToggleGroup } from '../../components/ToggleGroup';
import { useTranslation } from 'react-i18next';

export const PlanDayForm = ({ date, onPlanned }) => {
    const { t } = useTranslation();
    const { days, startLoadingRoutine } = useRoutinesStore();
    const modeOptions = [
        { value: 'routine', label: t('calendar.modeRoutine') },
        { value: 'free', label: t('calendar.modeFree') },
    ];
    const { startPlanningDay, errorMessage } = useCalendarStore();

    const [mode, setMode] = useState('routine');
    const [routineDayId, setRoutineDayId] = useState('');
    const [selectedExercises, setSelectedExercises] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hasFailed, setHasFailed] = useState(false);

    useEffect(() => {
        startLoadingRoutine();
    }, [startLoadingRoutine]);

    const addExercise = (exercise) => {
        setSelectedExercises((current) =>
            current.some((item) => item.id === exercise.id) ? current : [...current, exercise]
        );
    };

    const removeExercise = (id) => {
        setSelectedExercises((current) => current.filter((item) => item.id !== id));
    };

    const onModeChange = (nextMode) => {
        setMode(nextMode);
        setHasFailed(false);
    };

    const canSubmit = mode === 'routine' ? !!routineDayId : selectedExercises.length > 0;

    const onSubmit = async (event) => {
        event.preventDefault();
        if (!canSubmit) return;

        setIsSubmitting(true);
        setHasFailed(false);

        const planDayDto =
            mode === 'routine'
                ? { date, routineDayId }
                : { date, exerciseIds: selectedExercises.map((exercise) => exercise.id) };

        const success = await startPlanningDay(planDayDto);
        setIsSubmitting(false);

        if (success) {
            setRoutineDayId('');
            setSelectedExercises([]);
            onPlanned();
        } else {
            setHasFailed(true);
        }
    };

    return (
        <Card variant="surface">
            <ToggleGroup options={modeOptions} value={mode} onChange={onModeChange} />

            <form
                onSubmit={onSubmit}
                className={mode === 'routine' ? 'add-set-form-row mt-2' : 'mt-2'}
            >
                {mode === 'routine' ? (
                    <>
                        <FormField
                            id="plan-day-routine"
                            label={t('calendar.modeRoutine')}
                            as="select"
                            value={routineDayId}
                            onChange={(e) => setRoutineDayId(e.target.value)}
                        >
                            <option value="">{t('calendar.selectDay')}</option>
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
                            type="submit"
                            variant="primary"
                            size="sm"
                            className="form-field-row-button"
                            disabled={!canSubmit || isSubmitting}
                        >
                            {isSubmitting ? t('calendar.planning') : t('calendar.planDay')}
                        </Button>
                    </>
                ) : (
                    <>
                        <ExercisePicker
                            idPrefix="plan-free"
                            onSelect={addExercise}
                            excludeIds={selectedExercises.map((exercise) => exercise.id)}
                        />

                        {selectedExercises.length > 0 && (
                            <ol className="list-group list-group-numbered mt-2">
                                {selectedExercises.map((exercise) => (
                                    <li
                                        key={exercise.id}
                                        className="list-group-item d-flex justify-content-between align-items-center"
                                    >
                                        <span>{exercise.name}</span>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => removeExercise(exercise.id)}
                                        >
                                            {t('common.remove')}
                                        </Button>
                                    </li>
                                ))}
                            </ol>
                        )}

                        <Button
                            type="submit"
                            variant="primary"
                            size="sm"
                            className="mt-3"
                            disabled={!canSubmit || isSubmitting}
                        >
                            {isSubmitting ? t('calendar.planning') : t('calendar.planFree')}
                        </Button>
                    </>
                )}
            </form>

            {hasFailed && errorMessage && <p className="field-error-text mt-2">{errorMessage}</p>}
        </Card>
    );
};
