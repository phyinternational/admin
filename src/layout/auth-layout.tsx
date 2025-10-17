import Container from "@/components/common/container";
import Logo from "@/components/common/logo";
import { PropsWithChildren } from "react";

const AuthLayout = ({ children }: PropsWithChildren) => {
    return (
        <Container grid>
            <aside className="md:col-span-6 md:block p-6 hidden">
                <div className="bg-green-200 h-full flex flex-col  p-6 w-full rounded-xl">
                    <header className="h-20">
                        <Logo className="text-primary-foreground" />
                    </header>
                  
                </div>
            </aside>
            <div className="px-8 md:col-span-6 sm:col-span-8 col-span-4 items-center flex-col md:justify-center justify-start md:pt-0 pt-40  flex">
                <header className="h-10 absolute top-5 md:hidden self-start block">
                    <Logo thickness="thick" className="text-primary" />
                </header>
                {children}
            </div>
        </Container>
    );
}
export default AuthLayout;