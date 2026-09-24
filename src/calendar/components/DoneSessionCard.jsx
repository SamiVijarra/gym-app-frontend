import { Link } from 'react-router-dom';
import { Badge } from '../../components/Badge';

export const DoneSessionCard = ({ entry }) => {
    return (
        <Link
            to={`/calendar/${entry.date}/session/${entry.historyEntry.id}`}
            className="routine-day-card"
        >
            <div className="routine-day-number calendar-day-icon-done">
                <i className="fas fa-check"></i>
            </div>

            <div className="routine-day-info">
                <h2>{entry.routineDay ? entry.routineDay.description : 'Free session'}</h2>

                <Badge status="done">Done</Badge>
            </div>

            <div className="routine-day-arrow">→</div>
        </Link>
    );
};
