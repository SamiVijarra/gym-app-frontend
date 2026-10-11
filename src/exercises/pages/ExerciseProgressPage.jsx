import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { parseISO } from 'date-fns';
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
import { Button } from '../../components/Button';
import { ToggleGroup } from '../../components/ToggleGroup';
import { Breadcrumb } from '../../components/Breadcrumb';
import { LoadingState } from '../../components/LoadingState';
import { PageHeader } from '../../components/PageHeader';
import { Card } from '../../components/Card';
import { useTranslation } from 'react-i18next';
import { useLocaleFormat } from '../../i18n/format';

const METRICS = {
    maxWeight: {
        labelKey: 'exercises.maxWeight',
        unit: 'kg',
        compute: (sets) => Math.max(...sets.map((s) => s.weight)),
    },
    volume: {
        labelKey: 'exercises.totalVolume',
        unit: 'kg',
        compute: (sets) => sets.reduce((total, s) => total + s.weight * s.reps, 0),
    },
};

export const ExerciseProgressPage = () => {
    const { t } = useTranslation();
    const { formatShortDate } = useLocaleFormat();
    const { id } = useParams();
    const { selectedExercise, startLoadingExercise } = useExercisesStore();
    const { exerciseHistory, startLoadingExerciseHistory, isLoading } = useCalendarStore();
    const [metric, setMetric] = useState('maxWeight');

    useEffect(() => {
        startLoadingExercise(id);
        startLoadingExerciseHistory(id);
    }, [id, startLoadingExercise, startLoadingExerciseHistory]);

    const sessions = exerciseHistory[id] ?? [];

    const chartData = sessions
        .filter((session) => session.sets.length > 0)
        .map((session) => ({
            date: formatShortDate(parseISO(session.date)),
            value: METRICS[metric].compute(session.sets),
        }));

    return (
        <main className="exercise-detail-page">
            <div className="exercise-detail-container">
                <Breadcrumb
                    items={[
                        { label: t('nav.home'), to: '/' },
                        { label: t('nav.exercises'), to: '/exercises' },
                        {
                            label: selectedExercise?.name ?? t('exercises.fallbackName'),
                            to: `/exercises/${id}`,
                        },
                        { label: t('exercises.progress') },
                    ]}
                />

                <PageHeader
                    eyebrow={t('exercises.progressEyebrow')}
                    title={selectedExercise?.name ?? t('exercises.fallbackName')}
                />

                <Card variant="surface">
                    <ToggleGroup
                        options={Object.entries(METRICS).map(([key, { labelKey }]) => ({
                            value: key,
                            label: t(labelKey),
                        }))}
                        value={metric}
                        onChange={setMetric}
                    />

                    {isLoading ? (
                        <LoadingState label={t('exercises.loadingHistory')} />
                    ) : chartData.length === 0 ? (
                        <p style={{ padding: '1.5rem 0' }}>{t('exercises.noHistory')}</p>
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
                                            t(METRICS[metric].labelKey),
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
                </Card>
            </div>
        </main>
    );
};
