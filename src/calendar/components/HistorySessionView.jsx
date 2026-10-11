import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCalendarStore } from '../../hooks';
import { Button } from '../../components/Button';
import { ExerciseCard } from '../../components/ExerciseCard';
import { SetsTable } from '../../components/SetsTable';
import { useTranslation } from 'react-i18next';
import { useMuscleLabels } from '../../i18n/muscles';

const InlineNotesEditor = ({ id, initialNotes, onSave }) => {
    const { t } = useTranslation();
    const [notes, setNotes] = useState(initialNotes ?? '');
    const [isSaving, setIsSaving] = useState(false);
    const isDirty = notes !== (initialNotes ?? '');

    const onSubmit = async (event) => {
        event.preventDefault();
        setIsSaving(true);
        await onSave(notes);
        setIsSaving(false);
    };

    return (
        <form onSubmit={onSubmit} className="inline-notes-form">
            <label htmlFor={id} className="visually-hidden">
                {t('common.notes')}
            </label>
            <input
                id={id}
                type="text"
                className="routine-form-input"
                placeholder={t('common.notes')}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
            />
            {isDirty && (
                <Button type="submit" variant="secondary" size="sm" disabled={isSaving}>
                    {isSaving ? '...' : t('common.save')}
                </Button>
            )}
        </form>
    );
};

export const HistorySessionView = ({ historyEntry }) => {
    const { t } = useTranslation();
    const { muscleLabel } = useMuscleLabels();
    const {
        startUpdatingHistoryExerciseNotes,
        startUpdatingHistorySetNotes,
        startLoadingHistoryEntry,
    } = useCalendarStore();
    const refresh = () => startLoadingHistoryEntry(historyEntry.id);

    return (
        <div className="routine-exercises">
            {historyEntry.exercises.map((historyExercise) => (
                <ExerciseCard
                    key={historyExercise.id}
                    image={historyExercise.exercise.images?.[0]?.url}
                    name={historyExercise.exercise.name}
                    tags={(historyExercise.exercise.primaryMuscles ?? []).map((m) => ({
                        label: muscleLabel(m),
                    }))}
                    actions={
                        <Button
                            as={Link}
                            to={`/exercises/${historyExercise.exercise.id}/progress`}
                            variant="ghost"
                            size="icon"
                            aria-label={t('common.viewProgress')}
                            title={t('common.viewProgress')}
                        >
                            <i className="fas fa-chart-line"></i>
                        </Button>
                    }
                >
                    <div style={{ padding: '16px 24px 24px' }}>
                        <div className="session-exercise-notes">
                            <InlineNotesEditor
                                id={`exercise-notes-${historyExercise.id}`}
                                initialNotes={historyExercise.notes}
                                onSave={async (notes) => {
                                    await startUpdatingHistoryExerciseNotes(
                                        historyExercise.id,
                                        notes
                                    );
                                    await refresh();
                                }}
                            />
                        </div>

                        <SetsTable
                            columns={[
                                t('common.set'),
                                t('common.weight'),
                                t('common.reps'),
                                t('common.rest'),
                                t('common.notes'),
                            ]}
                        >
                            {historyExercise.sets.map((set) => (
                                <tr key={set.id}>
                                    <td>{set.order}</td>
                                    <td>
                                        {set.weight} {t('common.kg')}
                                    </td>
                                    <td>{set.reps}</td>
                                    <td>
                                        {set.restSeconds
                                            ? t('common.seconds', { value: set.restSeconds })
                                            : '-'}
                                    </td>
                                    <td>
                                        <InlineNotesEditor
                                            id={`set-notes-${set.id}`}
                                            initialNotes={set.notes}
                                            onSave={async (notes) => {
                                                await startUpdatingHistorySetNotes(set.id, notes);
                                                await refresh();
                                            }}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </SetsTable>
                    </div>
                </ExerciseCard>
            ))}
        </div>
    );
};
