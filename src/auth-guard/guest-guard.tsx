import { Navigate } from 'react-router-dom';
// components
import { PropsWithChildren } from 'react';
import LoadingScreen from '@/components/common/loading-screen';

// ----------------------------------------------------------------------


const GuestGuard = ({ children }: PropsWithChildren) => {
    const isAuthenticated = false;
    const isInitialized = true;

    if (isAuthenticated) {
        return <Navigate to="/dashboard" />;
    }

    if (!isInitialized) {
        return <LoadingScreen />;
    }

    return <> {children} </>;
}

export default GuestGuard;