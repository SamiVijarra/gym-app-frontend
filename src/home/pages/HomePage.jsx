import { Link } from 'react-router-dom';
import { useAuthStore } from '../../hooks';

export const HomePage = () => {
    const { user } = useAuthStore();

    return (
        <main className="home-page">
            <div className="home-container">
                <header className="home-header">
                    <span className="home-eyebrow">GYM TRACKER</span>

                    <h1>Hola, {user.name}</h1>

                    <p>Todo listo para seguir tu progreso.</p>
                </header>

                <section className="home-featured">
                    <div className="home-featured-content">
                        <span className="home-card-label">TU ENTRENAMIENTO</span>

                        <h2>Rutina de entrenamiento</h2>

                        <p>Accedé a tus rutinas y comenzá tu entrenamiento.</p>

                        <Link to="/routine" className="home-primary-action">
                            Ver rutinas
                            <span>→</span>
                        </Link>
                    </div>

                    <div className="home-featured-icon">
                        <i className="fas fa-dumbbell"></i>
                    </div>
                </section>

                <section className="home-section">
                    <div className="home-section-header">
                        <span>ACCESO RÁPIDO</span>
                    </div>

                    <div className="home-quick-grid">
                        <Link to="/routine" className="home-quick-card">
                            <div className="home-quick-icon">
                                <i className="fas fa-calendar-alt"></i>
                            </div>

                            <div>
                                <h3>Rutinas</h3>
                                <p>Ver tus entrenamientos</p>
                            </div>

                            <span className="home-quick-arrow">→</span>
                        </Link>

                        <Link to="/exercises" className="home-quick-card">
                            <div className="home-quick-icon">
                                <i className="fas fa-dumbbell"></i>
                            </div>

                            <div>
                                <h3>Ejercicios</h3>
                                <p>Explorar ejercicios</p>
                            </div>

                            <span className="home-quick-arrow">→</span>
                        </Link>

                        <Link to="/profile" className="home-quick-card">
                            <div className="home-quick-icon">
                                <i className="fas fa-user"></i>
                            </div>

                            <div>
                                <h3>Mi perfil</h3>
                                <p>Ver tu información</p>
                            </div>

                            <span className="home-quick-arrow">→</span>
                        </Link>
                    </div>
                </section>
            </div>
        </main>
    );
};
