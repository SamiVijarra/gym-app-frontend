import { useEffect, useState } from 'react';
import { useAuthStore, useForm, useUsersStore } from '../../hooks';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { FormField } from '../../components/FormField';
import { PageHeader } from '../../components/PageHeader';
import { SectionLabel } from '../../components/SectionLabel';

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
                <PageHeader
                    eyebrow="PROFILE"
                    title="My profile"
                    subtitle="Manage your personal information and keep your data up to date."
                />

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
                        />
                        {nameError && <span className="field-error-text">Name is required.</span>}

                        <div className="profile-form-row">
                            <FormField
                                id="weight"
                                label="Weight (kg)"
                                name="weight"
                                value={weight}
                                onChange={onInputChange}
                            />

                            <FormField
                                id="height"
                                label="Height (m)"
                                type="number"
                                step="0.01"
                                name="height"
                                value={height}
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

                <SectionLabel>ACCOUNT</SectionLabel>

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
