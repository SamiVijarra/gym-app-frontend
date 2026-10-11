import { useEffect } from 'react';
import { useForm, useAuthStore } from '../../hooks';
import Swal from 'sweetalert2';
import { ThemeToggle } from '../../components/ThemeToggle';
import { Button } from '../../components/Button';
import { useTranslation } from 'react-i18next';
import { LanguageSelector } from '../../components/LanguageSelector';

const loginFormField = {
    loginEmail: '',
    loginPassword: '',
};

const registerFormField = {
    registerName: '',
    registerEmail: '',
    registerPassword: '',
    registerPassword2: '',
};

export const LoginPage = () => {
    const { t } = useTranslation();
    const { startLogin, errorMessage, startRegister } = useAuthStore();
    const {
        loginEmail,
        loginPassword,
        onInputChange: onLoginInputChange,
    } = useForm(loginFormField);
    const {
        registerName,
        registerEmail,
        registerPassword,
        registerPassword2,
        onInputChange: onRegisterInputChange,
    } = useForm(registerFormField);

    const passwordsMismatch =
        registerPassword2.length > 0 && registerPassword !== registerPassword2;

    const loginSubmit = (event) => {
        event.preventDefault();
        startLogin({ email: loginEmail, password: loginPassword });
    };

    const registerSubmit = (event) => {
        event.preventDefault();
        if (passwordsMismatch) return;
        startRegister({ name: registerName, email: registerEmail, password: registerPassword });
    };

    useEffect(() => {
        if (errorMessage !== undefined) {
            Swal.fire(t('auth.errorTitle'), errorMessage, 'error');
        }
    }, [errorMessage, t]);

    return (
        <main className="auth-page">
            <div className="auth-theme-toggle">
                <LanguageSelector />
                <ThemeToggle />
            </div>

            <div className="auth-container">
                <header className="auth-header">
                    <div className="auth-logo">
                        <i className="fas fa-dumbbell" />
                    </div>

                    <span className="auth-eyebrow">GYM TRACKER</span>

                    <h1>
                        {t('auth.headlineTop')}
                        <br />
                        {t('auth.headlineBottom')}
                    </h1>

                    <p>{t('auth.tagline')}</p>
                </header>

                <div className="auth-card">
                    {/* LOGIN */}

                    <section className="auth-form-section">
                        <div className="auth-section-header">
                            <div className="auth-section-icon">
                                <i className="fas fa-sign-in-alt" />
                            </div>

                            <div>
                                <span className="auth-section-label">{t('auth.welcome')}</span>

                                <h2>{t('auth.loginTitle')}</h2>
                            </div>
                        </div>

                        <form onSubmit={loginSubmit}>
                            <div className="auth-form-field">
                                <label htmlFor="loginEmail">{t('auth.email')}</label>

                                <div className="auth-input-wrapper">
                                    <i className="fas fa-envelope" />

                                    <input
                                        id="loginEmail"
                                        type="email"
                                        placeholder={t('auth.emailPlaceholder')}
                                        name="loginEmail"
                                        value={loginEmail}
                                        onChange={onLoginInputChange}
                                    />
                                </div>
                            </div>

                            <div className="auth-form-field">
                                <label htmlFor="loginPassword">{t('auth.password')}</label>

                                <div className="auth-input-wrapper">
                                    <i className="fas fa-lock" />

                                    <input
                                        id="loginPassword"
                                        type="password"
                                        placeholder="••••••••"
                                        name="loginPassword"
                                        value={loginPassword}
                                        onChange={onLoginInputChange}
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                variant="primary"
                                fullWidth
                                disabled={!loginEmail || !loginPassword}
                            >
                                {t('auth.login')}
                                <i className="fas fa-arrow-right" />
                            </Button>
                        </form>
                    </section>

                    <div className="auth-divider">
                        <span>{t('auth.or')}</span>
                    </div>

                    {/* REGISTER */}

                    <section className="auth-form-section">
                        <div className="auth-section-header">
                            <div className="auth-section-icon">
                                <i className="fas fa-user-plus" />
                            </div>

                            <div>
                                <span className="auth-section-label">{t('auth.newHere')}</span>

                                <h2>{t('auth.createTitle')}</h2>
                            </div>
                        </div>

                        <form onSubmit={registerSubmit}>
                            <div className="auth-form-field">
                                <label htmlFor="registerName">{t('auth.name')}</label>

                                <div className="auth-input-wrapper">
                                    <i className="fas fa-user" />

                                    <input
                                        id="registerName"
                                        type="text"
                                        placeholder={t('auth.namePlaceholder')}
                                        name="registerName"
                                        value={registerName}
                                        onChange={onRegisterInputChange}
                                    />
                                </div>
                            </div>

                            <div className="auth-form-field">
                                <label htmlFor="registerEmail">{t('auth.email')}</label>

                                <div className="auth-input-wrapper">
                                    <i className="fas fa-envelope" />

                                    <input
                                        id="registerEmail"
                                        type="email"
                                        placeholder={t('auth.emailPlaceholder')}
                                        name="registerEmail"
                                        value={registerEmail}
                                        onChange={onRegisterInputChange}
                                    />
                                </div>
                            </div>

                            <div className="auth-form-row">
                                <div className="auth-form-field">
                                    <label htmlFor="registerPassword">{t('auth.password')}</label>

                                    <div className="auth-input-wrapper">
                                        <i className="fas fa-lock" />

                                        <input
                                            id="registerPassword"
                                            type="password"
                                            placeholder="••••••••"
                                            name="registerPassword"
                                            value={registerPassword}
                                            onChange={onRegisterInputChange}
                                        />
                                    </div>
                                </div>

                                <div className="auth-form-field">
                                    <label htmlFor="registerPassword2">
                                        {t('auth.repeatPassword')}
                                    </label>

                                    <div className="auth-input-wrapper">
                                        <i className="fas fa-lock" />

                                        <input
                                            id="registerPassword2"
                                            type="password"
                                            placeholder="••••••••"
                                            name="registerPassword2"
                                            value={registerPassword2}
                                            onChange={onRegisterInputChange}
                                            className={passwordsMismatch ? 'input-invalid' : ''}
                                        />
                                    </div>
                                    {passwordsMismatch && (
                                        <span className="field-error-text">
                                            {t('auth.mismatch')}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <Button
                                type="submit"
                                variant="secondary"
                                fullWidth
                                disabled={
                                    !registerName ||
                                    !registerEmail ||
                                    !registerPassword ||
                                    !registerPassword2 ||
                                    passwordsMismatch
                                }
                            >
                                {t('auth.createAccount')}
                                <i className="fas fa-user-plus" />
                            </Button>
                        </form>
                    </section>
                </div>

                <footer className="auth-footer">
                    <i className="fas fa-shield-alt" />
                    {t('auth.protected')}
                </footer>
            </div>
        </main>
    );
};
