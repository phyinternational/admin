import { ColumnDef } from "@tanstack/react-table";
import { Order } from "./orders"; // Assuming there's an Order model similar to Product
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { Eye } from "lucide-react";
import { Badge } from "../ui/badge";

export const OrderColumns: ColumnDef<Order>[] = [
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
    cell: ({ row }) => (
      <span className="text-sm font-semibold">{row.original._id}</span>
    ),
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
        CANCELLED: "red",
      };
      const variant = (map[status] || "default") as any;
      const label = (status.replace(/_/g, " ") || "N/A");
      return <Badge variant={variant}>{label}</Badge>;
    },
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => (
      <div className="flex gap-2">
        <Link to={`/dashboard/orders/${row.original._id}`}>
          <Button variant="outline" size={"icon"}>
            <Eye size={20} />
          </Button>
        </Link>
      </div>
    ),
  },
];
