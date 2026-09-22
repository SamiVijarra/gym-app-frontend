import { useEffect, useState } from 'react';
import { useAuthStore, useForm, useUsersStore } from '../../hooks';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';

const profileFormFields = {
    name: '',
    weight: '',
    height: '',
    birthDate: '',
};

export const ProfilePage = () => {
    const { profile, isLoading, startLoadingProfile, startUpdatingProfile } = useUsersStore();
    const { startLogout } = useAuthStore();

    const { name, weight, height, birthDate, onInputChange } = useForm(
        profile ?? profileFormFields
    );

    const [nameTouched, setNameTouched] = useState(false);
    const nameError = nameTouched && !name;

    useEffect(() => {
        startLoadingProfile();
    }, []);

    const currentBirthDate = birthDate?.split('T')[0] ?? '';
    const originalBirthDate = profile?.birthDate?.split('T')[0] ?? '';

    const hasChanges =
        name !== (profile?.name ?? '') ||
        Number(weight) !== Number(profile?.weight ?? 0) ||
        Number(height) !== Number(profile?.height ?? 0) ||
        currentBirthDate !== originalBirthDate;

    const onSubmit = (event) => {
        event.preventDefault();
        startUpdatingProfile({ name, weight: Number(weight), height: Number(height), birthDate });
    };

    if (!profile) {
        return (
            <main className="app-page profile-page">
                <div className="app-page-container profile-page-container">
                    <div className="profile-page-loading">
                        <div className="profile-loading-spinner" />
                        <span>Loading profile...</span>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="app-page profile-page">
            <div className="app-page-container profile-page-container">
                <header className="app-page-header profile-page-header">
                    <span className="app-page-eyebrow profile-page-eyebrow">PROFILE</span>

                    <h1 className="app-page-title">My profile</h1>

                    <p className="app-page-subtitle">
                        Manage your personal information and keep your data up to date.
                    </p>
                </header>

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
                        <div className="profile-form-field profile-form-field-full">
                            <label htmlFor="name">Name</label>

                            <input
                                id="name"
                                className={
                                    nameError
                                        ? 'profile-form-input input-invalid'
                                        : 'profile-form-input'
                                }
                                name="name"
                                value={name}
                                onChange={onInputChange}
                                onBlur={() => setNameTouched(true)}
                            />
                            {nameError && (
                                <span className="field-error-text">Name is required.</span>
                            )}
                        </div>

                        <div className="profile-form-row">
                            <div className="profile-form-field">
                                <label htmlFor="weight">Weight (kg)</label>

                                <input
                                    id="weight"
                                    className="profile-form-input"
                                    type="number"
                                    name="weight"
                                    value={weight}
                                    onChange={onInputChange}
                                />
                            </div>

                            <div className="profile-form-field">
                                <label htmlFor="height">Height (m)</label>

                                <input
                                    id="height"
                                    className="profile-form-input"
                                    type="number"
                                    step="0.01"
                                    name="height"
                                    value={height}
                                    onChange={onInputChange}
                                />
                            </div>
                        </div>

                        <div className="profile-form-field profile-form-field-full">
                            <label htmlFor="birthDate">Birth date</label>

                            <input
                                id="birthDate"
                                className="profile-form-input"
                                type="date"
                                name="birthDate"
                                value={currentBirthDate}
                                onChange={onInputChange}
                            />
                        </div>

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

                <div className="profile-section-header">
                    <span>ACCOUNT</span>
                </div>

                <section className="profile-card">
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
                </section>
            </div>
        </main>
    );
};
