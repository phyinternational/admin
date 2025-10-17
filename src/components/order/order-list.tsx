import { useEffect, useMemo, useRef, useState } from "react";
import LoadingScreen from "../common/loading-screen";
import DataTable from "../table/data-table-server";
import { Input } from "../ui/input";
import { Order } from "./orders";
import { useGetOrders } from "@/lib/react-query/order-query";
import { OrderColumns } from "./order-columns";

type TableFilter = {
  date: string;
  pageIndex: number;
  pageSize: number;
  search: string;
};
const OrdersList = () => {
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

  const { isLoading, data, isSuccess } = useGetOrders(filter);

  const orders: Order[] = useMemo(() => {
    // Backend now returns { docs, page, limit, totalDocs, totalPages, hasPrevPage, hasNextPage }
    if (data) return data?.data?.data?.docs ?? data?.data?.data ?? [];

    return [];
  }, [data]);

  useEffect(() => {
    if (searchInput.current) searchInput.current.focus();
  });
  useEffect(() => {
    setFilter({ search, pageIndex: 0, pageSize: 10, date: "" });
  }, [search]);

  
  console.log(data?.data)

  return (
    <section className="">
      <h2 className="mb-2 text-3xl tracking-wide">Orders List</h2>
      <div className="mt-4 rounded-lg border bg-white px-4 py-6">
        <header className="mb-5  ml-2 flex items-center">
          <span className="mr-3 h-8 w-5 rounded-md bg-violet-300"></span>
          <Input
            value={search}
            placeholder="Search Orders here"
            onChange={(e) => setSearch(e.target.value)}
            className="w-96 placeholder:text-base"
          />
        </header>
        {isSuccess && (
          <DataTable
            columns={OrderColumns}
            data={orders}
            page={filter.pageIndex}
            totalPage={data?.data?.data?.totalPages ?? data?.data?.totalPage}
            changePage={changePage}
          />
        )}
        {isLoading && <LoadingScreen />}
      </div>
    </section>
  );
};

export default OrdersList;
