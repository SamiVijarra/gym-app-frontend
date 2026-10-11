import { useEffect, useState } from 'react';
import { useAuthStore, useCalendarStore, useForm, useUsersStore } from '../../hooks';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { FormField } from '../../components/FormField';
import { PageHeader } from '../../components/PageHeader';
import { SectionLabel } from '../../components/SectionLabel';
import { LoadingState } from '../../components/LoadingState';
import { useTranslation } from 'react-i18next';
import { useLocaleFormat } from '../../i18n/format';

const profileFormFields = {
    name: '',
    weight: '',
    height: '',
    birthDate: '',
};

const passwordFormFields = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
};

export const ProfilePage = () => {
    const { t } = useTranslation();
    const { formatMonthYear, formatNumber } = useLocaleFormat();
    const { profile, isLoading, startLoadingProfile, startUpdatingProfile, startChangingPassword } =
        useUsersStore();
    const { startLogout } = useAuthStore();
    const { stats, startLoadingStats } = useCalendarStore();

    const { name, weight, height, birthDate, onInputChange } = useForm(
        profile ?? profileFormFields
    );

    const [nameTouched, setNameTouched] = useState(false);
    const nameError = nameTouched && !name;

    const [goalDraft, setGoalDraft] = useState(null);
    const [goalFeedback, setGoalFeedback] = useState(null);

    const [passwords, setPasswords] = useState(passwordFormFields);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [passwordFeedback, setPasswordFeedback] = useState(null);

    useEffect(() => {
        startLoadingProfile();
    }, [startLoadingProfile]);

    useEffect(() => {
        startLoadingStats();
    }, [startLoadingStats]);

    const savedGoal = profile?.defaultWeeklyGoal ? String(profile.defaultWeeklyGoal) : '';
    const defaultGoal = goalDraft ?? savedGoal;

    const currentBirthDate = birthDate?.split('T')[0] ?? '';
    const originalBirthDate = profile?.birthDate?.split('T')[0] ?? '';

    const hasChanges =
        name !== (profile?.name ?? '') ||
        Number(weight) !== Number(profile?.weight ?? 0) ||
        Number(height) !== Number(profile?.height ?? 0) ||
        currentBirthDate !== originalBirthDate;

    const hasGoalChanges = defaultGoal !== savedGoal;

    const { currentPassword, newPassword, confirmPassword } = passwords;
    const passwordMismatch = confirmPassword !== '' && newPassword !== confirmPassword;
    const canChangePassword =
        currentPassword !== '' &&
        newPassword.length >= 6 &&
        confirmPassword !== '' &&
        !passwordMismatch &&
        !isChangingPassword;

    const onSubmit = (event) => {
        event.preventDefault();
        startUpdatingProfile({ name, weight: Number(weight), height: Number(height), birthDate });
    };

    const onSubmitGoal = async (event) => {
        event.preventDefault();
        setGoalFeedback(null);
        const ok = await startUpdatingProfile({
            defaultWeeklyGoal: defaultGoal === '' ? null : Number(defaultGoal),
        });
        if (ok) {
            setGoalDraft(null);
            startLoadingStats();
            setGoalFeedback({ type: 'success', message: t('profile.goalSaved') });
        } else {
            setGoalFeedback({ type: 'error', message: t('profile.goalError') });
        }
    };

    const onPasswordChange = ({ target }) => {
        setPasswords((current) => ({ ...current, [target.name]: target.value }));
    };

    const onSubmitPassword = async (event) => {
        event.preventDefault();
        setPasswordFeedback(null);
        setIsChangingPassword(true);
        const result = await startChangingPassword(currentPassword, newPassword);
        setIsChangingPassword(false);
        if (result.ok) {
            setPasswords(passwordFormFields);
            setPasswordFeedback({ type: 'success', message: result.message });
        } else {
            setPasswordFeedback({ type: 'error', message: result.message });
        }
    };

    if (!profile) {
        return (
            <main className="app-page profile-page">
                <div className="app-page-container profile-page-container">
                    <LoadingState label={t('profile.loading')} />
                </div>
            </main>
        );
    }

    return (
        <main className="app-page profile-page">
            <div className="app-page-container profile-page-container">
                <PageHeader
                    eyebrow={t('profile.eyebrow')}
                    title={t('profile.title')}
                    subtitle={t('profile.subtitle')}
                />

                <div className="profile-summary">
                    <div className="profile-summary-item">
                        <strong>
                            {profile.createdAt ? formatMonthYear(new Date(profile.createdAt)) : '–'}
                        </strong>
                        <span>{t('profile.memberSince')}</span>
                    </div>
                    <div className="profile-summary-item">
                        <strong>{stats ? stats.totalSessions : '–'}</strong>
                        <span>{t('profile.totalSessions')}</span>
                    </div>
                    <div className="profile-summary-item">
                        <strong>
                            {stats
                                ? `${formatNumber(Math.round(stats.totalVolumeKg))} ${t('common.kg')}`
                                : '–'}
                        </strong>
                        <span>{t('profile.totalLifted')}</span>
                    </div>
                    <div className="profile-summary-item">
                        <strong>{stats ? stats.currentStreakWeeks : '–'}</strong>
                        <span>{t('profile.weekStreak')}</span>
                    </div>
                </div>

                <Card variant="surface">
                    <div className="profile-card-header">
                        <div className="profile-card-icon">
                            <i className="fas fa-user" />
                        </div>

                        <div>
                            <h2>{t('profile.personalTitle')}</h2>
                            <p>{t('profile.personalText')}</p>
                        </div>
                    </div>

                    <form className="profile-form" onSubmit={onSubmit}>
                        <FormField
                            id="name"
                            label={t('profile.name')}
                            value={name}
                            onChange={onInputChange}
                            onBlur={() => setNameTouched(true)}
                            error={nameError ? t('profile.nameRequired') : undefined}
                        />

                        <div className="profile-form-row">
                            <FormField
                                id="weight"
                                label={t('profile.weight')}
                                type="number"
                                name="weight"
                                value={weight ?? ''}
                                onChange={onInputChange}
                            />

                            <FormField
                                id="height"
                                label={t('profile.height')}
                                type="number"
                                step="0.01"
                                name="height"
                                value={height ?? ''}
                                onChange={onInputChange}
                            />
                        </div>

                        <FormField
                            id="birthDate"
                            label={t('profile.birthDate')}
                            type="date"
                            name="birthDate"
                            value={currentBirthDate}
                            onChange={onInputChange}
                        />

                        <div className="profile-form-actions">
                            <Button
                                type="submit"
                                variant="primary"
                                disabled={isLoading || !name || !hasChanges}
                            >
                                {isLoading ? (
                                    <>
                                        <span className="profile-button-spinner" />
                                        {t('common.saving')}
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-check" />
                                        {t('profile.saveChanges')}
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </Card>

                <div className="profile-section-gap">
                    <SectionLabel>{t('profile.trainingSection')}</SectionLabel>
                </div>

                <Card variant="surface">
                    <div className="profile-card-header">
                        <div className="profile-card-icon">
                            <i className="fas fa-bullseye" />
                        </div>

                        <div>
                            <h2>{t('profile.goalTitle')}</h2>
                            <p>{t('profile.goalText')}</p>
                        </div>
                    </div>

                    <form className="profile-form" onSubmit={onSubmitGoal}>
                        <FormField
                            id="defaultWeeklyGoal"
                            label={t('profile.defaultGoal')}
                            as="select"
                            value={defaultGoal}
                            onChange={(event) => setGoalDraft(event.target.value)}
                        >
                            <option value="">{t('profile.noDefault')}</option>
                            {[1, 2, 3, 4, 5, 6, 7].map((days) => (
                                <option key={days} value={days}>
                                    {t('profile.daysPerWeek', { count: days })}
                                </option>
                            ))}
                        </FormField>

                        <p className="profile-hint">{t('profile.goalHint')}</p>

                        {goalFeedback && (
                            <p
                                className={`profile-feedback profile-feedback-${goalFeedback.type}`}
                                role="status"
                            >
                                {goalFeedback.message}
                            </p>
                        )}

                        <div className="profile-form-actions">
                            <Button
                                type="submit"
                                variant="primary"
                                disabled={isLoading || !hasGoalChanges}
                            >
                                <i className="fas fa-check" />
                                {t('profile.saveGoal')}
                            </Button>
                        </div>
                    </form>
                </Card>

                <div className="profile-section-gap">
                    <SectionLabel>{t('profile.accountSection')}</SectionLabel>
                </div>

                <div className="profile-stack">
                    <Card variant="surface">
                        <div className="profile-card-header">
                            <div className="profile-card-icon">
                                <i className="fas fa-lock" />
                            </div>

                            <div>
                                <h2>{t('profile.passwordTitle')}</h2>
                                <p>{t('profile.passwordText')}</p>
                            </div>
                        </div>

                        <form className="profile-form" onSubmit={onSubmitPassword}>
                            <FormField
                                id="currentPassword"
                                label={t('profile.currentPassword')}
                                type="password"
                                name="currentPassword"
                                autoComplete="current-password"
                                value={currentPassword}
                                onChange={onPasswordChange}
                            />

                            <div className="profile-form-row">
                                <FormField
                                    id="newPassword"
                                    label={t('profile.newPassword')}
                                    type="password"
                                    name="newPassword"
                                    autoComplete="new-password"
                                    value={newPassword}
                                    onChange={onPasswordChange}
                                />

                                <FormField
                                    id="confirmPassword"
                                    label={t('profile.repeatNewPassword')}
                                    type="password"
                                    name="confirmPassword"
                                    autoComplete="new-password"
                                    value={confirmPassword}
                                    onChange={onPasswordChange}
                                    error={
                                        passwordMismatch ? t('profile.passwordMismatch') : undefined
                                    }
                                />
                            </div>

                            {passwordFeedback && (
                                <p
                                    className={`profile-feedback profile-feedback-${passwordFeedback.type}`}
                                    role="status"
                                >
                                    {passwordFeedback.message}
                                </p>
                            )}

                            <div className="profile-form-actions">
                                <Button
                                    type="submit"
                                    variant="primary"
                                    disabled={!canChangePassword}
                                >
                                    {isChangingPassword ? (
                                        <>
                                            <span className="profile-button-spinner" />
                                            {t('profile.updating')}
                                        </>
                                    ) : (
                                        <>
                                            <i className="fas fa-check" />
                                            {t('profile.updatePassword')}
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </Card>

                    <Card variant="surface">
                        <div className="profile-card-header">
                            <div className="profile-card-icon profile-card-icon-danger">
                                <i className="fas fa-sign-out-alt" />
                            </div>

                            <div>
                                <h2>{t('profile.sessionTitle')}</h2>
                                <p>{t('profile.sessionText')}</p>
                            </div>
                        </div>

                        <Button variant="danger" onClick={startLogout}>
                            <i className="fas fa-sign-out-alt"></i>
                            {t('profile.logout')}
                        </Button>
                    </Card>
                </div>
            </div>
        </main>
    );
};
