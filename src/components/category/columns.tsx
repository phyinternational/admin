import { ColumnDef } from "@tanstack/react-table";
import Category from "./category-model";
import { Button } from "../ui/button";
import { Eye, Pencil } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "../ui/badge";

export const CategoryColumns: ColumnDef<Category>[] = [
  {
    accessorKey: "imageUrl",
    header: "Category Image",
    cell: ({ row }) => (
      <div className=" justify-center">
        <img
          src={row.original.imageUrl}
          alt={row.original.name}
          className="w-24 h-15 bg-gray-50 rounded-md"
        />
      </div>
    ),
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => {
      const isActive: boolean = row.original?.isActive;
      return (
        <Badge variant={!isActive ? "destructive" : "default"}>
          {isActive ? "Active" : "Inactive"}
        </Badge>
      );
    },
  },

  {
    accessorKey: "name",
    header: "Category Name",
    cell: ({ row }) => (
      <div className="whitespace-nowrap text-sm font-medium">
        {row.original.name}
      </div>
    ),
  },

  {
    accessorKey: "type",
    header: "Category Type",
    cell: ({ row }) => (
      <div className="whitespace-nowrap font-medium text-gray-500">{row.original.type}</div>
    ),
  },

  {
    header: "Actions",
    cell: ({ row }) => <ActionColumn row={row} />,
  },
];

const ActionColumn = ({ row }: { row: any }) => {
  const { _id } = row.original;
  return (
    <div className="flex gap-4">
      <Link to={`/dashboard/categories/view/${_id}`}>
        <Button variant="outline" size={"sm"}>
          <Eye className="mr-2" size={18} /> View
        </Button>
      </Link>
      <Link to={`/dashboard/categories/edit/${_id}`}>
        <Button variant="outline" size={"sm"}>
          <Pencil className="mr-2" size={18} /> Edit
        </Button>
      </Link>
    </div>
  );
};
