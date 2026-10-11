import { Badge } from '../../components/Badge';
import { ListCard } from '../../components/ListCard';
import { MuscleGroupChips } from './MuscleGroupMarks';
import { useTranslation } from 'react-i18next';

export const DoneSessionCard = ({ entry }) => {
    const { t } = useTranslation();

    return (
        <ListCard
            to={`/calendar/${entry.date}/session/${entry.historyEntry.id}`}
            media={
                <div className="routine-day-number calendar-day-icon-done">
                    <i className="fas fa-check"></i>
                </div>
            }
            title={entry.routineDay ? entry.routineDay.description : t('common.freeSession')}
            meta={
                <>
                    <Badge status="done">{t('common.done')}</Badge>
                    <MuscleGroupChips groups={entry.muscleGroups} />
                </>
            }
        />
    );
};
