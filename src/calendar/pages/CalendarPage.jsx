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

const WEEKDAY_LABELS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

const STATUS_LABEL = {
    planned: 'Planned',
    done: 'Done',
};

export const CalendarPage = () => {
    const [visibleMonth, setVisibleMonth] = useState(() => startOfMonth(new Date()));

    const { entries, isLoading, startLoadingMonth } = useCalendarStore();

    const year = visibleMonth.getFullYear();
    const month = visibleMonth.getMonth() + 1;

    useEffect(() => {
        startLoadingMonth(year, month);
    }, [year, month]);

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
                    eyebrow="TRAINING"
                    title="Calendar"
                    subtitle="Plan your sessions and keep track of your training."
                />

                <WeeklyGoalCard />
                <Card variant="surface">
                    <div className="calendar-nav">
                        <button
                            type="button"
                            className="calendar-nav-button"
                            onClick={onPrevMonth}
                            aria-label="Previous Month"
                        >
                            <i className="fas fa-chevron-left"></i>
                        </button>
                        <div className="calendar-nav-title">
                            <strong>{format(visibleMonth, 'MMMM yyyy')}</strong>
                            <button
                                type="button"
                                className="calendar-today-button"
                                onClick={onGoToday}
                            >
                                Today
                            </button>
                        </div>
                        <button
                            type="button"
                            className="calendar-nav-button"
                            onClick={onNextMonth}
                            aria-label="Next Month"
                        >
                            <i className="fas fa-chevron-right"></i>
                        </button>
                    </div>
                    <div className="calendar-weekdays">
                        {WEEKDAY_LABELS.map((label) => (
                            <span key={label}>{label}</span>
                        ))}
                    </div>
                    {isLoading ? (
                        <LoadingState label="Loading calendar..." />
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
                                return (
                                    <Link
                                        key={dateKey}
                                        to={`/calendar/${dateKey}`}
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
                                        <span className="calendar-day-number">
                                            {format(day, 'd')}
                                        </span>
                                        {displayStatus && (
                                            <span className="calendar-day-status">
                                                {STATUS_LABEL[displayStatus]}
                                                {sessionCount > 1 && ` ×${sessionCount}`}
                                            </span>
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </Card>
            </div>
        </main>
    );
};
