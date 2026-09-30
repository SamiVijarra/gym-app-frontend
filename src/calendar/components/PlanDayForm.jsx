import { useEffect, useState } from 'react';
import { useCalendarStore, useRoutinesStore } from '../../hooks';
import { Button } from '../../components/Button';
import { FormField } from '../../components/FormField';
import { Card } from '../../components/Card';

export const PlanDayForm = ({ date, onPlanned }) => {
    const { days, startLoadingRoutine } = useRoutinesStore();
    const { startPlanningDay, errorMessage } = useCalendarStore();

    const [routineDayId, setRoutineDayId] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hasFailed, setHasFailed] = useState(false);

    useEffect(() => {
        startLoadingRoutine();
    }, []);

    const onSubmit = async (event) => {
        event.preventDefault();
        if (!routineDayId) return;

        setIsSubmitting(true);
        setHasFailed(false);
        const success = await startPlanningDay({ date, routineDayId });
        setIsSubmitting(false);

        if (success) {
            onPlanned();
        } else {
            setHasFailed(true);
        }
    };

    return (
        <Card variant="surface">
            <form onSubmit={onSubmit} className="add-set-form-row mt-2">
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
                    disabled={!routineDayId || isSubmitting}
                >
                    {isSubmitting ? 'Planning...' : 'Plan this day'}
                </Button>
            </form>

            {hasFailed && errorMessage && <p className="field-error-text mt-2">{errorMessage}</p>}
        </Card>
    );
};
