import { Button } from "@/components/ui/button";
import {
  useMarkAsReactNotification,
  useMarkAsRead,
} from "@/lib/react-query/notification-query";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

import { CheckIcon, X } from "lucide-react";
import Notification from "./notification";
import { Link } from "react-router-dom";

type NotificationCardProps = {
  notification: Notification;
  showDate?: boolean;
};

const NotificationCard = ({
  notification,
  showDate = false,
}: NotificationCardProps) => {
  const { mutate } = useMarkAsRead();
  const markRead = useMarkAsReactNotification(notification._id);
  const { createdAt } = notification;

  const markAsRead = () => {
    mutate(notification._id);
    markRead();
  };

  return (
    <div className="w-full cursor-pointer border-b pb-4 px-4 py-3 hover:bg-gray-100">
      <header className="flex items-center gap-2">
        <div className="mr-2 h-fit w-fit rounded-full bg-green-200 p-2">
          <CheckIcon className="h-4 w-4" />
        </div>
        <p className="text-gray-600">
          <NotificationComponent notification={notification} />
          <br />
          {!showDate && (
            <span className="mt-2 text-xs font-semibold">
              {dayjs(createdAt).fromNow()}
            </span>
          )}
          {showDate && (
            <span className="mt-2 text-xs font-semibold">
              Date: &nbsp;{" "}
              {dayjs(createdAt).format("dddd, MMMM D, YYYY h:mm A")}
            </span>
          )}
        </p>
        <div className="ml-auto">
          {notification.status !== "READ" && (
            <Button
              onClick={markAsRead}
              className="hover:bg-red-200"
              variant="ghost"
              size="sm"
            >
              <X size={16} />
            </Button>
          )}
        </div>
      </header>
    </div>
  );
};

export default NotificationCard;

const NotificationComponent: React.FC<{ notification: Notification }> = ({
  notification,
}) => {
  const { text, status, user, order } = notification;

  // Split the text into parts based on ':user' and ':order' occurrences
  const parts = text.split(/(:user|:order)/g).map((part, index) => {
    // Check if the part is ':user' or ':order'
    if ((part === ":user" || part === ":order") && index % 2 === 1) {
      return { type: part.substr(1), value: part === ":user" ? user : order };
    } else {
      return { type: "text", value: part };
    }
  });

  // Replace placeholders with actual user and order values
  const jsxElements = parts.map((part, index) => {
    if (part.type === "user") {
      return (
        <Link
          className="text-blue-600 font-bold hover:underline"
          key={index}
          to={`/dashboard/users/cart/${user}`}
        >
          user
        </Link>
      );
    } else if (part.type === "order") {
      return (
        <Link
          className="text-blue-600 font-bold hover:underline"
          key={index}
          to={`/dashboard/orders/${order}`}
        >
          Order
        </Link>
      );
    } else {
      return <span key={index}>{part.value}</span>; // Plain text part
    }
  });

  return (
    <div className={`notification ${status}`}>
      <span>{jsxElements}</span>
    </div>
  );
};
