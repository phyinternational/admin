import { ColumnDef } from "@tanstack/react-table";
import { Blog } from "./blogs";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { useDeleteBlog, useToggleBlogStatus } from "@/lib/react-query/blog-query";
import { Switch } from "../ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import React from "react";

export const BlogColumns: ColumnDef<Blog>[] = [
  {
    header: "Title",
    accessorKey: "title",
  },
  {
    header: "Display Image",
    accessorKey: "displayImage",
    cell: ({ row }) => {
      const imageUrl = row.original.displayImage?.[0]?.url;
      // Force a rectangular thumbnail with rounded corners and a border.
      // Use object-cover to crop/scale images of any original dimensions.
      if (!imageUrl) {
        return (
          <div className="w-28 h-20 rounded-lg border bg-gray-100 flex items-center justify-center text-sm text-gray-500">
            No Image
          </div>
        );
      }

      return (
        <img
          src={imageUrl}
          alt="Blog Display"
          className="w-28 h-20 rounded-lg border object-cover"
          loading="lazy"
        />
      );
    },
  },
  {
    header: "Status",
    accessorKey: "isActive",
    cell: ({ row }) => {
      const toggleMutation = useToggleBlogStatus();
      return (
        <div className="flex items-center gap-2">
          <Switch 
            checked={row.original.isActive} 
            onCheckedChange={() => toggleMutation.mutate(row.original._id)}
            disabled={toggleMutation.isPending}
          />
          <span className={row.original.isActive ? "text-green-600" : "text-red-600 text-sm font-medium"}>
            {row.original.isActive ? "Active" : "Inactive"}
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
    accessorKey: "actions",
    cell: ({ row }) => {
      const [isDialogOpen, setIsDialogOpen] = React.useState(false);
      const deleteMutation = useDeleteBlog();
      
      const handleDelete = async () => {
        setIsDialogOpen(true);
      };

      return (
        <div className="flex items-center gap-2">
          <Link to={`/dashboard/blogs/${row.original._id}`}>
            <Button size={"icon"} variant={"outline"}>
              <Pencil size={18} />
            </Button>
          </Link>
          <Button size={"icon"} variant={"outline"} onClick={handleDelete} className="text-red-600 hover:text-red-700 hover:bg-red-50">
            <Trash2 size={18} />
          </Button>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogDescription className="text-center pt-4 text-lg font-semibold">
                Are you sure you want to delete this blog?
              </DialogDescription>
              <div className="mt-4 flex justify-center gap-4">
                <Button
                  variant="destructive"
                  onClick={async () => {
                    await deleteMutation.mutateAsync(row.original._id);
                    setIsDialogOpen(false);
                  }}
                  disabled={deleteMutation.isPending}
                >
                  {deleteMutation.isPending ? "Deleting..." : "Delete"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      );
    },
  },
];
