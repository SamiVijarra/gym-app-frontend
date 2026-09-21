import { useEffect, useState } from 'react';
import { startOfWeek, format } from 'date-fns';
import { useCalendarStore } from '../../hooks';
import { Button } from '../../components/Button';

export const WeeklyGoalCard = () => {
    const weekStart = format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd');
    const { weeklyGoal, startLoadingWeeklyGoal, startSettingWeeklyGoal } = useCalendarStore();
    const [targetDays, setTargetDays] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        startLoadingWeeklyGoal(weekStart);
    }, [weekStart]);

    const onSave = async (event) => {
        event.preventDefault();
        if (!targetDays) return;
        setIsSaving(true);
        await startSettingWeeklyGoal(weekStart, Number(targetDays));
        setIsSaving(false);
    };

    if (!weeklyGoal) return null;

    return (
        <section className="weekly-goal-card">
            <div>
                <span className="weekly-goal-label">THIS WEEK'S GOAL</span>

                {weeklyGoal.targetDays ? (
                    <p className="weekly-goal-progress">
                        {weeklyGoal.doneDays} of {weeklyGoal.targetDays} days trained
                    </p>
                ) : (
                    <p className="weekly-goal-progress">No goal set for this week yet.</p>
                )}
            </div>

            <form onSubmit={onSave} className="weekly-goal-form">
                <select
                    className="routine-form-input"
                    value={targetDays}
                    onChange={(e) => setTargetDays(e.target.value)}
                >
                    <option value="">
                        {weeklyGoal.targetDays ? `${weeklyGoal.targetDays} days` : 'Set days...'}
                    </option>
                    {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                        <option key={n} value={n}>
                            {n} {n === 1 ? 'day' : 'days'}
                        </option>
                    ))}
                </select>

                <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    disabled={!targetDays || isSaving}
                >
                    {isSaving ? 'Saving...' : 'Save'}
                </Button>
            </form>
        </section>
    );
};
