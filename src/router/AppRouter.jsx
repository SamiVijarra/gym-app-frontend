import { Navigate, Route, Routes } from "react-router-dom"
import { LoginPage } from '../auth/pages/LoginPage'
import { HomePage } from "../home/pages/HomePage";
import { useAuthStore } from "../hooks";
import { useEffect } from "react";
import { ProfilePage } from "../users/pages/ProfilePage";

export const AppRouter = () => {

    const { status, checkAuthToken } = useAuthStore();

    useEffect(() => {
        checkAuthToken();
    }, []) 

    if (status === 'checking') {
        return (
            <h3>Cargando...</h3>
        )
    }

    return (
        <Routes>
            {
                (status === 'not-authenticated')
                    ? (
                    <>
                    <Route path="/auth/*" element={<LoginPage />} />
                    <Route path="/*" element={<Navigate to ="/auth/login"/>}/>
                    </>
                )
                    : (
                        <>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/profile" element={<ProfilePage />} />
                        <Route path="/*" element={<Navigate to ="/"/>}/>
                        </>
                    )
            }
        </Routes>
    )
}