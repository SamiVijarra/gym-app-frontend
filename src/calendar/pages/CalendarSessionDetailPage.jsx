import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

import { useCalendarStore } from '../../hooks';
import { HistorySessionView } from '../components/HistorySessionView';
import { Breadcrumb } from '../../components/Breadcrumb';

export const CalendarSessionDetailPage = () => {
    const { date, historyEntryId } = useParams();

    const { historyEntries, startLoadingHistoryEntry } = useCalendarStore();
    const historyEntry = historyEntries[historyEntryId];

    useEffect(() => {
        startLoadingHistoryEntry(historyEntryId);
    }, [historyEntryId]);
    return (
        <main className="routine-detail-page">
            <div className="routine-detail-container">
                <Breadcrumb
                    items={[
                        { label: 'Home', to: '/' },
                        { label: 'Calendar', to: '/calendar' },
                        { label: date, to: `/calendar/${date}` },
                        {
                            label: historyEntry
                                ? historyEntry.routineDay
                                    ? historyEntry.routineDay.description
                                    : 'Free session'
                                : 'Session',
                        },
                    ]}
                />

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
    );
};
