
import Logo from '@/components/common/logo';
import { useGetUser } from '@/lib/react-query/auth-query';
import { Fragment, PropsWithChildren } from 'react';
import { Navigate } from 'react-router-dom';

const AuthGuard = ({ children }: PropsWithChildren) => {
    const { isLoading, isError, data, error } = useGetUser();

    // Add debugging logs
    console.log('%c🔐 AuthGuard Debug', 'background: #3b82f6; color: white; padding: 2px 4px; border-radius: 4px;');
    console.log('isLoading:', isLoading);
    console.log('isError:', isError);
    console.log('data:', data);
    console.log('error:', error);

    if (isLoading)
        return (
            <section className="flex h-screen w-screen flex-col items-center justify-center">
                <Logo />
                <h4 className="mt-4">Verifying authentication...</h4>
                <p className="text-sm text-gray-500 mt-2">Please wait while we check your login status</p>
            </section>
        );

    if (isError) {
        console.log('%c❌ AuthGuard: Authentication failed, redirecting to login', 'background: #dc2626; color: white; padding: 2px 4px; border-radius: 4px;');
        console.log('Error details:', error);
        return <Navigate to="/auth/login" />;
    }
    
    console.log('%c✅ AuthGuard: Authentication successful', 'background: #059669; color: white; padding: 2px 4px; border-radius: 4px;');
    return <Fragment>{children}</Fragment>;
};

export default AuthGuard;
