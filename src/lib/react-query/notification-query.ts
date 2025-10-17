import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { notificationAPI } from "../axios/notification-API"

export const useGetAllNotification = () => {
return useQuery({
  queryKey: ['notification'],
  queryFn: () => notificationAPI.getAllNotification(),
  staleTime: Infinity
})}

export const useGetAllNotificationUnread = () => {
  return useInfiniteQuery(
    {
      queryKey: ['notification', 'unread'],
      queryFn: ()=> notificationAPI.getAllNotification("UNREAD"),
      initialPageParam: 0,
      getNextPageParam: (page => {
        const totalPages = page.data.total / page.data.limit;
        return Number(page.data.page) === totalPages
          ? undefined
          : Number(page.data.page) + 1;
      }),
      staleTime: Infinity
    }
   );
}

export const useGetAllNotificationRead = () => {
  return useInfiniteQuery(
    {
      queryKey: ['notification', 'read'],
      queryFn: ()=> notificationAPI.getAllNotification("READ"),
      initialPageParam: 1,
      getNextPageParam: (page => {
        const totalPages = page.data.total / page.data.limit;
        return Number(page.data.page) === totalPages
          ? undefined
          : Number(page.data.page) + 1;
      }),
      staleTime: Infinity
    }
   );
}

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: notificationAPI.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['notification', 'unread']
      });
      queryClient.invalidateQueries({
        queryKey: ['notification', 'read']
      });
    }
  })
}

export const useMarkAsReactNotification = (id: string) => {
  const queryClient = useQueryClient();
  const queryData = queryClient.getQueryData(['notification', 'unread']);

  return () => {
    const newData = JSON.parse(JSON.stringify(queryData));

    if (newData?.pages && Array.isArray(newData.pages) && newData.pages.length > 0) {
      for (const page of newData.pages) {
        if (
          page.data?.data?.notifications &&
          Array.isArray(page.data.data.notifications)
        ) {
          // Filter out the notification with the selected ID on this page
          page.data.data.notifications = page.data.data.notifications.filter(
            (notification: { _id: string }) => notification._id !== id
          );
        }
      }
    }

    queryClient.setQueryData(['notification', 'unread'], newData)
  }
}