export interface NotificationData {
    _id: string;
    text: string;
    status: string;
    createdAt: string;
    userId: string;
    orderId: string;
    updatedAt?: string;
}

class Notification {
    _id: string;
    text: string;
    status: string;
    createdAt: string;
    updatedAt?: string;
    user: string;
    order: string;
    constructor(notificationData: NotificationData) {
        this._id = notificationData._id;
        this.text = notificationData.text;
        this.status = notificationData.status;
        this.createdAt = notificationData.createdAt;
        this.user = notificationData.userId;
        this.order = notificationData.orderId;
        this.updatedAt = notificationData.updatedAt;
    }
}

export default Notification;
