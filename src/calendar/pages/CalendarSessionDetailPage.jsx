import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

import { useCalendarStore } from '../../hooks';
import { HistorySessionView } from '../components/HistorySessionView';
import { Breadcrumb } from '../../components/Breadcrumb';
import { PageHeader } from '../../components/PageHeader';
import { LoadingState } from '../../components/LoadingState';
import { Badge } from '../../components/Badge';

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
                    meta={[<Badge status="done">Done</Badge>]}
                />

                {!historyEntry ? (
                    <LoadingState label="Loading..." />
                ) : (
                    <HistorySessionView historyEntry={historyEntry} />
                )}
            </div>
        </main>
    );
};
