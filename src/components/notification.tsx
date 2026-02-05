export interface NotificationData {
    _id: string;
    text: string;
    title?: string;
    type?: string;
    status: string;
    createdAt: string;
    userId: string | any;
    orderId: string | any;
    updatedAt?: string;
}

class Notification {
    _id: string;
    text: string;
    title: string;
    type: string;
    status: string;
    createdAt: string;
    updatedAt?: string;
    user: string | any;
    order: string | any;
    constructor(notificationData: NotificationData) {
        this._id = notificationData._id;
        this.text = notificationData.text;
        this.title = notificationData.title || "";
        this.type = notificationData.type || "ORDER_UPDATE";
        this.status = notificationData.status;
        this.createdAt = notificationData.createdAt;
        this.user = notificationData.userId;
        this.order = notificationData.orderId;
        this.updatedAt = notificationData.updatedAt;
    }
}

export default Notification;
