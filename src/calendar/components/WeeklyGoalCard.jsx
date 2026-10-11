import { useEffect, useState } from 'react';
import { startOfWeek, format } from 'date-fns';
import { useCalendarStore } from '../../hooks';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { FormField } from '../../components/FormField';
import { useTranslation } from 'react-i18next';

export const WeeklyGoalCard = () => {
    const { t } = useTranslation();
    const weekStart = format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd');
    const { weeklyGoal, startLoadingWeeklyGoal, startSettingWeeklyGoal } = useCalendarStore();
    const [targetDays, setTargetDays] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        startLoadingWeeklyGoal(weekStart);
    }, [weekStart, startLoadingWeeklyGoal]);

    const onSave = async (event) => {
        event.preventDefault();
        if (!targetDays) return;
        setIsSaving(true);
        await startSettingWeeklyGoal(weekStart, Number(targetDays));
        setIsSaving(false);
    };

    if (!weeklyGoal) return null;

    const hasGoal = Boolean(weeklyGoal.targetDays);
    const isComplete = hasGoal && weeklyGoal.doneDays >= weeklyGoal.targetDays;

    return (
        <Card
            variant="surface"
            className={`weekly-goal-card${isComplete ? ' weekly-goal-card-complete' : ''}`}
        >
            <div>
                <span className="weekly-goal-label">{t('calendar.weeklyGoal')}</span>

                {weeklyGoal.targetDays ? (
                    <>
                        <p className="weekly-goal-progress">
                            {t('calendar.weeklyProgress', {
                                done: weeklyGoal.doneDays,
                                count: weeklyGoal.targetDays,
                            })}
                        </p>

                        <div className="weekly-goal-dots" aria-hidden="true">
                            {Array.from({ length: weeklyGoal.targetDays }, (_, index) => (
                                <span
                                    key={index}
                                    className={`weekly-goal-dot${
                                        index < weeklyGoal.doneDays ? ' weekly-goal-dot-done' : ''
                                    }`}
                                    style={{ '--dot-index': index }}
                                ></span>
                            ))}
                        </div>

                        {isComplete && (
                            <p className="weekly-goal-reached">
                                <i className="fas fa-fire"></i>
                                {t('calendar.goalReached')}
                            </p>
                        )}
                    </>
                ) : (
                    <p className="weekly-goal-progress">{t('calendar.noGoal')}</p>
                )}
            </div>

            <form onSubmit={onSave} className="weekly-goal-form">
                <FormField
                    id="weekly-goal-days"
                    label={t('calendar.targetDays')}
                    as="select"
                    className="weekly-goal-select"
                    value={targetDays}
                    onChange={(e) => setTargetDays(e.target.value)}
                >
                    <option value="">
                        {weeklyGoal.targetDays
                            ? t('counts.day', { count: weeklyGoal.targetDays })
                            : t('calendar.setDays')}
                    </option>
                    {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                        <option key={n} value={n}>
                            {t('counts.day', { count: n })}
                        </option>
                    ))}
                </FormField>
                <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    className="form-field-row-button"
                    disabled={!targetDays || isSaving}
                >
                    {isSaving ? t('common.saving') : t('common.save')}
                </Button>
            </form>
        </Card>
    );
};
