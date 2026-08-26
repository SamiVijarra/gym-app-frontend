import { useEffect } from 'react';
import { useForm, useUsersStore } from '../../hooks';
import { Navbar } from '../../components/Navbar';

const profileFormFields = {
    name: '',
    weight: '',
    height: '',
    birthDate: '',
};

export const ProfilePage = () => {
    const { profile, isLoading, startLoadingProfile, startUpdatingProfile } = useUsersStore();

    const { name, weight, height, birthDate, onInputChange } = useForm(
        profile ?? profileFormFields
    );

    useEffect(() => {
        startLoadingProfile();
    }, []);

    const onSubmit = (event) => {
        event.preventDefault();
        startUpdatingProfile({ name, weight: Number(weight), height: Number(height), birthDate });
    };

    if (!profile) {
        return (
            <>
                <Navbar />

                <main className="app-page profile-page">
                    <div className="app-page-container profile-page-container">
                        <div className="profile-page-loading">
                            <div className="profile-loading-spinner" />
                            <span>Cargando perfil...</span>
                        </div>
                    </div>
                </main>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <main className="app-page profile-page">
                <div className="app-page-container profile-page-container">
                    <header className="app-page-header profile-page-header">
                        <span className="app-page-eyebrow profile-page-eyebrow">PERFIL</span>

                        <h1 className="app-page-title">Mi perfil</h1>

                        <p className="app-page-subtitle">Administrá tu información personal y mantené tus datos actualizados.</p>
                    </header>

                    <section className="profile-card">
                        <div className="profile-card-header">
                            <div className="profile-card-icon">
                                <i className="fas fa-user" />
                            </div>

                            <div>
                                <h2>Información personal</h2>
                                <p>Actualizá los datos de tu perfil.</p>
                            </div>
                        </div>

                        <form className="profile-form" onSubmit={onSubmit}>
                            <div className="profile-form-field profile-form-field-full">
                                <label htmlFor="name">Nombre</label>

                                <input
                                    id="name"
                                    className="profile-form-input"
                                    name="name"
                                    value={name}
                                    onChange={onInputChange}
                                />
                            </div>

                            <div className="profile-form-row">
                                <div className="profile-form-field">
                                    <label htmlFor="weight">Peso (kg)</label>

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
                                    <label htmlFor="height">Estatura (m)</label>

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
                                <label htmlFor="birthDate">Fecha de nacimiento</label>

                                <input
                                    id="birthDate"
                                    className="profile-form-input"
                                    type="date"
                                    name="birthDate"
                                    value={birthDate?.split('T')[0] ?? ''}
                                    onChange={onInputChange}
                                />
                            </div>

                            <div className="profile-form-actions">
                                <button
                                    className="profile-save-button"
                                    type="submit"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <span className="profile-button-spinner" />
                                            Guardando...
                                        </>
                                    ) : (
                                        <>
                                            <i className="fas fa-check" />
                                            Guardar cambios
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </section>
                </div>
            </main>
        </>
    );
};
