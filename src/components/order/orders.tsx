interface ProductInOrder {
  product: string|any;
  quantity: number;
  price: number;
  variant: string | any;
}

interface ShippingAddress {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
}

export interface StatusHistory {
  status: string;
  reason?: string;
  updatedBy?: string;
  updatedAt: string;
}

export interface OrderRequest {
  reason: string;
  proof_images: string[];
  admin_comment?: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  requestedAt: string;
  updatedAt?: string;
}

export interface Order {
  _id: string;
  createdAt: string;
  buyer: any;
  products: ProductInOrder[];
  coupon_applied: any;
  shippingAddress: ShippingAddress;
  payment_mode: "COD" | "ONLINE";
  payment_status: "PENDING" | "COMPLETE" | "FAILED";
  order_status:
    | "PLACED"
    | "SHIPPED"
    | "DELIVERED"
    | "CANCELLED_BY_ADMIN"
    | "CANCELLED_BY_USER"
    | "RETURN_REQUESTED"
    | "RETURN_APPROVED"
    | "RETURN_REJECTED"
    | "RETURNED"
    | "REPLACEMENT_REQUESTED"
    | "REPLACEMENT_APPROVED"
    | "REPLACEMENT_REJECTED"
    | "REPLACEMENT_IN_PROGRESS";
  cc_orderId?: string;
  cc_bankRefNo?: string;
  deliveredAt?: string;
  parent_order?: string;
  status_history: StatusHistory[];
  cancellation?: {
    reason: string;
    cancelledAt: string;
  };
  return_request?: OrderRequest;
  replacement_request?: OrderRequest;
}
