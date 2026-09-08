import { useEffect, useState } from 'react';
import { useCalendarStore, useRoutinesStore } from '../../hooks';
import { Button } from '../../components/Button';

export const PlanDayForm = ({ date, onPlanned }) => {
    const { days, startLoadingRoutine } = useRoutinesStore();
    const { startPlanningDay } = useCalendarStore();

    const [routineDayId, setRoutineDayId] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        startLoadingRoutine();
    }, []);

    const onSubmit = async (event) => {
        event.preventDefault();
        if (!routineDayId) return;

        setIsSubmitting(true);
        const success = await startPlanningDay({ date, routineDayId });
        setIsSubmitting(false);

        if (success) onPlanned();
    };

    return (
        <form onSubmit={onSubmit} className="add-set-form-row mt-2">
            <div className="routine-form-field" style={{ minWidth: '220px' }}>
                <label htmlFor="plan-day-routine">Routine day</label>
                <select
                    id="plan-day-routine"
                    className="routine-form-input"
                    value={routineDayId}
                    onChange={(e) => setRoutineDayId(e.target.value)}
                >
                    <option value="">Select a day...</option>
                    {days.map((day) => (
                        <option key={day.id} value={day.id}>
                            Day {day.dayNumber} — {day.description}
                        </option>
                    ))}
                </select>
            </div>

            <Button
                type="submit"
                variant="primary"
                size="sm"
                disabled={!routineDayId || isSubmitting}
            >
                {isSubmitting ? 'Planning...' : 'Plan this day'}
            </Button>
        </form>
    );
};
