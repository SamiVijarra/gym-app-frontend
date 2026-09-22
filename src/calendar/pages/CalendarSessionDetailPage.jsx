import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

import { useCalendarStore } from '../../hooks';
import { HistorySessionView } from '../components/HistorySessionView';
import { Breadcrumb } from '../../components/Breadcrumb';
import { PageHeader } from '../../components/PageHeader';

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

                <PageHeader
                    eyebrow={date}
                    title={
                        historyEntry
                            ? historyEntry.routineDay
                                ? historyEntry.routineDay.description
                                : 'Free session'
                            : 'Session'
                    }
                    meta={[
                        <span className="calendar-status-badge calendar-status-badge-done">
                            Done
                        </span>,
                    ]}
                />

                {!historyEntry ? (
                    <p className="routine-detail-loading">Loading...</p>
                ) : (
                    <HistorySessionView historyEntry={historyEntry} />
                )}
            </div>
        </main>
    );
};
