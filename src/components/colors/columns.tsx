import { ColumnDef } from "@tanstack/react-table";
import { ProductColor } from "./color";
import { Button } from "../ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "../ui/badge";
import { useDeleteColor } from "@/lib/react-query/color-query";

export const ProductColorColumns: ColumnDef<ProductColor>[] = [
  {
    header: "Color Name",
    accessorKey: "color_name",
  },
  {
    header: "Slug",
    accessorKey: "slug",
  },
  {
    header: "is Deleted",
    accessorKey: "isActive",
    cell: ({ row }) => {
      return (
        <Badge variant={row.original.is_deleted ? "destructive" : "default"}>
          {row.original.is_deleted ? "Deleted" : "Active"}
        </Badge>
      );
    },
  },
  {
    header: "Hexcode",
    accessorKey: "hexcode",
    cell: ({ row }) => {
      return (
        <div className="flex items-center  gap-2">
          <div
            className="w-6 h-6 rounded-full"
            style={{
              backgroundColor: row.original.hexcode,
            }}
          />
          <span className="text-sm  font-semibold text-gray-700">
            {row.original.hexcode}
          </span>
        </div>
      );
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
    cell: ({ row }) => <ActionRow row={row} />,
  },
];

const ActionRow = ({ row }: { row: any }) => {
  const { mutate, isPending } = useDeleteColor();
  const deleteColor = () => {
    mutate(row.original._id);
  };
  return (
    <div className="flex gap-4">
      <Link
        to={`/dashboard/colors/${row.original._id}/edit`}
        className="text-blue-500"
      >
        <Button variant="outline" size={"icon"}>
          <Pencil className="text-gray-700" size={18} />
        </Button>
      </Link>
      <Button
        disabled={isPending}
        variant="destructive"
        size={"icon"}
        onClick={deleteColor}
      >
        <Trash2 size={18} />
      </Button>
    </div>
  );
};
