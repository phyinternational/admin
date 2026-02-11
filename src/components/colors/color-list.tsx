import { useEffect, useMemo, useRef, useState } from "react";
import LoadingScreen from "../common/loading-screen";
import DataTable from "../table/data-table-server";
import { Input } from "../ui/input";
import { ProductColor } from "./color";
import { useGetColor } from "@/lib/react-query/color-query";
import { ProductColorColumns } from "./columns";

type TableFilter = {
  date: string;
  pageIndex: number;
  pageSize: number;
  search: string;
};
const ColorList = () => {
  const [search, setSearch] = useState<string>("");
  const searchInput = useRef<HTMLInputElement>();
  const [filter, setFilter] = useState<TableFilter>({
    pageIndex: 0,
    pageSize: 10,
    date: "",
    search: "",
  });

  const changePage = ({ pageIndex }: { pageIndex: number }) => {
    setFilter((prev) => ({ ...prev, pageIndex: pageIndex }));
  };

  const { isLoading, data, isSuccess } = useGetColor();

  const colors: ProductColor[] = useMemo(() => {
    if (isSuccess) {
      return Array.from(data.data.data.colors).filter((color: any) =>
        color.color_name.toLowerCase().includes(search.toLowerCase())
      ) as ProductColor[];
    }
    return [];
  }, [isSuccess, data, search]);

  useEffect(() => {
    if (searchInput.current) searchInput.current.focus();
  });
  useEffect(() => {
    setFilter({ search, pageIndex: 0, pageSize: 10, date: "" });
  }, [search]);

  return (
    <section className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Colors Management
          </h2>
          <p className="text-sm text-gray-500 mt-1">Manage product color options and variants</p>
        </div>
      </div>
      <div className="rounded-lg border bg-white px-4 md:px-6 py-6 shadow-sm">
        <header className="mb-5 ml-2 flex flex-col sm:flex-row items-start sm:items-end gap-3">
          <span className="h-8 w-5 rounded-md bg-violet-300 flex-shrink-0 mb-1"></span>
          <Input
            value={search}
            placeholder="Search Color here"
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-96 placeholder:text-base"
          />
        </header>
        {isSuccess && (
          <div className="overflow-x-auto">
            <DataTable
              columns={ProductColorColumns}
              data={colors}
              page={filter.pageIndex}
              totalPage={Math.ceil(data.data.data?.total / data.data.data?.limit)}
              changePage={changePage}
            />
          </div>
        )}
        {isLoading && <LoadingScreen />}
      </div>
    </section>
  );
};

export default ColorList;
