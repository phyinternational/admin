import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  useGetAllNotificationRead,
  useGetAllNotificationUnread,
} from "@/lib/react-query/notification-query";
import Notification from "./notification";
import { useMemo } from "react";
import NotificationCard from "./notification-card";

const NoticationPage = () => {
  const {
    data: unreadData,
    isSuccess: unreadSuccess,
    isLoading: unreadLoading,
  } = useGetAllNotificationUnread();
  const {
    data: readData,
    isSuccess: readSuccess,
    isLoading: readLoading,
  } = useGetAllNotificationRead();

  const unreadNotifications = useMemo(() => {
    if (unreadSuccess) {
      const notifications = unreadData?.pages.flatMap(
        (page) => page.data.data.notifications ?? []
      );
      return Array.from(notifications).map(
        (noti) => new Notification(noti as any)
      );
    }
  }, [unreadData, unreadSuccess]);

  const readNotifications = useMemo(() => {
    if (readSuccess) {
      const notifications = readData?.pages.flatMap(
        (page) => page.data.data.notifications ?? []
      );
      return Array.from(notifications).map(
        (noti) => new Notification(noti as any)
      );
    }
  }, [readData, readSuccess]);

  return (
    <section>
      <h2 className="mb-6 px-4">Notifications</h2>
      <Tabs defaultValue="unread" className="w-full bg-white py-5">
        <TabsList className="grid md:w-[500px] mx-4 w-fit grid-cols-2 ">
          <TabsTrigger value="unread">Unread Notications</TabsTrigger>
          <TabsTrigger value="read">Read Notications</TabsTrigger>
        </TabsList>
        <br />
        <Separator />
        <TabsContent value="read" className="h-[60vh]">
          <NotificationList
            isLoading={readLoading}
            notifications={readNotifications}
          />
        </TabsContent>
        <TabsContent value="unread">
          <NotificationList
            isLoading={unreadLoading}
            notifications={unreadNotifications}
          />
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default NoticationPage;

type NotificationListProps = {
  notifications: Notification[] | undefined;
  isLoading: boolean;
};
const NotificationList = ({
  notifications,
  isLoading,
}: NotificationListProps) => {
  if (isLoading) return <Skeleton className="h-full w-full">Loading</Skeleton>;

  return (
    <ScrollArea className="h-[60vh]">
      {notifications &&
        notifications.map((notification, index) => (
          <NotificationCard showDate key={index} notification={notification} />
        ))}
      {notifications?.length === 0 && (
        <div className="h-96 text-lg text-center text-gray-600 flex items-center justify-center font-semibold">
          No new Notifications
        </div>
      )}
    </ScrollArea>
  );
};
