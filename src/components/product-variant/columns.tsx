import { ColumnDef } from "@tanstack/react-table";
import ProductVariant from "./product-variant";
import { Badge } from "../ui/badge";
import { Link } from "react-router-dom";
import { Image, Pencil } from "lucide-react";
import { Button } from "../ui/button";

export const ProductVariantColumns: ColumnDef<ProductVariant>[] = [
  {
    header: "Size",
    accessorKey: "size",
    // Add other properties or functions related to this column if needed.
  },
  {
    header: "Price",
    accessorKey: "price",
    // Add other properties or functions related to this column if needed.
  },
  {
    header: "Sale Price",
    accessorKey: "salePrice",
    // Add other properties or functions related to this column if needed.
  },
  {
    accessorKey: "isActive",
    header: "Is Active",
    cell: ({ row }) => {
      const isActive: any = row.original.isActive;
      return (
        <Badge variant={!isActive ? "destructive" : "default"}>
          {isActive ? "Active" : "Deleted"}
        </Badge>
      );
    },
  },
  {
    header: "Stock",
    accessorKey: "stock",
    // Add other properties or functions related to this column if needed.
  },
  {
    header: "Color",
    accessorKey: "color", // Assuming that the color is a string field.
    cell: ({ row }) => {
      const color: any = row.original.color;
      return (
        <div className="flex gap-2 items-center">
          <div
            className="w-5 h-5 border border-gray-600 rounded-full"
            style={{ backgroundColor: `${color.hexcode}` }}
          />
          <Badge variant="outline">{color.color_name ?? "-"}</Badge>
        </div>
      );
    },
  },
  {
    header: "Actions",
    accessorKey: "actions",
    cell: ({ row }) => {
      return (
        <div className="flex items-center justify-start space-x-2">
          <Link to={`/dashboard/product-variant/${row.original._id}/edit`}>
            <Button size={"icon"} variant={"outline"}>
              <Pencil size={20} />
            </Button>
          </Link>
          <Link
            to={`/dashboard/product/images/${row.original.productId}/${row.original.color._id}`}
          >
            <Button size={"icon"} variant={"outline"}>
              <Image size={20} />
            </Button>
          </Link>
        </div>
      );
    },
  },
];
