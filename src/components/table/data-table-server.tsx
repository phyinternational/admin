import {
  ColumnDef,
  PaginationState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ReactNode, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import ErrorBoundary from "../ui/error-boundary";
import { Button } from "../ui/button";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  showOptions?: boolean;
  hideFilterButton?: boolean;
  hideColumnsInMobile?: boolean;
  totalPage: number;
  page?: number;
  showSearch?: boolean;
  changePage: (page: PaginationState) => void;
  showHeader?: boolean;
  children?: ReactNode;
  selectedRows?: any;
  className?: string;
  rowClassName?: string;
  setSelectedRows?: (data: any) => void;
}

export default function DataTable<TData, TValue>({
  columns,
  totalPage,
  data,
  page = 0,
  rowClassName,
  className,
  showHeader = true,
  changePage,
  selectedRows,
  setSelectedRows,
}: DataTableProps<TData, TValue>) {
  const [rowSelection] = useState(selectedRows ?? {});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: page,
    pageSize: 10,
  });

  useEffect(() => {
    changePage(pagination);
  }, [pagination]);
  const table = useReactTable({
    data,
    columns,
    manualPagination: true,
    enableGlobalFilter: true,
    state: { pagination: pagination },
    pageCount: totalPage,
    onPaginationChange: setPagination,
    manualFiltering: true,
    getCoreRowModel: getCoreRowModel(),
    /*    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter, */
  });

  useEffect(() => {
    if (setSelectedRows) {
      setSelectedRows(rowSelection);
    }
  }, [rowSelection]);

  return (
    <div>
      <div className={cn("rounded-md dark:bg-dark-primary overflow-x-auto", className)}>
        <Table>
          {showHeader && (
            <TableHeader>
              {table?.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="text-xs md:text-sm text-gray-800 dark-border bg-slate-100 dark:text-gray-200 font-medium whitespace-nowrap"
                    >
                      <span className="flex justify-between px-2 md:px-4 text-gray-700 dark:text-gray-200 font-semibold items-center">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </span>
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
          )}
          <TableBody>
            {table?.getRowModel().rows?.length ? (
              table?.getRowModel().rows.map((row) => (
                <TableRow
                  className={cn("dark:text-gray-50 dark-border", rowClassName)}
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row?.getVisibleCells().map((cell) => (
                    <TableCell className="px-2 md:px-6 py-2">
                      <ErrorBoundary key={cell.id}>
                        {flexRender(
                          cell?.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </ErrorBoundary>
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex w-full flex-col sm:flex-row items-start sm:items-center border-t bg-white px-4 md:px-5 pt-8 gap-4">
        <div className="font-semibold text-sm md:text-base">
          {pagination.pageIndex + 1} of {totalPage ? totalPage : 1}
          {" page(s)"} shown.
        </div>
        <div className="ml-auto w-full sm:w-fit flex gap-2">
          <Button
            variant="outline"
            className="text-black flex-1 sm:flex-none text-xs md:text-sm"
            disabled={!table.getCanPreviousPage()}
            onClick={table.previousPage}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            className="text-black flex-1 sm:flex-none text-xs md:text-sm"
            disabled={!table.getCanNextPage()}
            onClick={table.nextPage}
          >
            next page
          </Button>
        </div>
      </div>
    </div>
  );
}
