import { Button } from "@/components/ui/button";
import {
  useMarkAsReactNotification,
  useMarkAsRead,
} from "@/lib/react-query/notification-query";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

import { ShoppingBag, X, User, AlertCircle, PackageCheck } from "lucide-react";
import Notification from "./notification";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

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
  const { createdAt, type } = notification;

  const markAsRead = () => {
    mutate(notification._id);
    markRead();
  };

  const getIcon = () => {
    switch (type) {
      case "ORDER":
      case "ORDER_PLACED":
        return { icon: ShoppingBag, color: "bg-blue-100 text-blue-600 border-blue-200" };
      case "CANCELLATION":
        return { icon: X, color: "bg-red-100 text-red-600 border-red-200" };
      case "RETURN":
      case "REPLACEMENT":
        return { icon: PackageCheck, color: "bg-orange-100 text-orange-600 border-orange-200" };
      case "USER":
      case "SIGNUP":
        return { icon: User, color: "bg-green-100 text-green-600 border-green-200" };
      default:
        return { icon: AlertCircle, color: "bg-gray-100 text-gray-600 border-gray-200" };
    }
  };

  const config = getIcon();
  const Icon = config.icon;

  return (
    <div className={cn(
      "w-full cursor-pointer transition-colors border-b px-4 py-4 group relative",
      notification.status === "UNREAD" ? "bg-white" : "bg-gray-50/50"
    )}>
      <div className="flex gap-3">
        <div className={cn(
          "flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full border shadow-sm",
          config.color
        )}>
          <Icon className="h-5 w-5" />
        </div>

        <div className="flex-1 min-w-0 pr-6">
          <NotificationComponent notification={notification} />
          
          <div className="flex items-center gap-2 mt-1.5 overflow-hidden">
            {!showDate && (
              <span className="text-[11px] font-medium text-gray-400 whitespace-nowrap">
                {dayjs(createdAt).fromNow()}
              </span>
            )}
            {showDate && (
              <span className="text-[11px] font-medium text-gray-400">
                {dayjs(createdAt).format("MMM D, YYYY • h:mm A")}
              </span>
            )}
            {notification.status === "UNREAD" && (
              <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
            )}
          </div>
        </div>

        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {notification.status !== "READ" && (
            <Button
              onClick={(e) => {
                e.stopPropagation();
                markAsRead();
              }}
              title="Mark as read"
              className="h-8 w-8 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full"
              variant="ghost"
              size="icon"
            >
              <X size={14} />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationCard;

const NotificationComponent: React.FC<{ notification: Notification }> = ({
  notification,
}) => {
  const { text, title, order } = notification;

  const orderId = typeof order === "string" ? order : (order as any)?._id;

  // Extract reason if it exists in the text (formatted as "... Reason: text")
  const renderContent = () => {
    if (text.includes("Reason:")) {
      const [mainBody, reason] = text.split("Reason:");
      return (
        <>
          <span className="text-sm font-medium text-gray-700 leading-snug">
            {mainBody.trim()}
          </span>
          <div className="mt-1 flex items-start gap-1 p-2 bg-gray-50 rounded border border-gray-100 text-[13px] text-gray-800">
            <span className="font-bold text-gray-700">Reason:</span>
            {reason.trim()}
          </div>
        </>
      );
    }
    return (
      <span className="text-sm text-gray-600 leading-snug">
        {text}
      </span>
    );
  };

  return (
    <div className="flex flex-col">
      <h3 className="text-sm font-bold text-gray-900 leading-none mb-1">
        {title || "Notification"}
      </h3>
      {renderContent()}
      {orderId && (
        <Link
          className="inline-flex items-center gap-1 text-violet-600 text-xs font-bold hover:text-violet-700 mt-2 bg-violet-50 w-fit px-2 py-1 rounded transition-colors"
          to={`/dashboard/orders/${orderId}`}
        >
          <ShoppingBag size={12} />
          View Order #{orderId.toString().substring(0, 8).toUpperCase()}
        </Link>
      )}
    </div>
  );
};
