import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    addMonths,
    eachDayOfInterval,
    endOfMonth,
    endOfWeek,
    format,
    isSameMonth,
    isToday,
    startOfMonth,
    startOfWeek,
    subMonths,
} from 'date-fns';
import { useCalendarStore } from '../../hooks';
import { WeeklyGoalCard } from '../components/WeeklyGoalCard';
import { PageHeader } from '../../components/PageHeader';
import { LoadingState } from '../../components/LoadingState';
import { Card } from '../../components/Card';
import { MuscleGroupLegend, MuscleGroupMarks } from '../components/MuscleGroupMarks';
import { mergeMuscleGroups } from '../muscleGroups';
import { useTranslation } from 'react-i18next';
import { useLocaleFormat } from '../../i18n/format';

const WEEKDAY_KEYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

const STATUS_KEY = {
    planned: 'common.planned',
    done: 'common.done',
};

export const CalendarPage = () => {
    const { t } = useTranslation();
    const { formatMonthYear } = useLocaleFormat();
    const [visibleMonth, setVisibleMonth] = useState(() => startOfMonth(new Date()));

    const { entries, isLoading, startLoadingMonth } = useCalendarStore();

    const year = visibleMonth.getFullYear();
    const month = visibleMonth.getMonth() + 1;

    useEffect(() => {
        startLoadingMonth(year, month);
    }, [startLoadingMonth, year, month]);

    const entriesByDate = useMemo(() => {
        const map = new Map();
        entries.forEach((entry) => {
            if (entry.status === 'empty') return;
            const list = map.get(entry.date) ?? [];
            list.push(entry);
            map.set(entry.date, list);
        });
        return map;
    }, [entries]);

    const gridDays = useMemo(() => {
        const gridStart = startOfWeek(startOfMonth(visibleMonth), { weekStartsOn: 1 });
        const gridEnd = endOfWeek(endOfMonth(visibleMonth), { weekStartsOn: 1 });
        return eachDayOfInterval({ start: gridStart, end: gridEnd });
    }, [visibleMonth]);

    const onPrevMonth = () => setVisibleMonth((current) => subMonths(current, 1));
    const onNextMonth = () => setVisibleMonth((current) => addMonths(current, 1));
    const onGoToday = () => setVisibleMonth(startOfMonth(new Date()));

    return (
        <main className="app-page calendar-page">
            <div className="app-page-container calendar-page-container">
                <PageHeader
                    eyebrow={t('calendar.eyebrow')}
                    title={t('calendar.title')}
                    subtitle={t('calendar.subtitle')}
                />

                <WeeklyGoalCard />
                <Card variant="surface">
                    <div className="calendar-nav">
                        <button
                            type="button"
                            className="calendar-nav-button"
                            onClick={onPrevMonth}
                            aria-label={t('calendar.previousMonth')}
                        >
                            <i className="fas fa-chevron-left"></i>
                        </button>
                        <div className="calendar-nav-title">
                            <strong>{formatMonthYear(visibleMonth)}</strong>
                            <button
                                type="button"
                                className="calendar-today-button"
                                onClick={onGoToday}
                            >
                                {t('calendar.today')}
                            </button>
                        </div>
                        <button
                            type="button"
                            className="calendar-nav-button"
                            onClick={onNextMonth}
                            aria-label={t('calendar.nextMonth')}
                        >
                            <i className="fas fa-chevron-right"></i>
                        </button>
                    </div>
                    <div className="calendar-weekdays">
                        {WEEKDAY_KEYS.map((key) => (
                            <span key={key}>{t(`calendar.weekdays.${key}`)}</span>
                        ))}
                    </div>
                    {isLoading ? (
                        <LoadingState label={t('calendar.loading')} />
                    ) : (
                        <div className="calendar-grid">
                            {gridDays.map((day) => {
                                const dateKey = format(day, 'yyyy-MM-dd');
                                const dayEntries = entriesByDate.get(dateKey) ?? [];
                                const inCurrentMonth = isSameMonth(day, visibleMonth);

                                const hasDone = dayEntries.some((e) => e.status === 'done');
                                const hasPlanned = dayEntries.some((e) => e.status === 'planned');

                                const displayStatus = hasDone
                                    ? 'done'
                                    : hasPlanned
                                      ? 'planned'
                                      : null;
                                const sessionCount = dayEntries.length;
                                const dayMuscleGroups = mergeMuscleGroups(dayEntries);
                                return (
                                    <Link
                                        key={dateKey}
                                        to={`/calendar/${dateKey}`}
                                        style={{ position: 'relative' }}
                                        className={[
                                            'calendar-day-cell',
                                            !inCurrentMonth && 'calendar-day-cell-muted',
                                            isToday(day) && 'calendar-day-cell-today',
                                            displayStatus === 'planned' &&
                                                'calendar-day-cell-planned',
                                            displayStatus === 'done' && 'calendar-day-cell-done',
                                        ]
                                            .filter(Boolean)
                                            .join(' ')}
                                    >
                                        <MuscleGroupMarks groups={dayMuscleGroups} />
                                        <span className="calendar-day-number">
                                            {format(day, 'd')}
                                        </span>
                                        {displayStatus && (
                                            <span className="calendar-day-status">
                                                {t(STATUS_KEY[displayStatus])}
                                                {sessionCount > 1 && ` ×${sessionCount}`}
                                            </span>
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                    <MuscleGroupLegend />
                </Card>
            </div>
        </main>
    );
};
