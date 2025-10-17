import instance from "./instance";

export const notificationAPI = {
    getAllNotification: async (status?:'READ'|'UNREAD') => {
        return instance.get('/notifications',{params:{status}});
    },
    markAsRead: async (id:string) => {
        return instance.patch('/notifications/'+id);
    },
};
