import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore, useCalendarStore } from '../../hooks';
import { PageHeader } from '../../components/PageHeader';
import { SectionLabel } from '../../components/SectionLabel';
import { MuscleGroupStats } from '../../calendar/components/MuscleGroupStats';
import { useTranslation } from 'react-i18next';
import { useLocaleFormat } from '../../i18n/format';

const QUICK_LINKS = [
    { to: '/routine', labelKey: 'home.quickRoutines', icon: 'fa-calendar-alt' },
    { to: '/exercises', labelKey: 'home.quickExercises', icon: 'fa-dumbbell' },
    { to: '/profile', labelKey: 'home.quickProfile', icon: 'fa-user' },
    { to: '/calendar', labelKey: 'home.quickCalendar', icon: 'fa-calendar-check' },
];

export const HomePage = () => {
    const { t } = useTranslation();
    const { formatNumber } = useLocaleFormat();
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
                    eyebrow={t('home.eyebrow')}
                    title={t('home.title', { name: user.name })}
                    subtitle={t('home.subtitle')}
                />

                <section className="home-banner">
                    <div className="home-banner-icon">
                        <i className="fas fa-dumbbell"></i>
                    </div>

                    <div className="home-banner-text">
                        <span className="home-card-label">{t('home.bannerLabel')}</span>
                        <h2>{t('home.bannerTitle')}</h2>
                        <p>{t('home.bannerText')}</p>
                    </div>

                    <Link to="/routine" className="home-primary-action">
                        {t('home.bannerAction')}
                        <span>→</span>
                    </Link>
                </section>

                <nav className="home-quick-grid" aria-label={t('home.quickAccess')}>
                    {QUICK_LINKS.map((link) => (
                        <Link key={link.to} to={link.to} className="home-quick-tile">
                            <i className={`fas ${link.icon}`}></i>
                            {t(link.labelKey)}
                        </Link>
                    ))}
                </nav>

                <section className="home-section">
                    <SectionLabel>{t('home.progressLabel')}</SectionLabel>

                    <div className="home-stats-grid">
                        <div className="home-stat-card">
                            <div className="home-stat-icon">
                                <i className="fas fa-calendar-check"></i>
                            </div>
                            <div>
                                <strong>{stats ? stats.monthSessionsCompleted : '–'}</strong>
                                <span>{t('home.sessionsThisMonth')}</span>
                                {stats && (
                                    <p className="home-stat-sub">
                                        {t('counts.activeDay', { count: stats.monthActiveDays })}
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
                                <span>{t('home.weekStreak')}</span>
                                {stats && (
                                    <p className="home-stat-sub">
                                        {stats.currentStreakWeeks > 0
                                            ? t('home.keepItUp')
                                            : t('home.startStreak')}
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
                                    {stats ? formatNumber(Math.round(stats.totalVolumeKg)) : '–'}
                                </strong>
                                <span>{t('home.totalLifted')}</span>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="home-section">
                    <SectionLabel>{t('home.muscleSection')}</SectionLabel>

                    <MuscleGroupStats stats={muscleGroupStats} />
                </section>
            </div>
        </main>
    );
};
