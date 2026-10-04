import { Badge } from '../../components/Badge';
import { ListCard } from '../../components/ListCard';
import { MuscleGroupChips } from './MuscleGroupMarks';

export const DoneSessionCard = ({ entry }) => {
    return (
        <ListCard
            to={`/calendar/${entry.date}/session/${entry.historyEntry.id}`}
            media={
                <div className="routine-day-number calendar-day-icon-done">
                    <i className="fas fa-check"></i>
                </div>
            }
            title={entry.routineDay ? entry.routineDay.description : 'Free session'}
            meta={
                <>
                    <Badge status="done">Done</Badge>
                    <MuscleGroupChips groups={entry.muscleGroups} />
                </>
            }
        />
    );
};
