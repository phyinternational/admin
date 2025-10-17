import Logo from "@/components/common/logo";
import UserMenu from "./user-menu";
import NotificationMenu from "@/components/notification-menu";

export const NavBar = () => {
  return (
    <>
      <nav className="fixed w-[calc(100vw-280px)] px-12  z-50  border-b bg-white">
        <div className="flex h-16  items-center justify-between px-4">
          <Logo />
          <div className="mr-8 ml-auto mt-2 h-fit">
            <NotificationMenu />
          </div>
          <UserMenu />
        </div>
      </nav>
    </>
  );
};
