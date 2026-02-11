import { useEffect, useMemo, useRef, useState } from "react";
import LoadingScreen from "../common/loading-screen";
import DataTable from "../table/data-table-server";
import { Input } from "../ui/input";
import Coupon from "./coupons"; // Assuming you have a Coupon type defined
import { useGetCoupons } from "@/lib/react-query/coupon-query"; // Assuming you have a hook to fetch coupons
import { CouponColumns } from "./column"; // Assuming you have defined columns for the coupons table
import { FilterSelect } from "../filters/filter-select";
import dayjs from "dayjs";

type TableFilter = {
  startDate: string;
  endDate: string;
  pageIndex: number;
  pageSize: number;
  search: string;
  status: string;
};

const CouponsList = () => {
  const [search, setSearch] = useState<string>("");
  const searchInput = useRef<HTMLInputElement>();
  const [filter, setFilter] = useState<TableFilter>({
    pageIndex: 0,
    pageSize: 10,
    startDate: "",
    endDate: "",
    search: "",
    status: "",
  });

  const changePage = ({ pageIndex }: { pageIndex: number }) => {
    setFilter((prev) => ({ ...prev, pageIndex: pageIndex }));
  };

  const { isLoading, data, isSuccess } = useGetCoupons();

  const coupons: Coupon[] = useMemo(() => {
    // axios response -> response.data = { status, data: { coupons, pagination } }
    const raw = data?.data?.data?.coupons ?? [];
    try {
      let filtered = (Array.from(raw).filter((coupon: any) =>
        (coupon?.couponCode ?? "").toLowerCase().includes(search.toLowerCase())
      ) as Coupon[]) || [];

      if (filter.status) {
        const now = dayjs();
        filtered = filtered.filter((coupon: any) => {
          const isExpired = dayjs(coupon.expiryDate).isBefore(now);
          return filter.status === "active" ? !isExpired : isExpired;
        });
      }

      return filtered;
    } catch (e) {
      return [];
    }
  }, [data, filter, search, filter.status]);

  useEffect(() => {
    if (searchInput.current) searchInput.current.focus();
  });

  useEffect(() => {
    setFilter((prev) => ({ ...prev, search, pageIndex: 0 }));
  }, [search]);

  return (
    <section className="">
      <h2 className="mb-2 text-2xl md:text-3xl tracking-wide">Coupons List</h2>
      <div className="mt-4 rounded-lg border bg-white px-4 md:px-6 py-6">
        <header className="mb-5 ml-2 flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <span className="h-8 w-5 rounded-md bg-violet-300 flex-shrink-0"></span>
          <Input
            ref={searchInput}
            value={search}
            placeholder="Search Coupons here"
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-96 placeholder:text-base"
          />
          <FilterSelect
            label="Status"
            value={filter.status}
            onChange={(status) => setFilter((prev) => ({ ...prev, status }))}
            options={[
              { value: "active", label: "Active" },
              { value: "expired", label: "Expired" },
            ]}
          />
        </header>
        <div className="overflow-x-auto">
          {isSuccess && (
            <DataTable
              columns={CouponColumns}
              data={coupons}
              page={filter.pageIndex}
              totalPage={data?.data?.data?.pagination?.totalPages ?? 1}
              changePage={changePage}
            />
          )}
        </div>
        {isLoading && <LoadingScreen />}
      </div>
    </section>
  );
};

export default CouponsList;
