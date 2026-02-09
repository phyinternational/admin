import { ColumnDef } from "@tanstack/react-table";
import { ItemEntry, Order } from "./orders";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { Eye, Copy, Check } from "lucide-react";
import { Badge } from "../ui/badge";
import { toast } from "sonner";
import { useState } from "react";

const CopyIdCell = ({ id }: { id: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(id);
    setCopied(true);
    toast.info("Order ID copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative flex items-center">
      <span
        className="text-sm font-semibold cursor-pointer hover:text-blue-600 flex items-center gap-1 group"
        onClick={handleCopy}
        title={copied ? "Copied" : "Click to copy full ID"}
      >
        {id.length > 4 ? `${id.slice(0, 4)}...` : id}
        {copied ? (
          <Check size={12} className="text-green-600 animate-in zoom-in duration-200" />
        ) : (
          <Copy size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
        )}
      </span>
      {copied && (
        <span className="absolute -top-7 left-0 bg-gray-900 text-white text-[10px] px-2 py-0.5 rounded-md animate-in fade-in slide-in-from-bottom-1 duration-200">
          Copied!
        </span>
      )}
    </div>
  );
};

export const getOrderColumns = (onReview: (order: Order, type: 'approve' | 'reject') => void): ColumnDef<ItemEntry>[] => [
  {
    accessorKey: "serialNumber",
    header: "Sr. No.",
    cell: ({ row, table }) => {
      const pagination = table.getState().pagination || { pageIndex: 0, pageSize: 10 };
      const pageIndex = pagination.pageIndex ?? 0;
      const pageSize = pagination.pageSize ?? 10;
      const serial = pageIndex * pageSize + (row.index ?? 0) + 1;
      return <span className="text-sm font-semibold">{serial}</span>;
    },
  },
  {
    accessorKey: "orderId",
    header: "Order ID",
    cell: ({ row }) => {
      const id = row.original.order._id || "";
      return <CopyIdCell id={id} />;
    },
  },
  {
    accessorKey: "product",
    header: "Product",
    cell: ({ row }) => {
      const item = row.original.item;
      const product = item.product;
      const title = product?.productTitle || product?.displayName || "Product";
      const image = product?.productImageUrl?.[0] || product?.displayImage || null;

      return (
        <div className="flex items-center gap-2 max-w-[200px]">
          {image && (
            <img
              src={image}
              alt={title}
              className="w-8 h-8 rounded object-cover flex-shrink-0"
            />
          )}
          <span className="text-sm truncate" title={title}>{title}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "userName",
    header: "User",
    cell: ({ row }) => {
      const sa = row.original.order.shippingAddress || {};
      const name = [sa.firstName, sa.lastName].filter(Boolean).join(" ") || row.original.order.buyer?.displayName || "N/A";
      return <span className="text-sm">{name}</span>;
    },
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => {
      const phone = row.original.order.shippingAddress?.phoneNumber || "N/A";
      return <span className="text-sm">{phone}</span>;
    },
  },
  {
    accessorKey: "orderDate",
    header: "Order Date",
    cell: ({ row }) => {
      const date = new Date(row.original.order.createdAt);
      return (
        <span className="text-sm font-semibold">{`${date.getDate()}/${
          date.getMonth() + 1
        }/${date.getFullYear()}`}</span>
      );
    },
  },
  {
    accessorKey: "qty",
    header: "Qty",
    cell: ({ row }) => {
      return <span className="text-sm font-semibold">{row.original.item.quantity}</span>;
    },
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      const price = row.original.item.price * row.original.item.quantity;
      return <span className="text-sm font-semibold">₹ {price}</span>;
    },
  },
  {
    accessorKey: "itemStatus",
    header: "Item Status",
    cell: ({ row }) => {
      const status = row.original.itemStatus || "";
      const isReplacement = !!row.original.order.parent_order;
      const map: Record<string, string> = {
        PLACED: "yellow",
        SHIPPED: "orange",
        DELIVERED: "green",
        CANCELLED_BY_ADMIN: "red",
        CANCELLED_BY_USER: "red",
        CANCELLED: "red",
        RETURN_REQUESTED: "blue",
        RETURN_APPROVED: "green",
        RETURN_REJECTED: "red",
        RETURNED: "green",
        REPLACEMENT_REQUESTED: "purple",
        REPLACEMENT_APPROVED: "green",
        REPLACEMENT_REJECTED: "red",
        REPLACEMENT_IN_PROGRESS: "orange",
      };
      const variant = (map[status] || "default") as any;
      const label = status.replace(/_/g, " ") || "N/A";
      return (
        <div className="flex flex-col gap-1">
          {isReplacement && (
            <Badge variant="purple" className="w-fit text-[10px] px-1.5 py-0.5">
              Replacement
            </Badge>
          )}
          <Badge variant={variant} className="w-fit">{label}</Badge>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => {
      const order = row.original.order;
      const itemStatus = row.original.itemStatus;
      const needsReview = itemStatus === "RETURN_REQUESTED" || itemStatus === "REPLACEMENT_REQUESTED";

      return (
        <div className="flex gap-2 items-center">
          <Link to={`/dashboard/orders/${order._id}`}>
            <Button
              variant="outline"
              size={"icon"}
              title="View Details"
              className="hover:bg-blue-50 hover:border-blue-500 hover:text-blue-600 transition-all shadow-sm"
            >
              <Eye size={18} />
            </Button>
          </Link>
          {needsReview && (
            <div className="flex gap-1.5">
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-3 text-green-600 border-green-500 hover:bg-gradient-to-r hover:from-green-500 hover:to-green-600 hover:text-white text-xs font-semibold shadow-sm transition-all"
                onClick={() => onReview(order, 'approve')}
              >
                ✓ Approve
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-3 text-red-600 border-red-500 hover:bg-gradient-to-r hover:from-red-500 hover:to-red-600 hover:text-white text-xs font-semibold shadow-sm transition-all"
                onClick={() => onReview(order, 'reject')}
              >
                ✗ Reject
              </Button>
            </div>
          )}
        </div>
      );
    },
  },
];
