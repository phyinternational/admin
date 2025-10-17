interface IUser {
  name: string;
  _id?: string;
  email: string;
  phoneNumber: number;
  password: string;
  displayImage: {
    url: string;
  };
  cart: string; // Assuming cart is referenced by its ID
  wishlist: string; // Assuming wishlist is referenced by its ID
  shippingAddress: [
    {
      address: string;
      pincode: number;
      isDefault: boolean;
    }
  ];
  isBlocked: boolean;
  accountType: string;
  coupon_applied: string[]; // Assuming coupons are referenced by their IDs
  createdAt: Date;
}

export default IUser;
