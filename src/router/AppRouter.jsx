import { Navigate, Route, Routes, useParams } from 'react-router-dom';
import { lazy, useEffect } from 'react';

import { LoginPage } from '../auth/pages/LoginPage';
import { HomePage } from '../home/pages/HomePage';
import { useAuthStore, useThemeStore } from '../hooks';
import { Layout } from '../components/Layout';
import { useTranslation } from 'react-i18next';

const lazyPage = (importPage, exportName) =>
    lazy(() => importPage().then((module) => ({ default: module[exportName] })));

const ProfilePage = lazyPage(() => import('../users/pages/ProfilePage'), 'ProfilePage');
const ExercisesPage = lazyPage(() => import('../exercises/pages/ExercisesPage'), 'ExercisesPage');
const ExerciseDetailPage = lazyPage(
    () => import('../exercises/pages/ExerciseDetailPage'),
    'ExerciseDetailPage'
);
const ExerciseProgressPage = lazyPage(
    () => import('../exercises/pages/ExerciseProgressPage'),
    'ExerciseProgressPage'
);
const RoutinePage = lazyPage(() => import('../routines/pages/RoutinePage'), 'RoutinePage');
const RoutineDayDetailPage = lazyPage(
    () => import('../routines/pages/RoutineDayDetailPage'),
    'RoutineDayDetailPage'
);
const CalendarPage = lazyPage(() => import('../calendar/pages/CalendarPage'), 'CalendarPage');
const CalendarDayPage = lazyPage(
    () => import('../calendar/pages/CalendarDayPage'),
    'CalendarDayPage'
);
const CalendarSessionDetailPage = lazyPage(
    () => import('../calendar/pages/CalendarSessionDetailPage'),
    'CalendarSessionDetailPage'
);

const CalendarDayRoute = () => {
    const { date } = useParams();
    return <CalendarDayPage key={date} />;
};

const CalendarSessionDetailRoute = () => {
    const { historyEntryId } = useParams();
    return <CalendarSessionDetailPage key={historyEntryId} />;
};

export const AppRouter = () => {
    const { t } = useTranslation();
    const { status, checkAuthToken } = useAuthStore();
    const { mode } = useThemeStore();

    useEffect(() => {
        checkAuthToken();
    }, [checkAuthToken]);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', mode);
    }, [mode]);

    if (status === 'checking') {
        return <h3>{t('common.loading')}</h3>;
    }

    return (
        <Routes>
            {status === 'not-authenticated' ? (
                <>
                    <Route path="/auth/*" element={<LoginPage />} />
                    <Route path="/*" element={<Navigate to="/auth/login" />} />
                </>
            ) : (
                <Route element={<Layout />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/exercises" element={<ExercisesPage />} />
                    <Route path="/exercises/:id" element={<ExerciseDetailPage />} />
                    <Route path="/exercises/:id/progress" element={<ExerciseProgressPage />} />
                    <Route path="/routine" element={<RoutinePage />} />
                    <Route path="/routine/:dayId" element={<RoutineDayDetailPage />} />
                    <Route path="/calendar" element={<CalendarPage />} />
                    <Route path="/calendar/:date" element={<CalendarDayRoute />} />
                    <Route
                        path="/calendar/:date/session/:historyEntryId"
                        element={<CalendarSessionDetailRoute />}
                    />
                    <Route path="/*" element={<Navigate to="/" />} />
                </Route>
            )}
        </Routes>
    );
};
