import { useEffect, useState } from 'react';
import { useAuthStore, useCalendarStore, useForm, useUsersStore } from '../../hooks';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { FormField } from '../../components/FormField';
import { PageHeader } from '../../components/PageHeader';
import { SectionLabel } from '../../components/SectionLabel';
import { LoadingState } from '../../components/LoadingState';

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

const formatMemberSince = (createdAt) =>
    createdAt
        ? new Date(createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
        : '–';

export const ProfilePage = () => {
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
            setGoalFeedback({ type: 'success', message: 'Your default weekly goal was saved.' });
        } else {
            setGoalFeedback({ type: 'error', message: 'The default goal could not be saved.' });
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
                    <LoadingState label="Loading profile..." />
                </div>
            </main>
        );
    }

    return (
        <main className="app-page profile-page">
            <div className="app-page-container profile-page-container">
                <PageHeader
                    eyebrow="PROFILE"
                    title="My profile"
                    subtitle="Manage your personal information and keep your data up to date."
                />

                <div className="profile-summary">
                    <div className="profile-summary-item">
                        <strong>{formatMemberSince(profile.createdAt)}</strong>
                        <span>Member since</span>
                    </div>
                    <div className="profile-summary-item">
                        <strong>{stats ? stats.totalSessions : '–'}</strong>
                        <span>Total sessions</span>
                    </div>
                    <div className="profile-summary-item">
                        <strong>
                            {stats ? `${Math.round(stats.totalVolumeKg).toLocaleString()} kg` : '–'}
                        </strong>
                        <span>Total lifted</span>
                    </div>
                    <div className="profile-summary-item">
                        <strong>{stats ? stats.currentStreakWeeks : '–'}</strong>
                        <span>Week streak</span>
                    </div>
                </div>

                <Card variant="surface">
                    <div className="profile-card-header">
                        <div className="profile-card-icon">
                            <i className="fas fa-user" />
                        </div>

                        <div>
                            <h2>Personal information</h2>
                            <p>Manage your personal information.</p>
                        </div>
                    </div>

                    <form className="profile-form" onSubmit={onSubmit}>
                        <FormField
                            id="name"
                            label="Name"
                            value={name}
                            onChange={onInputChange}
                            onBlur={() => setNameTouched(true)}
                            error={nameError ? 'Name is required.' : undefined}
                        />

                        <div className="profile-form-row">
                            <FormField
                                id="weight"
                                label="Weight (kg)"
                                type="number"
                                name="weight"
                                value={weight ?? ''}
                                onChange={onInputChange}
                            />

                            <FormField
                                id="height"
                                label="Height (m)"
                                type="number"
                                step="0.01"
                                name="height"
                                value={height ?? ''}
                                onChange={onInputChange}
                            />
                        </div>

                        <FormField
                            id="birthDate"
                            label="Birth date"
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
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-check" />
                                        Save changes
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </Card>

                <div className="profile-section-gap">
                    <SectionLabel>TRAINING</SectionLabel>
                </div>

                <Card variant="surface">
                    <div className="profile-card-header">
                        <div className="profile-card-icon">
                            <i className="fas fa-bullseye" />
                        </div>

                        <div>
                            <h2>Weekly goal</h2>
                            <p>Your usual number of training days per week.</p>
                        </div>
                    </div>

                    <form className="profile-form" onSubmit={onSubmitGoal}>
                        <FormField
                            id="defaultWeeklyGoal"
                            label="Default weekly goal"
                            as="select"
                            value={defaultGoal}
                            onChange={(event) => setGoalDraft(event.target.value)}
                        >
                            <option value="">No default</option>
                            {[1, 2, 3, 4, 5, 6, 7].map((days) => (
                                <option key={days} value={days}>
                                    {days} {days === 1 ? 'day' : 'days'} per week
                                </option>
                            ))}
                        </FormField>

                        <p className="profile-hint">
                            It applies to every week where you have not set a specific goal in the
                            calendar, and it counts toward your streak.
                        </p>

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
                                Save goal
                            </Button>
                        </div>
                    </form>
                </Card>

                <div className="profile-section-gap">
                    <SectionLabel>ACCOUNT</SectionLabel>
                </div>

                <div className="profile-stack">
                    <Card variant="surface">
                        <div className="profile-card-header">
                            <div className="profile-card-icon">
                                <i className="fas fa-lock" />
                            </div>

                            <div>
                                <h2>Password</h2>
                                <p>Use at least 6 characters, with upper and lower case letters.</p>
                            </div>
                        </div>

                        <form className="profile-form" onSubmit={onSubmitPassword}>
                            <FormField
                                id="currentPassword"
                                label="Current password"
                                type="password"
                                name="currentPassword"
                                autoComplete="current-password"
                                value={currentPassword}
                                onChange={onPasswordChange}
                            />

                            <div className="profile-form-row">
                                <FormField
                                    id="newPassword"
                                    label="New password"
                                    type="password"
                                    name="newPassword"
                                    autoComplete="new-password"
                                    value={newPassword}
                                    onChange={onPasswordChange}
                                />

                                <FormField
                                    id="confirmPassword"
                                    label="Repeat new password"
                                    type="password"
                                    name="confirmPassword"
                                    autoComplete="new-password"
                                    value={confirmPassword}
                                    onChange={onPasswordChange}
                                    error={
                                        passwordMismatch ? 'The passwords do not match.' : undefined
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
                                            Updating...
                                        </>
                                    ) : (
                                        <>
                                            <i className="fas fa-check" />
                                            Update password
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
                                <h2>Session</h2>
                                <p>Sign out of your account on this device.</p>
                            </div>
                        </div>

                        <Button variant="danger" onClick={startLogout}>
                            <i className="fas fa-sign-out-alt"></i>
                            Log out
                        </Button>
                    </Card>
                </div>
            </div>
        </main>
    );
};
