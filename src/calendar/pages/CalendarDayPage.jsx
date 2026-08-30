import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { isBefore, parseISO, startOfDay } from 'date-fns';
import { useCalendarStore, useRoutinesStore } from '../../hooks';
import { Navbar } from '../../components/Navbar';
import { PlanDayForm } from '../components/PlanDayForm';
import { SessionBuilder } from '../components/SessionBuilder';
import { PlannedSessionCard } from '../components/PlannedSessionCard';
import { DoneSessionCard } from '../components/DoneSessionCard';

export const CalendarDayPage = () => {
    const { date } = useParams();
    const [year, month] = date.split('-').map(Number);

    const { entries, isLoading, sessionPrefill, startLoadingMonth, startLoadingSessionPrefill } =
        useCalendarStore();
    const { days: routineDays, startLoadingRoutine } = useRoutinesStore();

    // null | 'log-active' (prefilled builder open) | 'log-free' (free builder open)
    const [logMode, setLogMode] = useState(null);
    const [activeRoutineDayId, setActiveRoutineDayId] = useState('');
    const [activeCalendarEntryId, setActiveCalendarEntryId] = useState(undefined);
    const [logPickerRoutineDayId, setLogPickerRoutineDayId] = useState('');

    useEffect(() => {
        startLoadingMonth(year, month);
        startLoadingRoutine();
    }, []);

    // a day can have more than one session — each rendered as its own card
    const dayEntries = entries.filter((e) => e.date === date && e.status !== 'empty');

    const isPastDate = isBefore(parseISO(date), startOfDay(new Date()));

    // completing a *specific* planned card — we know exactly which
    // CalendarEntry to mark done, so no ambiguity even with duplicates
    const onCompletePlannedEntry = async (entry) => {
        setActiveRoutineDayId(entry.routineDay.id);
        setActiveCalendarEntryId(entry.id);
        await startLoadingSessionPrefill(date, entry.routineDay.id);
        setLogMode('log-active');
    };

    // logging fresh, from the "Log a session now" picker — no pre-existing
    // planned entry is being targeted
    const onStartFreshRoutineSession = async (routineDayId) => {
        setActiveRoutineDayId(routineDayId);
        setActiveCalendarEntryId(undefined);
        await startLoadingSessionPrefill(date, routineDayId);
        setLogMode('log-active');
    };

    const onSessionDone = () => {
        setLogMode(null);
        setActiveRoutineDayId('');
        setActiveCalendarEntryId(undefined);
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
                            {dayEntries.length === 0
                                ? 'Empty day'
                                : `${dayEntries.length} session${dayEntries.length > 1 ? 's' : ''}`}
                        </h1>
                    </header>

                    {isLoading && <p className="routine-detail-loading">Loading...</p>}

                    {!isLoading && logMode === 'log-active' && sessionPrefill && (
                        <SessionBuilder
                            date={date}
                            routineDayId={activeRoutineDayId}
                            calendarEntryId={activeCalendarEntryId}
                            initialExercises={sessionPrefill.exercises}
                            onDone={onSessionDone}
                        />
                    )}

                    {!isLoading && logMode === 'log-free' && (
                        <SessionBuilder
                            date={date}
                            routineDayId={undefined}
                            calendarEntryId={undefined}
                            initialExercises={[]}
                            onDone={onSessionDone}
                        />
                    )}

                    {!isLoading && logMode === null && (
                        <>
                            {dayEntries.length > 0 && (
                                <div className="calendar-session-list">
                                    {dayEntries.map((entry) =>
                                        entry.status === 'planned' ? (
                                            <PlannedSessionCard
                                                key={entry.id}
                                                entry={entry}
                                                onComplete={onCompletePlannedEntry}
                                            />
                                        ) : (
                                            <DoneSessionCard key={entry.id} entry={entry} />
                                        )
                                    )}
                                </div>
                            )}

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
                                            onChange={(e) =>
                                                setLogPickerRoutineDayId(e.target.value)
                                            }
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
                                                    onStartFreshRoutineSession(
                                                        logPickerRoutineDayId
                                                    );
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
                        </>
                    )}
                </div>
            </main>
        </>
    );
};
