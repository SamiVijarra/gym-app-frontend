import Swal from 'sweetalert2';
import { useCalendarStore } from '../../hooks';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { Card } from '../../components/Card';
import { MuscleGroupChips } from './MuscleGroupMarks';
import { useTranslation } from 'react-i18next';

export const PlannedSessionCard = ({ entry, onComplete }) => {
    const { t } = useTranslation();
    const { startCancelingPlan } = useCalendarStore();

    const isFreeSession = !entry.routineDay;
    const title = isFreeSession ? t('common.freeSession') : entry.routineDay.description;
    const meta = isFreeSession
        ? (entry.plannedExercises ?? []).map((planned) => planned.exercise.name).join(' · ')
        : t('common.dayNumber', { number: entry.routineDay.dayNumber });

    const onCancel = async () => {
        const result = await Swal.fire({
            title: t('calendar.cancelPlanTitle'),
            text: t('calendar.cancelPlanText', { title }),
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: t('calendar.cancelPlanYes'),
            cancelButtonText: t('calendar.cancelPlanKeep'),
        });

        if (result.isConfirmed) {
            await startCancelingPlan(entry.id, entry.date);
        }
    };

    return (
        <Card variant="surface">
            <div className="calendar-session-block-header">
                <Badge status="planned">{t('common.planned')}</Badge>
                <h3>{title}</h3>
            </div>

            {meta && <p className="calendar-session-block-meta">{meta}</p>}

            <MuscleGroupChips groups={entry.muscleGroups} />

            <div className="calendar-session-actions">
                <Button variant="primary" onClick={() => onComplete(entry)}>
                    {t('calendar.completeSession')}
                </Button>

                <Button variant="danger" onClick={onCancel}>
                    {t('common.cancel')}
                </Button>
            </div>
        </Card>
    );
};
