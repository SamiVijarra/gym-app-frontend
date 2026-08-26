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
            Swal.fire('Error en registro', 'Las contraseñas deben ser iguales', 'error');
            return;
        }
        startRegister({ name: registerName, email: registerEmail, password: registerPassword });
    };

    useEffect(() => {
        if (errorMessage !== undefined) {
            Swal.fire('Error en la autenticación', errorMessage, 'error');
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
                        Tu entrenamiento,
                        <br />
                        bajo control.
                    </h1>

                    <p>Organizá tus rutinas, registrá tus ejercicios y seguí tu progreso.</p>
                </header>

                <div className="auth-card">
                    {/* LOGIN */}

                    <section className="auth-form-section">
                        <div className="auth-section-header">
                            <div className="auth-section-icon">
                                <i className="fas fa-sign-in-alt" />
                            </div>

                            <div>
                                <span className="auth-section-label">BIENVENIDO</span>

                                <h2>Ingresá a tu cuenta</h2>
                            </div>
                        </div>

                        <form onSubmit={loginSubmit}>
                            <div className="auth-form-field">
                                <label htmlFor="loginEmail">Correo electrónico</label>

                                <div className="auth-input-wrapper">
                                    <i className="fas fa-envelope" />

                                    <input
                                        id="loginEmail"
                                        type="email"
                                        placeholder="tu@email.com"
                                        name="loginEmail"
                                        value={loginEmail}
                                        onChange={onLoginInputChange}
                                    />
                                </div>
                            </div>

                            <div className="auth-form-field">
                                <label htmlFor="loginPassword">Contraseña</label>

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
                                Ingresar
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
                                <span className="auth-section-label">NUEVO ACÁ</span>

                                <h2>Creá tu cuenta</h2>
                            </div>
                        </div>

                        <form onSubmit={registerSubmit}>
                            <div className="auth-form-field">
                                <label htmlFor="registerName">Nombre</label>

                                <div className="auth-input-wrapper">
                                    <i className="fas fa-user" />

                                    <input
                                        id="registerName"
                                        type="text"
                                        placeholder="Tu nombre"
                                        name="registerName"
                                        value={registerName}
                                        onChange={onRegisterInputChange}
                                    />
                                </div>
                            </div>

                            <div className="auth-form-field">
                                <label htmlFor="registerEmail">Correo electrónico</label>

                                <div className="auth-input-wrapper">
                                    <i className="fas fa-envelope" />

                                    <input
                                        id="registerEmail"
                                        type="email"
                                        placeholder="tu@email.com"
                                        name="registerEmail"
                                        value={registerEmail}
                                        onChange={onRegisterInputChange}
                                    />
                                </div>
                            </div>

                            <div className="auth-form-row">
                                <div className="auth-form-field">
                                    <label htmlFor="registerPassword">Contraseña</label>

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
                                    <label htmlFor="registerPassword2">Repetir contraseña</label>

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
                                Crear cuenta
                                <i className="fas fa-user-plus" />
                            </button>
                        </form>
                    </section>
                </div>

                <footer className="auth-footer">
                    <i className="fas fa-shield-alt" />
                    Tus datos están protegidos
                </footer>
            </div>
        </main>
    );
};
