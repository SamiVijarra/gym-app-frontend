import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { isBefore, parseISO, startOfDay } from 'date-fns';
import { useCalendarStore, useRoutinesStore } from '../../hooks';
import { Navbar } from '../../components/Navbar';
import { PlanDayForm } from '../components/PlanDayForm';
import { SessionBuilder } from '../components/SessionBuilder';
import { HistorySessionView } from '../components/HistorySessionView';

const STATUS_BADGE = {
    planned: { label: 'Planned', className: 'calendar-status-badge-planned' },
    done: { label: 'Done', className: 'calendar-status-badge-done' },
};

export const CalendarDayPage = () => {
    const { date } = useParams();
    const [year, month] = date.split('-').map(Number);

    const {
        entries,
        isLoading,
        sessionPrefill,
        historyEntry,
        startLoadingMonth,
        startLoadingSessionPrefill,
        startLoadingHistoryEntry,
    } = useCalendarStore();
    const { days: routineDays, startLoadingRoutine } = useRoutinesStore();

    const [logMode, setLogMode] = useState(null);
    const [activeRoutineDayId, setActiveRoutineDayId] = useState('');
    const [logPickerRoutineDayId, setLogPickerRoutineDayId] = useState('');

    useEffect(() => {
        startLoadingMonth(year, month);
        startLoadingRoutine();
    }, []);

    const entry = entries.find((e) => e.date === date);
    const status = entry?.status;
    // treats "no entry at all" and "entry explicitly empty" the same way
    const isEmptyDay = !status || status === 'empty';

    useEffect(() => {
        if (status === 'done' && entry?.historyEntry?.id) {
            startLoadingHistoryEntry(entry.historyEntry.id);
        }
    }, [status, entry?.historyEntry?.id]);

    const isPastDate = isBefore(parseISO(date), startOfDay(new Date()));

    const onStartPrefilledSession = async (routineDayId) => {
        setActiveRoutineDayId(routineDayId);
        await startLoadingSessionPrefill(date, routineDayId);
        setLogMode('log-active');
    };

    const onSessionDone = () => {
        setLogMode(null);
        setActiveRoutineDayId('');
        setLogPickerRoutineDayId('');
    };

    return (
        <>
            <Navbar />
            <main className="routine-detail-page">
                <div className="routine-detail-container">
                    <Link to="/calendar" className="routine-back-link">
                        <span>←</span>
                        Back to calendar
                    </Link>

                    <header className="routine-detail-header">
                        <div className="routine-detail-eyebrow">{date}</div>

                        <h1 className="routine-detail-title">
                            {isEmptyDay
                                ? 'Empty day'
                                : entry.routineDay
                                  ? entry.routineDay.description
                                  : 'Free session'}
                        </h1>

                        {!isEmptyDay && (
                            <div className="routine-detail-meta">
                                <span
                                    className={`calendar-status-badge ${STATUS_BADGE[status].className}`}
                                >
                                    {STATUS_BADGE[status].label}
                                </span>
                            </div>
                        )}
                    </header>

                    {isLoading && <p className="routine-detail-loading">Loading...</p>}

                    {!isLoading && logMode === 'log-active' && sessionPrefill && (
                        <SessionBuilder
                            date={date}
                            routineDayId={activeRoutineDayId}
                            initialExercises={sessionPrefill.exercises}
                            onDone={onSessionDone}
                        />
                    )}

                    {!isLoading && logMode === 'log-free' && (
                        <SessionBuilder
                            date={date}
                            routineDayId={undefined}
                            initialExercises={[]}
                            onDone={onSessionDone}
                        />
                    )}

                    {!isLoading && logMode === null && status === 'done' && historyEntry && (
                        <HistorySessionView historyEntry={historyEntry} />
                    )}

                    {!isLoading && logMode === null && status === 'planned' && (
                        <section className="routine-create-card">
                            <div className="routine-create-header">
                                <div>
                                    <h2>{entry.routineDay?.description}</h2>
                                    <p>Day {entry.routineDay?.dayNumber}</p>
                                </div>
                            </div>

                            <button
                                className="btn btn-success"
                                onClick={() => onStartPrefilledSession(entry.routineDay.id)}
                            >
                                Complete session
                            </button>
                        </section>
                    )}

                    {!isLoading && logMode === null && isEmptyDay && (
                        <div className="calendar-choice-grid">
                            {!isPastDate && (
                                <section className="calendar-choice-card">
                                    <h3>Plan this day</h3>
                                    <p>Assign a routine day for later.</p>
                                    <PlanDayForm date={date} onPlanned={() => {}} />
                                </section>
                            )}

                            <section className="calendar-choice-card">
                                <h3>Log a session now</h3>
                                <p>Record a session you already did.</p>

                                <div className="d-flex gap-2 flex-wrap mt-2">
                                    <select
                                        className="form-select form-select-sm"
                                        value={logPickerRoutineDayId}
                                        onChange={(e) => setLogPickerRoutineDayId(e.target.value)}
                                        style={{ maxWidth: '220px' }}
                                    >
                                        <option value="">Free session (no routine)</option>
                                        {routineDays.map((day) => (
                                            <option key={day.id} value={day.id}>
                                                Day {day.dayNumber} — {day.description}
                                            </option>
                                        ))}
                                    </select>

                                    <button
                                        className="btn btn-sm btn-outline-success"
                                        onClick={() => {
                                            if (logPickerRoutineDayId) {
                                                onStartPrefilledSession(logPickerRoutineDayId);
                                            } else {
                                                setLogMode('log-free');
                                            }
                                        }}
                                    >
                                        Start
                                    </button>
                                </div>
                            </section>
                        </div>
                    )}
                </div>
            </main>
        </>
    );
};
