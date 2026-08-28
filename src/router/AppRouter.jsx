import { Navigate, Route, Routes, useParams } from 'react-router-dom';
import { LoginPage } from '../auth/pages/LoginPage';
import { HomePage } from '../home/pages/HomePage';
import { useAuthStore, useThemeStore } from '../hooks';
import { useEffect } from 'react';
import { ProfilePage } from '../users/pages/ProfilePage';
import { ExercisesPage } from '../exercises/pages/ExercisesPage';
import { RoutinePage } from '../routines/pages/RoutinePage';
import { RoutineDayDetailPage } from '../routines/pages/RoutineDayDetailPage';
import { ExerciseDetailPage } from '../exercises/pages/ExerciseDetailPage';
import { CalendarPage } from '../calendar/pages/CalendarPage';
import { CalendarDayPage } from '../calendar/pages/CalendarDayPage';

export const AppRouter = () => {
    const { status, checkAuthToken } = useAuthStore();
    const { mode } = useThemeStore();

    const CalendarDayRoute = () => {
        const { date } = useParams();
        return <CalendarDayPage key={date} />;
    };

    useEffect(() => {
        checkAuthToken();
    }, []);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', mode);
    }, [mode]);

    if (status === 'checking') {
        return <h3>Cargando...</h3>;
    }

    return (
        <Routes>
            {status === 'not-authenticated' ? (
                <>
                    <Route path="/auth/*" element={<LoginPage />} />
                    <Route path="/*" element={<Navigate to="/auth/login" />} />
                </>
            ) : (
                <>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/exercises" element={<ExercisesPage />} />
                    <Route path="/exercises/:id" element={<ExerciseDetailPage />} />
                    <Route path="/routine" element={<RoutinePage />} />
                    <Route path="/routine/:dayId" element={<RoutineDayDetailPage />} />
                    <Route path="/calendar" element={<CalendarPage />} />
                    <Route path="/calendar/:date" element={<CalendarDayRoute />} />
                    <Route path="/*" element={<Navigate to="/" />} />
                </>
            )}
        </Routes>
    );
};
