import { ColumnDef } from "@tanstack/react-table";
import { Order } from "./orders"; // Assuming there's an Order model similar to Product
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

export const getOrderColumns = (onReview: (order: Order, type: 'approve' | 'reject') => void): ColumnDef<Order>[] => [
  {
    accessorKey: "serialNumber",
    header: "Sr. No.",
    cell: ({ row, table }) => {
      // Compute serial number across pages: pageIndex * pageSize + row.index + 1
      const pagination = table.getState().pagination || { pageIndex: 0, pageSize: 10 };
      const pageIndex = pagination.pageIndex ?? 0;
      const pageSize = pagination.pageSize ?? 10;
      const serial = pageIndex * pageSize + (row.index ?? 0) + 1;
      return <span className="text-sm font-semibold">{serial}</span>;
    },
  },
  {
    accessorKey: "orderId",
    header: "Order id",
    cell: ({ row }) => {
      const id = row.original._id || "";
      return <CopyIdCell id={id} />;
    },
  },
  {
    accessorKey: "userName",
    header: "User",
    cell: ({ row }) => {
      const sa = row.original.shippingAddress || {};
      const name = [sa.firstName, sa.lastName].filter(Boolean).join(" ") || row.original.buyer || "N/A";
      return <span className="text-sm">{name}</span>;
    },
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => {
      const phone = row.original.shippingAddress?.phoneNumber || "N/A";
      return <span className="text-sm">{phone}</span>;
    },
  },
  {
    accessorKey: "orderDate",
    header: "Order Date",
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt);
      return (
        <span className="text-sm font-semibold">{`${date.getDate()}/${
          date.getMonth() + 1
        }/${date.getFullYear()}`}</span>
      );
    },
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      const products = row.original.products;
      let totalPrice = 0;

      products.forEach((product) => {
        totalPrice += product.price;
      });
      return <span className="text-sm font-semibold">₹ {totalPrice}</span>;
    },
  },
  {
    accessorKey: "orderStatus",
    header: "Order Status",
    cell: ({ row }) => {
      const status = (row.original.order_status || "").toString();
      const map: Record<string, string> = {
        PLACED: "yellow",
        SHIPPED: "orange",
        DELIVERED: "green",
        CANCELLED_BY_ADMIN: "red",
        CANCELLED_BY_USER: "red",
        CANCELLED: "red",
        RETURN_REQUESTED: "blue",
        REPLACEMENT_REQUESTED: "purple",
      };
      const variant = (map[status] || "default") as any;
      const label = (status.replace(/_/g, " ") || "N/A");
      return <Badge variant={variant}>{label}</Badge>;
    },
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => {
      const order = row.original;
      const isReturn = order.order_status === "RETURN_REQUESTED";
      const isReplacement = order.order_status === "REPLACEMENT_REQUESTED";
      const needsReview = isReturn || isReplacement;

      return (
        <div className="flex gap-2 items-center">
          <Link to={`/dashboard/orders/${order._id}`}>
            <Button variant="outline" size={"icon"} title="View Details">
              <Eye size={20} />
            </Button>
          </Link>
          {needsReview && (
            <div className="flex gap-1">
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 px-2 text-green-600 border-green-600 hover:bg-green-50 text-xs"
                onClick={() => onReview(order, 'approve')}
              >
                Approve
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 px-2 text-red-600 border-red-600 hover:bg-red-50 text-xs"
                onClick={() => onReview(order, 'reject')}
              >
                Reject
              </Button>
            </div>
          )}
        </div>
      );
    },
  },
];
