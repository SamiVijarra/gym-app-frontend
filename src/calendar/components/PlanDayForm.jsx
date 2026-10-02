import { useEffect, useState } from 'react';
import { useCalendarStore, useExercisesStore, useRoutinesStore } from '../../hooks';
import { Button } from '../../components/Button';
import { FormField } from '../../components/FormField';
import { Card } from '../../components/Card';
import { ToggleGroup } from '../../components/ToggleGroup';

const MODE_OPTIONS = [
    { value: 'routine', label: 'Routine day' },
    { value: 'free', label: 'Free session' },
];

export const PlanDayForm = ({ date, onPlanned }) => {
    const { days, startLoadingRoutine } = useRoutinesStore();
    const { exercises: searchResults, startSearchingExercises } = useExercisesStore();
    const { startPlanningDay, errorMessage } = useCalendarStore();

    const [mode, setMode] = useState('routine');
    const [routineDayId, setRoutineDayId] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedExercises, setSelectedExercises] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hasFailed, setHasFailed] = useState(false);

    useEffect(() => {
        startLoadingRoutine();
    }, []);

    useEffect(() => {
        if (searchTerm.trim().length === 0) return;
        const timeoutId = setTimeout(() => {
            startSearchingExercises({ name: searchTerm });
        }, 400);
        return () => clearTimeout(timeoutId);
    }, [searchTerm]);

    const addExercise = (exercise) => {
        setSelectedExercises((current) =>
            current.some((item) => item.id === exercise.id) ? current : [...current, exercise]
        );
        setSearchTerm('');
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

    const availableResults = searchResults.filter(
        (exercise) => !selectedExercises.some((item) => item.id === exercise.id)
    );

    return (
        <Card variant="surface">
            <ToggleGroup options={MODE_OPTIONS} value={mode} onChange={onModeChange} />

            <form
                onSubmit={onSubmit}
                className={mode === 'routine' ? 'add-set-form-row mt-2' : 'mt-2'}
            >
                {mode === 'routine' ? (
                    <>
                        <FormField
                            id="plan-day-routine"
                            label="Routine day"
                            as="select"
                            value={routineDayId}
                            onChange={(e) => setRoutineDayId(e.target.value)}
                        >
                            <option value="">Select a day...</option>
                            {days.map((day) => (
                                <option key={day.id} value={day.id}>
                                    Day {day.dayNumber} — {day.description}
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
                            {isSubmitting ? 'Planning...' : 'Plan this day'}
                        </Button>
                    </>
                ) : (
                    <>
                        <FormField
                            id="plan-free-search"
                            label="Add exercises"
                            placeholder="Search exercise to add..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />

                        {searchTerm.trim().length > 0 && (
                            <ul className="list-group mt-2">
                                {availableResults.map((exercise) => (
                                    <li
                                        key={exercise.id}
                                        className="list-group-item list-group-item-action"
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => addExercise(exercise)}
                                    >
                                        <strong>{exercise.name}</strong>
                                        <div className="text-muted small">
                                            {exercise.primaryMuscles?.join(', ')}
                                            {exercise.equipment ? ` — ${exercise.equipment}` : ''}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}

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
                                            Remove
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
                            {isSubmitting ? 'Planning...' : 'Plan free session'}
                        </Button>
                    </>
                )}
            </form>

            {hasFailed && errorMessage && <p className="field-error-text mt-2">{errorMessage}</p>}
        </Card>
    );
};
