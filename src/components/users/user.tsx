interface IUser {
  name: string;
  _id?: string;
  email: string;
  phoneNumber: string;
  password: string;
  profileImageUrl?: string;
  displayImage?: {
    url: string;
  };
  cart?: string; // Assuming cart is referenced by its ID
  wishlist?: string; // Assuming wishlist is referenced by its ID
  shippingAddress?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phoneNumber?: string;
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };
  isBlocked: boolean;
  accountType: string;
  coupon_applied: string[]; // Assuming coupons are referenced by their IDs
  createdAt: Date;
}

export default IUser;
