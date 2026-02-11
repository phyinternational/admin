import { useEffect, useMemo, useRef, useState } from "react";
import LoadingScreen from "../common/loading-screen";
import DataTable from "../table/data-table-server";
import { Input } from "../ui/input";
import { BrandColumns } from "./columns"; // Update import
import { useGetBrands } from "@/lib/react-query/brand-query"; // Update import
import { Brand } from "./brand";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";

type TableFilter = {
  pageIndex: number;
  pageSize: number;
  search: string;
};

const BrandsList = () => {
  // Rename component
  const searchInput = useRef<HTMLInputElement>(null); // Corrected useRef type
  const [filter, setFilter] = useState<TableFilter>({
    pageIndex: 0,
    pageSize: 10,
    search: "",
  });

  const changePage = ({ pageIndex }: { pageIndex: number }) => {
    setFilter((prev) => ({ ...prev, pageIndex: pageIndex }));
  };

  const { isLoading, data, isSuccess } = useGetBrands(); // Use useGetBrands hook

  const brands: Brand[] = useMemo(() => {
    if (isSuccess && data) {
      const brands: Brand[] = Array.from(data.data.data.brands);

      if (filter.search) {
        return brands.filter((brand) =>
          brand.brand_name.toLowerCase().includes(filter.search.toLowerCase())
        );
      }

      return brands;
    }
    return [];
  }, [isSuccess, data, filter.search]);

  useEffect(() => {
    if (searchInput.current) searchInput.current.focus();
  }, []);

  return (
    <section className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Brands Management
          </h2>
          <p className="text-sm text-gray-500 mt-1">Manage and view your product brands</p>
        </div>
      </div>
      <div className="rounded-lg border bg-white px-4 md:px-6 py-6 shadow-sm">
        <header className="mb-5 ml-2 flex flex-col sm:flex-row items-start sm:items-end gap-3">
          <span className="h-8 w-5 rounded-md bg-violet-300 flex-shrink-0 mb-1"></span>
          <Input
            value={filter.search}
            placeholder="Search Brands here"
            onChange={(e) =>
              setFilter((prev) => ({ ...prev, search: e.target.value }))
            }
            className="w-full sm:w-96 placeholder:text-base"
            ref={searchInput}
          />
          <Link to="/dashboard/brands/add" className="ml-auto">
            <Button>Add Brand</Button>
          </Link>
        </header>
        {isSuccess && (
          <div className="overflow-x-auto">
            <DataTable
              columns={BrandColumns} // Update columns
              data={brands} // Update data
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

export default BrandsList;
