import Logo from "@/components/common/logo";
import UserMenu from "./user-menu";
import NotificationMenu from "@/components/notification-menu";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useContext } from "react";
import { MobileMenuContext } from "@/context/MobileMenuContext";

export const NavBar = () => {
  const mobileMenu = useContext(MobileMenuContext);

  return (
    <>
      <nav className="fixed w-full lg:w-[calc(100vw-300px)] px-4 lg:px-12 z-50 border-b bg-white">
        <div className="flex h-16 items-center justify-between px-2 lg:px-4">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={mobileMenu?.toggle}
          >
            <Menu className="h-6 w-6" />
          </Button>

          <div className="flex-1 lg:flex-none">
            <Logo />
          </div>

          <div className="mr-4 lg:mr-8 ml-auto mt-2 h-fit">
            <NotificationMenu />
          </div>
          <UserMenu />
        </div>
      </nav>
    </>
  );
};
