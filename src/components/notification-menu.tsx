import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
} from "@radix-ui/react-dropdown-menu";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

import { BellRingIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Notification, { NotificationData } from "./notification";
import NotificationCard from "./notification-card";
import { useGetAllNotificationUnread } from "@/lib/react-query/notification-query";
import { Separator } from "./ui/separator";

const NotificationMenu = () => {
  const { data, isSuccess } = useGetAllNotificationUnread();
  const [isOpen, setIsOpen] = useState(false);

  const notifications = useMemo(() => {
    if (isSuccess) {
      const notifications = data?.pages.flatMap(
        (page) => page.data.data.notifications ?? []
      );
      return Array.from(notifications).map(
        (noti) => new Notification(noti as NotificationData)
      );
    }
  }, [data, isSuccess]);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger className=" active:outline-blue-400">
          <div className="group relative rounded-sm p-2  hover:bg-gray-100">
            {Boolean(notifications?.length) && (
              <span className="absolute top-0 right-0 h-4 w-4 rounded-full text-xs bg-blue-500 text-white ">
                {notifications?.length}
              </span>
            )}
            <BellRingIcon size={18} className="text-gray-700" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side="bottom"
          align="end"
          className="mr-5 w-[350px] rounded-md border bg-white shadow-lg"
        >
          <DropdownMenuLabel className="mb-2 px-4 py-2">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-gray-900">Notification</h4>
              <Link to="/dashboard/notifications" onClick={handleClose}>
                <Button
                  variant="link"
                  className="text-xs text-blue-600 hover:text-blue-700 p-0 h-auto font-medium"
                >
                  View All
                </Button>
              </Link>
            </div>
          </DropdownMenuLabel>
          <Separator />
          {Boolean(notifications?.length == 0) && (
            <>
              <div className="h-20 justify-center flex items-center font-semibold text-gray-700">
                No results
              </div>
              <Separator />
            </>
          )}
          {notifications?.map((noti) => (
            <div key={noti._id} onClick={handleClose}>
              <NotificationCard notification={noti} />
            </div>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default NotificationMenu;
