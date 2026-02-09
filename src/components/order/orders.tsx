export interface ProductInOrder {
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

export interface ItemRequest {
  product: string | any;
  variant?: string | any;
  quantity: number;
  reason: string;
  proof_images?: string[];
  admin_comment?: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  requestedAt: string;
  updatedAt?: string;
}

export interface CancelledItem {
  product: string | any;
  variant?: string | any;
  quantity: number;
  reason: string;
  cancelledAt: string;
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
  // Item-level fields
  cancelled_items?: CancelledItem[];
  item_return_requests?: ItemRequest[];
  item_replacement_requests?: ItemRequest[];
}

export interface ItemEntry {
  order: Order;
  item: ProductInOrder;
  itemStatus: string;
  itemProductId: string;
}

export function computeItemStatus(order: Order, item: ProductInOrder): string {
  const productId = item.product?._id || item.product;

  // Check cancelled
  const cancelled = order.cancelled_items?.find(
    (c) => c.product?.toString() === productId?.toString()
  );
  if (cancelled) return "CANCELLED";

  // Check item-level return request
  const returnReq = order.item_return_requests?.find(
    (r) => r.product?.toString() === productId?.toString()
  );
  if (returnReq) {
    const map: Record<string, string> = {
      PENDING: "RETURN_REQUESTED",
      APPROVED: "RETURN_APPROVED",
      REJECTED: "RETURN_REJECTED",
    };
    return map[returnReq.status] || order.order_status;
  }

  // Check item-level replacement request
  const replReq = order.item_replacement_requests?.find(
    (r) => r.product?.toString() === productId?.toString()
  );
  if (replReq) {
    const map: Record<string, string> = {
      PENDING: "REPLACEMENT_REQUESTED",
      APPROVED: "REPLACEMENT_APPROVED",
      REJECTED: "REPLACEMENT_REJECTED",
    };
    return map[replReq.status] || order.order_status;
  }

  // Check order-level requests (legacy) - all items share
  if (order.return_request) {
    const map: Record<string, string> = {
      PENDING: "RETURN_REQUESTED",
      APPROVED: "RETURN_APPROVED",
      REJECTED: "RETURN_REJECTED",
    };
    return map[order.return_request.status] || order.order_status;
  }
  if (order.replacement_request) {
    const map: Record<string, string> = {
      PENDING: "REPLACEMENT_REQUESTED",
      APPROVED: "REPLACEMENT_APPROVED",
      REJECTED: "REPLACEMENT_REJECTED",
    };
    return map[order.replacement_request.status] || order.order_status;
  }

  // If order status changed due to another item's request, this item is still at base status
  if (
    (order.item_return_requests?.length || order.item_replacement_requests?.length) &&
    [
      "RETURN_REQUESTED",
      "RETURN_APPROVED",
      "RETURN_REJECTED",
      "REPLACEMENT_REQUESTED",
      "REPLACEMENT_APPROVED",
      "REPLACEMENT_REJECTED",
    ].includes(order.order_status)
  ) {
    return "DELIVERED";
  }

  return order.order_status;
}
