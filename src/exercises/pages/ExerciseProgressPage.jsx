import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import {
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import { useCalendarStore, useExercisesStore } from '../../hooks';
import { Navbar } from '../../components/Navbar';

const METRICS = {
    maxWeight: {
        label: 'Max weight',
        unit: 'kg',
        compute: (sets) => Math.max(...sets.map((s) => s.weight)),
    },
    volume: {
        label: 'Total volume',
        unit: 'kg',
        compute: (sets) => sets.reduce((total, s) => total + s.weight * s.reps, 0),
    },
};

export const ExerciseProgressPage = () => {
    const { id } = useParams();
    const { selectedExercise, startLoadingExercise } = useExercisesStore();
    const { exerciseHistory, startLoadingExerciseHistory, isLoading } = useCalendarStore();
    const [metric, setMetric] = useState('maxWeight');

    useEffect(() => {
        startLoadingExercise(id);
        startLoadingExerciseHistory(id);
    }, [id]);

    const sessions = exerciseHistory[id] ?? [];

    const chartData = sessions
        .filter((session) => session.sets.length > 0)
        .map((session) => ({
            date: format(parseISO(session.date), 'MMM d'),
            value: METRICS[metric].compute(session.sets),
        }));

    return (
        <>
            <Navbar />
            <main className="exercise-detail-page">
                <div className="exercise-detail-container">
                    <Link to={`/exercises/${id}`} className="exercise-detail-back-link">
                        <span>←</span>
                        Return to exercise
                    </Link>

                    <header className="exercise-detail-header">
                        <span className="exercise-detail-eyebrow">PROGRESS</span>
                        <h1 className="exercise-detail-title">
                            {selectedExercise?.name ?? 'Exercise'}
                        </h1>
                    </header>

                    <section className="routine-create-card">
                        <div className="exercise-mode-switch">
                            {Object.entries(METRICS).map(([key, { label }]) => (
                                <button
                                    key={key}
                                    type="button"
                                    className={
                                        metric === key
                                            ? 'exercise-mode-button active'
                                            : 'exercise-mode-button'
                                    }
                                    onClick={() => setMetric(key)}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>

                        {isLoading ? (
                            <div className="exercise-detail-loading">
                                <div className="exercise-detail-loading-spinner" />
                                <span>Loading history...</span>
                            </div>
                        ) : chartData.length === 0 ? (
                            <p style={{ padding: '1.5rem 0' }}>
                                No completed sessions yet for this exercise. Log a session from the
                                calendar to start tracking progress.
                            </p>
                        ) : (
                            <div style={{ width: '100%', height: 320, marginTop: '1.5rem' }}>
                                <ResponsiveContainer>
                                    <LineChart data={chartData}>
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            stroke="var(--app-border)"
                                        />
                                        <XAxis dataKey="date" stroke="var(--app-text-muted)" />
                                        <YAxis
                                            stroke="var(--app-text-muted)"
                                            unit={` ${METRICS[metric].unit}`}
                                        />
                                        <Tooltip
                                            formatter={(value) => [
                                                `${value} ${METRICS[metric].unit}`,
                                                METRICS[metric].label,
                                            ]}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="value"
                                            stroke="var(--app-primary)"
                                            strokeWidth={2}
                                            dot={{ r: 4 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </section>
                </div>
            </main>
        </>
    );
};
