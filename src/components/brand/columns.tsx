import { ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { Brand } from "./brand";
import React from "react";
import { useDeleteBrand } from "@/lib/react-query/brand-query";
import { Dialog, DialogContent, DialogDescription } from "@/components/ui/dialog";

export const BrandColumns: ColumnDef<Brand>[] = [
  {
    header: "Name", // Change header to "Name"
    accessorKey: "brand_name", // Change accessorKey to "name"
  },
  {
  header: () => <div className="w-full text-right pr-4">Actions</div>, // Align header to the right
    accessorKey: "actions", // Keep accessorKey as "actions"
    cell: ({ row }) => {
      const [isDialogOpen, setIsDialogOpen] = React.useState(false);
      const DeleteButton = () => {
        const deleteMutation = useDeleteBrand();
        const handleOpen = () => setIsDialogOpen(true);
        return (
          <div className="flex items-center gap-2 justify-end">
            <Link to={`/dashboard/brands/edit/${row.original._id}`}>
              <Button size={"icon"} variant={"outline"}>
                <Pencil size={18} />
              </Button>
            </Link>
            <Button size={"icon"} variant={"outline"} onClick={handleOpen}>
              <Trash2 size={18} />
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogContent className="sm:max-w-[425px]">
                <DialogDescription className="text-center">
                  Are you sure you want to delete this brand?
                </DialogDescription>
                <div className="mt-4 flex justify-center gap-4">
                  <Button
                    variant="destructive"
                    onClick={async () => {
                      if (!row.original._id) {
                        setIsDialogOpen(false);
                        return;
                      }
                      await deleteMutation.mutateAsync(row.original._id);
                      setIsDialogOpen(false);
                    }}
                  >
                    Delete
                  </Button>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        );
      };

      return <DeleteButton />;
    },
  },
];
