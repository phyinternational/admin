import { ColumnDef } from "@tanstack/react-table";
import { IProductRating } from "./product-rating"; // Assuming ProductRating is exported from your model file
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { Pencil } from "lucide-react";
import { StarFilledIcon } from "@radix-ui/react-icons";

export const ProductRatingColumns: ColumnDef<IProductRating>[] = [
  {
    header: "User",
    accessorKey: "user",
    cell: ({ row }) => {
      return <span>{row.original.user}</span>; // Adjust this according to your user data structure
    },
  },
  {
    header: "Active",
    accessorKey: "isActive",
    cell: ({ row }) => {
      return <span>{row.original.isActive ? "Yes" : "No"}</span>;
    },
  },
  {
    header: "Rating",
    accessorKey: "rating",
    cell: ({ row }) => {
      return (
        <span className="flex gap-2">
          {row.original.rating}
          <StarFilledIcon className="w-5 h-5 text-yellow-500" />
        </span>
      );
    },
  },
  {
    header: "Review Text",
    accessorKey: "reviewText",
    cell: ({ row }) => {
      return <span>{row.original.reviewText}</span>;
    },
  },
  {
    header: "Created At",
    accessorKey: "createdAt",
    cell: ({ row }) => {
      return new Date(row.original.createdAt).toLocaleString();
    },
  },
  {
    header: "Updated At",
    accessorKey: "updatedAt",
    cell: ({ row }) => {
      return new Date(row.original.updatedAt).toLocaleString();
    },
  },
  {
    header: "Actions",
    accessorKey: "actions",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <Link to={`/dashboard/product_ratings/${row.original._id}`}>
            <Button size={"icon"} variant={"outline"}>
              <Pencil size={18} />
            </Button>
          </Link>
        </div>
      );
    },
  },
];
