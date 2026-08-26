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
import { Navbar } from '../../components/Navbar';

const WEEKDAY_LABELS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

const STATUS_LABEL = {
    PLANNED: 'Planned',
    DONE: 'Done',
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
            map.set(entry.date, entry);
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
        <>
            <Navbar />
            <main className="app-page calendar-page">
                <div className="app-page-container calendar-page-container">
                    <header className="app- page-header calendar-page-header">
                        <span className="app-page-eyebrow">TRAINING</span>
                        <h1 className="app-page-title">Calendar</h1>
                        <p className="app-page-subtitle">
                            Plan your sessions and keep track of your training.
                        </p>
                    </header>
                    <section className="calendar-card">
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
                            <div className="routine-page-loading calendar-loading">
                                <div className="routine-loading-spinner"></div>
                                <span>Loading calendar...</span>
                            </div>
                        ) : (
                            <div className="calendar-grid">
                                {gridDays.map((day) => {
                                    const dateKey = format(day, 'yyyy-MM-dd');
                                    const entry = entriesByDate.get(dateKey);
                                    const inCurrentMonth = isSameMonth(day, visibleMonth);
                                    const status = entry?.status;
                                    return (
                                        <Link
                                            key={dateKey}
                                            to={`/calendar/${dateKey}`}
                                            className={[
                                                'calendar-day-cell',
                                                !inCurrentMonth && 'calendar-day-cell-muted',
                                                isToday(day) && 'calendar-day-cell-today',
                                                status === 'PLANNED' && 'calendar-day-cell-planned',
                                                status === 'DONE' && 'calendar-day-cell-done',
                                            ]
                                                .filter(Boolean)
                                                .join(' ')}
                                        >
                                            <span className="calendar-day-number">
                                                {format(day, 'd')}
                                            </span>
                                            {status && (
                                                <span className="calendar-day-status">
                                                    {STATUS_LABEL[status]}
                                                </span>
                                            )}
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                    </section>
                </div>
            </main>
        </>
    );
};
