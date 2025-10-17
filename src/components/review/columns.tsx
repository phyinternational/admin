import { ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { Pencil } from "lucide-react";
import { Brand } from "./brand";

export const BrandColumns: ColumnDef<Brand>[] = [
  {
    header: "Name", // Change header to "Name"
    accessorKey: "brand_name", // Change accessorKey to "name"
  },
  {
    header: "Actions", // Keep header as "Actions"
    accessorKey: "actions", // Keep accessorKey as "actions"
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          {/* Link to the brand detail page */}
          <Link to={`/dashboard/brands/edit/${row.original._id}`}>
            {/* Button with edit icon */}
            <Button size={"icon"} variant={"outline"}>
              <Pencil size={18} />
            </Button>
          </Link>
        </div>
      );
    },
  },
];
