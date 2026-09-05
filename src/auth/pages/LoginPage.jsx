import { useEffect } from 'react';
import { useForm, useAuthStore } from '../../hooks';
import Swal from 'sweetalert2';
import { ThemeToggle } from '../../components/ThemeToggle';

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

    const loginSubmit = (event) => {
        event.preventDefault();
        startLogin({ email: loginEmail, password: loginPassword });
    };

    const registerSubmit = (event) => {
        event.preventDefault();
        if (registerPassword !== registerPassword2) {
            Swal.fire('Login error', 'Passwords must match', 'error');
            return;
        }
        startRegister({ name: registerName, email: registerEmail, password: registerPassword });
    };

    useEffect(() => {
        if (errorMessage !== undefined) {
            Swal.fire('Error in authentication', errorMessage, 'error');
        }
    }, [errorMessage]);

    return (
        <main className="auth-page">
            <div className="auth-theme-toggle">
                <ThemeToggle />
            </div>

            <div className="auth-container">
                <header className="auth-header">
                    <div className="auth-logo">
                        <i className="fas fa-dumbbell" />
                    </div>

                    <span className="auth-eyebrow">GYM TRACKER</span>

                    <h1>
                        Your training,
                        <br />
                        under control.
                    </h1>

                    <p>Organize your routines, record your exercises and track your progress.</p>
                </header>

                <div className="auth-card">
                    {/* LOGIN */}

                    <section className="auth-form-section">
                        <div className="auth-section-header">
                            <div className="auth-section-icon">
                                <i className="fas fa-sign-in-alt" />
                            </div>

                            <div>
                                <span className="auth-section-label">WELCOME</span>

                                <h2>Login to your account</h2>
                            </div>
                        </div>

                        <form onSubmit={loginSubmit}>
                            <div className="auth-form-field">
                                <label htmlFor="loginEmail">Email address</label>

                                <div className="auth-input-wrapper">
                                    <i className="fas fa-envelope" />

                                    <input
                                        id="loginEmail"
                                        type="email"
                                        placeholder="your@email.com"
                                        name="loginEmail"
                                        value={loginEmail}
                                        onChange={onLoginInputChange}
                                    />
                                </div>
                            </div>

                            <div className="auth-form-field">
                                <label htmlFor="loginPassword">Password</label>

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

                            <button
                                type="submit"
                                className="auth-submit-button auth-submit-primary"
                            >
                                Login
                                <i className="fas fa-arrow-right" />
                            </button>
                        </form>
                    </section>

                    <div className="auth-divider">
                        <span>O</span>
                    </div>

                    {/* REGISTER */}

                    <section className="auth-form-section">
                        <div className="auth-section-header">
                            <div className="auth-section-icon">
                                <i className="fas fa-user-plus" />
                            </div>

                            <div>
                                <span className="auth-section-label">NEW HERE</span>

                                <h2>Create your account</h2>
                            </div>
                        </div>

                        <form onSubmit={registerSubmit}>
                            <div className="auth-form-field">
                                <label htmlFor="registerName">Name</label>

                                <div className="auth-input-wrapper">
                                    <i className="fas fa-user" />

                                    <input
                                        id="registerName"
                                        type="text"
                                        placeholder="Your name"
                                        name="registerName"
                                        value={registerName}
                                        onChange={onRegisterInputChange}
                                    />
                                </div>
                            </div>

                            <div className="auth-form-field">
                                <label htmlFor="registerEmail">Email address</label>

                                <div className="auth-input-wrapper">
                                    <i className="fas fa-envelope" />

                                    <input
                                        id="registerEmail"
                                        type="email"
                                        placeholder="your@email.com"
                                        name="registerEmail"
                                        value={registerEmail}
                                        onChange={onRegisterInputChange}
                                    />
                                </div>
                            </div>

                            <div className="auth-form-row">
                                <div className="auth-form-field">
                                    <label htmlFor="registerPassword">Password</label>

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
                                    <label htmlFor="registerPassword2">Repeat password</label>

                                    <div className="auth-input-wrapper">
                                        <i className="fas fa-lock" />

                                        <input
                                            id="registerPassword2"
                                            type="password"
                                            placeholder="••••••••"
                                            name="registerPassword2"
                                            value={registerPassword2}
                                            onChange={onRegisterInputChange}
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="auth-submit-button auth-submit-secondary"
                            >
                                Create account
                                <i className="fas fa-user-plus" />
                            </button>
                        </form>
                    </section>
                </div>

                <footer className="auth-footer">
                    <i className="fas fa-shield-alt" />
                    Your data is protected
                </footer>
            </div>
        </main>
    );
};
