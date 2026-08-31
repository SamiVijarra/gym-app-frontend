import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useCalendarStore } from '../../hooks';
import { Navbar } from '../../components/Navbar';
import { HistorySessionView } from '../components/HistorySessionView';

export const CalendarSessionDetailPage = () => {
    const { date, historyEntryId } = useParams();

    const { historyEntries, startLoadingHistoryEntry } = useCalendarStore();
    const historyEntry = historyEntries[historyEntryId];

    useEffect(() => {
        startLoadingHistoryEntry(historyEntryId);
    }, [historyEntryId]);
    return (
        <>
            <Navbar />
            <main className="routine-detail-page">
                <div className="routine-detail-container">
                    <Link to={`/calendar/${date}`} className="routine-back-link">
                        <span>←</span>
                        Back to {date}
                    </Link>

                    <header className="routine-detail-header">
                        <div className="routine-detail-eyebrow">{date}</div>

                        <h1 className="routine-detail-title">
                            {historyEntry
                                ? historyEntry.routineDay
                                    ? historyEntry.routineDay.description
                                    : 'Free session'
                                : 'Session'}
                        </h1>

                        <div className="routine-detail-meta">
                            <span className="calendar-status-badge calendar-status-badge-done">
                                Done
                            </span>
                        </div>
                    </header>

                    {!historyEntry ? (
                        <p className="routine-detail-loading">Loading...</p>
                    ) : (
                        <HistorySessionView historyEntry={historyEntry} />
                    )}
                </div>
            </main>
        </>
    );
};
