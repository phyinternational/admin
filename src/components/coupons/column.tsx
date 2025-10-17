import { ColumnDef } from "@tanstack/react-table";
// Use any for coupon rows until a shared type file is available
import { Badge } from "../ui/badge";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { Pencil } from "lucide-react";

export const CouponColumns: ColumnDef<any>[] = [
  {
    header: "Coupon Code",
    accessorKey: "couponCode",
    cell: ({ row }) => {
      return <span className="font-bold">{row.original.couponCode}</span>;
    },
  },
  {
    header: "Amount",
    accessorKey: "couponAmount",
    cell: (info) =>
      `${info.row.original.couponType === "INR" ? "₹" : ""}${info.getValue()}${
        info.row.original.couponType === "PERCENTAGE" ? "%" : ""
      }`,
  },
  {
    header: "Type",
    accessorKey: "couponType",
  },
  {
    header: "Quantity",
    accessorKey: "couponQuantity",
  },
  {
    header: "Available",
    accessorKey: "remainingQuantity",
    cell: ({ row }) => {
      const r = row.original;
      const remaining = r.remainingQuantity ?? (r.couponQuantity - (r.usedQuantity || 0));
      return (
        <span className={"font-medium " + (remaining <= 5 ? "text-red-600" : "text-green-600")}>
          {remaining}
        </span>
      );
    },
  },
  {
    header: "Min Cart Amount",
    accessorKey: "minCartAmount",
    cell: (info) => `₹${info.getValue()}`,
  },
  {
    header: "Expiry Date",
    accessorKey: "expiryDate",
    cell: ({ row }) => {
      return (
        <Badge variant={"destructive"}>
          {new Date(row.original.expiryDate).toLocaleDateString()}
        </Badge>
      );
    },
  },
  {
    header: "Updated At",
    accessorKey: "updatedAt",
    cell: ({ row }) => {
      return row.original.updatedAt
        ? new Date(row.original.updatedAt).toLocaleDateString()
        : "";
    },
  },
  {
    header: "Actions",
    accessorKey: "id",
    cell: (info) => {
      return (
        <div className="flex space-x-2">
          <Link to={`/dashboard/coupons/edit/${info.row.original._id}`}>
            <Button variant={"outline"} size="sm">
              <Pencil size={16} />
            </Button>
          </Link>
        </div>
      );
    },
  },
];
