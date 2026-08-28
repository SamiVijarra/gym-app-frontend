import { useEffect, useState } from 'react';
import { useCalendarStore, useRoutinesStore } from '../../hooks';

export const PanDayForm = ({ date, onPlanned }) => {
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
        <form onSubmit={onSubmit} className="d-flex gap-2 align-items-end flex-wrap mt-2">
            <div style={{ minWidth: '220px' }}>
                <label className="form-label small mb-0">Routine day</label>
                <select
                    className="form-select form-select-sm"
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

            <button
                className="btn btn-sm btn-outline-success"
                type="submit"
                disabled={!routineDayId || isSubmitting}
            >
                {isSubmitting ? 'Planning...' : 'Plan this day'}
            </button>
        </form>
    );
};
