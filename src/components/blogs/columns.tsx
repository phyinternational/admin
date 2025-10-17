import { ColumnDef } from "@tanstack/react-table";
import { Blog } from "./blogs";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { Pencil } from "lucide-react";

export const BlogColumns: ColumnDef<Blog>[] = [
  {
    header: "Title",
    accessorKey: "title",
  },
  {
    header: "Display Image",
    accessorKey: "displayImage",
    cell: ({ row }) => {
      const imageUrl = row.original.displayImage[0]?.url;
      return (
        <img src={imageUrl} alt="Blog Display" style={{ maxWidth: "100px" }} />
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
    accessorKey: "actions",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <Link to={`/dashboard/blogs/${row.original._id}`}>
            <Button size={"icon"} variant={"outline"}>
              <Pencil size={18} />
            </Button>
          </Link>
        </div>
      );
    },
  },
];
