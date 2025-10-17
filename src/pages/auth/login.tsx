import { UserLoginForm } from "@/components/sections/auth/login-form";
import AuthLayout from "@/layout/auth-layout";

const LoginPage = () => {
    return (
        <AuthLayout>
            <UserLoginForm className="mx-auto max-w-lg" />
        </AuthLayout>
    );

};

export default LoginPage;