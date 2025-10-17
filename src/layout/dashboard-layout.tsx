import AuthGuard from "@/auth-guard/auth-guard";
import { NavBar } from "@/components/sections/dashboard/navbar";
import Sidebar from "@/components/sections/dashboard/sidebar";
import ErrorBoundary from "@/components/ui/error-boundary";
import { Outlet } from "react-router";

const DashboardLayout = () => {
  
  return (
    <AuthGuard>
      <div className="bg-slate-100 pl-[300px] ">
        <Sidebar className="top-0 left-0 h-screen fixed w-[300px] border-r" />
        <NavBar />
        <main className="pt-24 p-12 min-h-screen">
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </main>
      </div>
    </AuthGuard>
  );
};

export default DashboardLayout;
