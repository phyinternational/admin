import AuthGuard from "@/auth-guard/auth-guard";
import { NavBar } from "@/components/sections/dashboard/navbar";
import Sidebar from "@/components/sections/dashboard/sidebar";
import ErrorBoundary from "@/components/ui/error-boundary";
import { Outlet } from "react-router";
import { useContext } from "react";
import { MobileMenuContext } from "@/context/MobileMenuContext";
import { Sheet, SheetContent } from "@/components/ui/sheet";

const DashboardLayout = () => {
  const mobileMenu = useContext(MobileMenuContext);
  
  return (
    <AuthGuard>
      <div className="bg-slate-100 lg:pl-[300px]">
        {/* Desktop Sidebar - Hidden on mobile */}
        <div className="hidden lg:block">
          <Sidebar className="top-0 left-0 h-screen fixed w-[300px] border-r" />
        </div>

        {/* Mobile Sidebar - Drawer */}
        <Sheet open={mobileMenu?.isOpen} onOpenChange={mobileMenu?.close}>
          <SheetContent side="left" className="w-[300px] p-0">
            <Sidebar className="h-full fixed w-[300px] border-r" />
          </SheetContent>
        </Sheet>

        <NavBar />
        <main className="pt-32 px-4 md:px-8 lg:px-12 pb-12 min-h-screen">
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </main>
      </div>
    </AuthGuard>
  );
};

export default DashboardLayout;
