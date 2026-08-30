import { useEffect } from 'react';
import { useCalendarStore } from '../../hooks';
import { HistorySessionView } from './HistorySessionView';

export const DoneSessionCard = ({ entry }) => {
    const { historyEntries, startLoadingHistoryEntry } = useCalendarStore();

    const historyEntryId = entry.historyEntry.id;
    const historyEntry = historyEntries[historyEntryId];

    useEffect(() => {
        startLoadingHistoryEntry(historyEntryId);
    }, [historyEntryId]);

    return (
        <section className="calendar-session-block">
            <div className="calendar-session-block-fa-header">
                <span className="calendar-status-badge calendar-status-badge-done">Done</span>
                <h3>{entry.routineDay ? entry.routineDay.description : 'Free session'}</h3>
            </div>
            {!historyEntry ? (
                <p className="routine-detail-loading">Loading...</p>
            ) : (
                <HistorySessionView historyEntry={historyEntry} />
            )}
        </section>
    );
};
