import { Link } from 'react-router-dom';

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

                <div className="routine-day-meta">
                    <span className="calendar-status-badge calendar-status-badge-done">Done</span>
                </div>
            </div>

            <div className="routine-day-arrow">→</div>
        </Link>
    );
};
