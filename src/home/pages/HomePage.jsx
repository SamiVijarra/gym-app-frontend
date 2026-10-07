import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore, useCalendarStore } from '../../hooks';
import { PageHeader } from '../../components/PageHeader';
import { SectionLabel } from '../../components/SectionLabel';
import { MuscleGroupStats } from '../../calendar/components/MuscleGroupStats';

const QUICK_LINKS = [
    { to: '/routine', label: 'Routines', icon: 'fa-calendar-alt' },
    { to: '/exercises', label: 'Exercises', icon: 'fa-dumbbell' },
    { to: '/profile', label: 'Profile', icon: 'fa-user' },
    { to: '/calendar', label: 'Calendar', icon: 'fa-calendar-check' },
];

export const HomePage = () => {
    const { user } = useAuthStore();
    const { stats, muscleGroupStats, startLoadingStats, startLoadingMuscleGroupStats } =
        useCalendarStore();

    useEffect(() => {
        startLoadingStats();
        startLoadingMuscleGroupStats();
    }, [startLoadingStats, startLoadingMuscleGroupStats]);

    return (
        <main className="app-page home-page">
            <div className="app-page-container home-container">
                <PageHeader
                    eyebrow="GYM TRACKER"
                    title={`Hi, ${user.name}!`}
                    subtitle="All set to track your progress."
                />

                <section className="home-banner">
                    <div className="home-banner-icon">
                        <i className="fas fa-dumbbell"></i>
                    </div>

                    <div className="home-banner-text">
                        <span className="home-card-label">YOUR TRAINING</span>
                        <h2>Training Routine</h2>
                        <p>Open your routines and start your workout.</p>
                    </div>

                    <Link to="/routine" className="home-primary-action">
                        View routines
                        <span>→</span>
                    </Link>
                </section>

                <nav className="home-quick-grid" aria-label="Quick access">
                    {QUICK_LINKS.map((link) => (
                        <Link key={link.to} to={link.to} className="home-quick-tile">
                            <i className={`fas ${link.icon}`}></i>
                            {link.label}
                        </Link>
                    ))}
                </nav>

                <section className="home-section">
                    <SectionLabel>YOUR PROGRESS</SectionLabel>

                    <div className="home-stats-grid">
                        <div className="home-stat-card">
                            <div className="home-stat-icon">
                                <i className="fas fa-calendar-check"></i>
                            </div>
                            <div>
                                <strong>{stats ? stats.monthSessionsCompleted : '–'}</strong>
                                <span>Sessions this month</span>
                                {stats && (
                                    <p className="home-stat-sub">
                                        {stats.monthActiveDays}{' '}
                                        {stats.monthActiveDays === 1 ? 'active day' : 'active days'}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="home-stat-card">
                            <div
                                className={`home-stat-icon home-stat-icon-streak${
                                    stats?.currentStreakWeeks > 0
                                        ? ' home-stat-icon-streak-active'
                                        : ''
                                }`}
                            >
                                <i className="fas fa-fire"></i>
                            </div>
                            <div>
                                <strong>{stats ? stats.currentStreakWeeks : '–'}</strong>
                                <span>Week streak</span>
                                {stats && (
                                    <p className="home-stat-sub">
                                        {stats.currentStreakWeeks > 0
                                            ? 'Keep it going!'
                                            : 'Hit your weekly goal to start one'}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="home-stat-card">
                            <div className="home-stat-icon home-stat-icon-success">
                                <i className="fas fa-weight-hanging"></i>
                            </div>
                            <div>
                                <strong>
                                    {stats ? Math.round(stats.totalVolumeKg).toLocaleString() : '–'}
                                </strong>
                                <span>Total kg lifted</span>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="home-section">
                    <SectionLabel>THIS MONTH BY MUSCLE GROUP</SectionLabel>

                    <MuscleGroupStats stats={muscleGroupStats} />
                </section>
            </div>
        </main>
    );
};
