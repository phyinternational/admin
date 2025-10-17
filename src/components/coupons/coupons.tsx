interface ICoupon {
    couponCode: string;
    _id?: string;
    couponAmount: number;
    couponType: 'INR' | 'PERCENTAGE';
    couponQuantity: number;
    minCartAmount: number;
    expiryDate: Date;
    createdAt?: Date;
    updatedAt?: Date;
  }
  
  export default ICoupon;
  