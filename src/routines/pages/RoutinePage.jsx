import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useForm, useRoutinesStore } from '../../hooks';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { FormField } from '../../components/FormField';
import { PageHeader } from '../../components/PageHeader';
import { SectionLabel } from '../../components/SectionLabel';
import { EmptyState } from '../../components/EmptyState';
import { LoadingState } from '../../components/LoadingState';
import { DayNumberMedia, ListCard } from '../../components/ListCard';
import { useTranslation } from 'react-i18next';

const newDayFields = { dayNumber: '', description: '' };

export const RoutinePage = () => {
    const { t } = useTranslation();
    const { days, isLoading, startLoadingRoutine, startCreatingDay, startRemovingDay } =
        useRoutinesStore();

    const { dayNumber, description, onInputChange, onResetForm } = useForm(newDayFields);

    const [touched, setTouched] = useState({ dayNumber: false, description: false });
    const onFieldBlur = (field) => setTouched((current) => ({ ...current, [field]: true }));
    const dayNumberError = touched.dayNumber && !dayNumber;
    const descriptionError = touched.description && !description;

    useEffect(() => {
        startLoadingRoutine();
    }, [startLoadingRoutine]);

    const onCreateDay = async (event) => {
        event.preventDefault();
        if (!dayNumber || !description) return;
        await startCreatingDay({ dayNumber: Number(dayNumber), description });
        onResetForm();
    };

    const onDeleteDay = async (event, day) => {
        const result = await Swal.fire({
            title: t('routine.deleteDayTitle'),
            text: t('routine.deleteDayText', { description: day.description }),
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: t('common.yesDelete'),
            cancelButtonText: t('common.cancel'),
        });

        if (result.isConfirmed) {
            await startRemovingDay(day.id);
        }
    };

    return (
        <main className="app-page routine-page">
            <div className="app-page-container routine-page-container">
                <PageHeader
                    eyebrow={t('common.training')}
                    title={t('routine.title')}
                    subtitle={t('routine.subtitle')}
                />
                <Card variant="surface">
                    <div className="routine-create-header">
                        <div className="routine-create-icon">
                            <i className="fas fa-plus"></i>
                        </div>
                        <div>
                            <h2>{t('routine.newDayTitle')}</h2>
                            <p>{t('routine.newDayText')}</p>
                        </div>
                    </div>
                    <form onSubmit={onCreateDay} className="routine-create-form">
                        <FormField
                            id="dayNumber"
                            label={t('routine.day')}
                            type="number"
                            className="routine-form-day"
                            min="1"
                            placeholder={t('routine.dayPlaceholder')}
                            name="dayNumber"
                            value={dayNumber}
                            onChange={onInputChange}
                            onBlur={() => onFieldBlur('dayNumber')}
                            error={dayNumberError ? t('routine.dayRequired') : undefined}
                        />
                        <FormField
                            id="description"
                            label={t('routine.description')}
                            placeholder={t('routine.descriptionPlaceholder')}
                            name="description"
                            value={description}
                            onChange={onInputChange}
                            onBlur={() => onFieldBlur('description')}
                            error={descriptionError ? t('routine.descriptionRequired') : undefined}
                        />
                    </form>
                    <Button type="submit" variant="primary" disabled={!dayNumber || !description}>
                        <i className="fas fa-plus"></i>
                        {t('routine.createDay')}
                    </Button>
                </Card>

                <section className="routine-days-section">
                    <SectionLabel meta={t('counts.day', { count: days.length })}>
                        {t('routine.listSection')}
                    </SectionLabel>
                    {isLoading && <LoadingState label={t('routine.loading')} />}
                    {!isLoading && days.length === 0 && (
                        <EmptyState
                            icon="fa-calendar-plus"
                            title={t('routine.emptyTitle')}
                            description={t('routine.emptyText')}
                        />
                    )}
                    {!isLoading && days.length > 0 && (
                        <div className="routine-days-list">
                            {days.map((day) => (
                                <ListCard
                                    key={day.id}
                                    to={`/routine/${day.id}`}
                                    media={
                                        <DayNumberMedia>
                                            <span>{t('routine.dayBadge')}</span>
                                            <strong>
                                                {String(day.dayNumber).padStart(2, '0')}
                                            </strong>
                                        </DayNumberMedia>
                                    }
                                    title={day.description}
                                    meta={
                                        <span>
                                            <i className="fas fa-dumbbell"></i>
                                            {t('counts.exercise', { count: day.exercises.length })}
                                        </span>
                                    }
                                    action={
                                        <Button
                                            variant="danger"
                                            size="icon"
                                            onClick={(event) => onDeleteDay(event, day)}
                                            aria-label={t('routine.deleteDayAria')}
                                        >
                                            <i className="fas fa-trash"></i>
                                        </Button>
                                    }
                                />
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
};
