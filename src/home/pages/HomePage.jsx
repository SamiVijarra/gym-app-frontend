import { Link } from 'react-router-dom';
import { useAuthStore } from '../../hooks';

export const HomePage = () => {
    const { user } = useAuthStore();

    return (
        <main className="app-page home-page">
            <div className="app-page-container home-container">
                <header className="app-page-header home-header">
                    <span className="app-page-eyebrow home-eyebrow">GYM TRACKER</span>

                    <h1 className="app-page-title">Hi, {user.name}!</h1>

                    <p className="app-page-subtitle">All set to track your progress.</p>
                </header>

                <section className="home-featured">
                    <div className="home-featured-content">
                        <span className="home-card-label">YOUR TRAINING</span>

                        <h2>Training Routine</h2>

                        <p>Access your routines and start your workout.</p>

                        <Link to="/routine" className="home-primary-action">
                            View routines
                            <span>→</span>
                        </Link>
                    </div>

                    <div className="home-featured-icon">
                        <i className="fas fa-dumbbell"></i>
                    </div>
                </section>

                <section className="home-section">
                    <div className="home-section-header">
                        <span>QUICK ACCESS</span>
                    </div>

                    <div className="home-quick-grid">
                        <Link to="/routine" className="home-quick-card">
                            <div className="home-quick-icon">
                                <i className="fas fa-calendar-alt"></i>
                            </div>

                            <div>
                                <h3>Routines</h3>
                                <p>View your workouts</p>
                            </div>

                            <span className="home-quick-arrow">→</span>
                        </Link>

                        <Link to="/exercises" className="home-quick-card">
                            <div className="home-quick-icon">
                                <i className="fas fa-dumbbell"></i>
                            </div>

                            <div>
                                <h3>Exercises</h3>
                                <p>Explore exercises</p>
                            </div>

                            <span className="home-quick-arrow">→</span>
                        </Link>

                        <Link to="/profile" className="home-quick-card">
                            <div className="home-quick-icon">
                                <i className="fas fa-user"></i>
                            </div>

                            <div>
                                <h3>My profile</h3>
                                <p>View your information</p>
                            </div>

                            <span className="home-quick-arrow">→</span>
                        </Link>
                        <Link to="/calendar" className="home-quick-card">
                            <div className="home-quick-icon">
                                <i className="fas fa-calendar-check"></i>
                            </div>

                            <div>
                                <h3>Calendar</h3>
                                <p>Plan & view history</p>
                            </div>

                            <span className="home-quick-arrow">→</span>
                        </Link>
                    </div>
                </section>
            </div>
        </main>
    );
};
