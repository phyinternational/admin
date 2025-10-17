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
import { useMemo } from "react";
import { Link } from "react-router-dom";
import Notification, { NotificationData } from "./notification";
import NotificationCard from "./notification-card";
import { useGetAllNotificationUnread } from "@/lib/react-query/notification-query";
import { Separator } from "./ui/separator";

const NotificationMenu = () => {
  const { data, isSuccess } = useGetAllNotificationUnread();

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

  return (
    <>
      <DropdownMenu>
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
          <DropdownMenuLabel className="mb-2  px-4 py-2 ">
            <h4>Notification</h4>
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
            <NotificationCard key={noti._id} notification={noti} />
          ))}

          <div className="w-full flex justify-end">
            <Link to="/dashboard/notifications">
              <Button variant="link">See All Notifications</Button>
            </Link>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default NotificationMenu;
