import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { isBefore, parseISO, startOfDay } from 'date-fns';
import { useCalendarStore, useRoutinesStore } from '../../hooks';
import { DoneSessionCard, PlannedSessionCard, SessionBuilder, PlanDayForm } from '../components';
import { Button } from '../../components/Button';
import { Breadcrumb } from '../../components/Breadcrumb';
import { Card } from '../../components/Card';
import { FormField } from '../../components/FormField';
import { PageHeader } from '../../components/PageHeader';
import { LoadingState } from '../../components/LoadingState';
import { useTranslation } from 'react-i18next';

export const CalendarDayPage = () => {
    const { t } = useTranslation();
    const { date } = useParams();
    const [year, month] = date.split('-').map(Number);

    const {
        entries,
        isLoading,
        sessionPrefill,
        startLoadingMonth,
        startLoadingSessionPrefill,
        startLoadingPlannedPrefill,
    } = useCalendarStore();
    const { days: routineDays, startLoadingRoutine } = useRoutinesStore();

    const [logMode, setLogMode] = useState(null);
    const [activeRoutineDayId, setActiveRoutineDayId] = useState('');
    const [activeCalendarEntryId, setActiveCalendarEntryId] = useState(undefined);
    const [logPickerRoutineDayId, setLogPickerRoutineDayId] = useState('');

    useEffect(() => {
        startLoadingMonth(year, month);
    }, [startLoadingMonth, year, month]);

    useEffect(() => {
        startLoadingRoutine();
    }, [startLoadingRoutine]);

    const dayEntries = entries.filter((e) => e.date === date && e.status !== 'empty');

    const isPastDate = isBefore(parseISO(date), startOfDay(new Date()));

    const onCompletePlannedEntry = async (entry) => {
        setActiveCalendarEntryId(entry.id);

        if (entry.routineDay) {
            setActiveRoutineDayId(entry.routineDay.id);
            await startLoadingSessionPrefill(date, entry.routineDay.id);
        } else {
            // Sesión libre planificada: los ejercicios vienen de la planificación.
            setActiveRoutineDayId(undefined);
            await startLoadingPlannedPrefill(entry.id);
        }
        setLogMode('log-active');
    };

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
        <main className="routine-detail-page">
            <div className="routine-detail-container">
                <Breadcrumb
                    items={[
                        { label: t('nav.home'), to: '/' },
                        { label: t('nav.calendar'), to: '/calendar' },
                        { label: date },
                    ]}
                />

                <PageHeader
                    eyebrow={`${date}`}
                    title={
                        dayEntries.length === 0
                            ? t('calendar.emptyDay')
                            : t('counts.session', { count: dayEntries.length })
                    }
                />

                {isLoading && <LoadingState label={t('common.loading')} />}

                {!isLoading && logMode === 'log-active' && sessionPrefill && (
                    <SessionBuilder
                        date={date}
                        routineDayId={activeRoutineDayId || undefined}
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
                                <Card variant="surface">
                                    <h3>{t('calendar.planTitle')}</h3>
                                    <p>{t('calendar.planText')}</p>
                                    <PlanDayForm date={date} onPlanned={() => {}} />
                                </Card>
                            )}

                            <Card variant="surface">
                                <h3>{t('calendar.logTitle')}</h3>
                                <p>{t('calendar.logText')}</p>

                                <div className="add-set-form-row mt-2">
                                    <FormField
                                        id="log-session-routine"
                                        label={t('calendar.routineDay')}
                                        as="select"
                                        value={logPickerRoutineDayId}
                                        onChange={(e) => setLogPickerRoutineDayId(e.target.value)}
                                    >
                                        <option value="">{t('calendar.freeNoRoutine')}</option>
                                        {routineDays.map((day) => (
                                            <option key={day.id} value={day.id}>
                                                {t('common.dayWithDescription', {
                                                    number: day.dayNumber,
                                                    description: day.description,
                                                })}
                                            </option>
                                        ))}
                                    </FormField>
                                </div>
                                <Button
                                    variant="primary"
                                    size="sm"
                                    className="form-field-row-button"
                                    onClick={() => {
                                        if (logPickerRoutineDayId) {
                                            onStartFreshRoutineSession(logPickerRoutineDayId);
                                        } else {
                                            setLogMode('log-free');
                                        }
                                    }}
                                >
                                    {t('calendar.start')}
                                </Button>
                            </Card>
                        </div>
                    </>
                )}
            </div>
        </main>
    );
};
