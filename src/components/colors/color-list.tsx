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
    <section className="">
      <h2 className="mb-2 text-2xl md:text-3xl tracking-wide">Color List</h2>
      <div className="mt-4 rounded-lg border bg-white px-4 md:px-6 py-6">
        <header className="mb-5 ml-2 flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <span className="flex-shrink-0 h-8 w-5 rounded-md bg-violet-300"></span>
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
