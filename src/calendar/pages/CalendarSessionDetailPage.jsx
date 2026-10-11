import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

import { useCalendarStore } from '../../hooks';
import { HistorySessionView } from '../components/HistorySessionView';
import { Breadcrumb } from '../../components/Breadcrumb';
import { PageHeader } from '../../components/PageHeader';
import { LoadingState } from '../../components/LoadingState';
import { Badge } from '../../components/Badge';
import { useTranslation } from 'react-i18next';

export const CalendarSessionDetailPage = () => {
    const { t } = useTranslation();
    const { date, historyEntryId } = useParams();

    const { historyEntries, startLoadingHistoryEntry } = useCalendarStore();
    const historyEntry = historyEntries[historyEntryId];

    useEffect(() => {
        startLoadingHistoryEntry(historyEntryId);
    }, [historyEntryId, startLoadingHistoryEntry]);
    return (
        <main className="routine-detail-page">
            <div className="routine-detail-container">
                <Breadcrumb
                    items={[
                        { label: t('nav.home'), to: '/' },
                        { label: t('nav.calendar'), to: '/calendar' },
                        { label: date, to: `/calendar/${date}` },
                        {
                            label: historyEntry
                                ? historyEntry.routineDay
                                    ? historyEntry.routineDay.description
                                    : t('common.freeSession')
                                : t('common.session'),
                        },
                    ]}
                />

                <PageHeader
                    eyebrow={date}
                    title={
                        historyEntry
                            ? historyEntry.routineDay
                                ? historyEntry.routineDay.description
                                : t('common.freeSession')
                            : t('common.session')
                    }
                    meta={[<Badge status="done">{t('common.done')}</Badge>]}
                />

                {!historyEntry ? (
                    <LoadingState label={t('common.loading')} />
                ) : (
                    <HistorySessionView historyEntry={historyEntry} />
                )}
            </div>
        </main>
    );
};
