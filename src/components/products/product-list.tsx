
import { useEffect, useRef, useState, useMemo } from "react";
import LoadingScreen from "../common/loading-screen";
import DataTable from "../table/data-table-server";
import Product from "./product";
import { useGetProducts } from "@/lib/react-query/product-query";
import { useGetCategories } from "@/lib/react-query/category-query";
import { Input } from "../ui/input";
import { ProductColumns } from "./column";
import { FilterSelect } from "../filters/filter-select";

type TableFilter = {
  date: string;
  pageIndex: number;
  pageSize: number;
  search: string;
  category: string;
  status: string;
};
const ProductList = () => {
  const [search, setSearch] = useState<string>("");
  const searchInput = useRef<HTMLInputElement>(null);
  const [filter, setFilter] = useState<TableFilter>({
    pageIndex: 0,
    pageSize: 10,
    date: "",
    search: "",
    category: "",
    status: "",
  });

  const { data: categoriesData, isSuccess: categoriesSuccess } = useGetCategories();
  const categoryOptions = useMemo(() => {
    if (categoriesSuccess && categoriesData) {
      return Array.from(categoriesData.data.data.categories)
        .filter((cat: any) => !cat.parentId)
        .map((cat: any) => ({ value: cat._id, label: cat.name }));
    }
    return [];
  }, [categoriesSuccess, categoriesData]);

  const changePage = ({ pageIndex }: { pageIndex: number }) => {
    setFilter((prev) => ({ ...prev, pageIndex: pageIndex }));
  };

  const { isLoading, data, isSuccess } = useGetProducts(filter);

  const products = useMemo(() => {
    if (isSuccess && data) {
      let filtered: Product[] = Array.from(data.data.data.products);

      // Client-side filtering as fallback since backend filters might be inconsistent
      if (filter.category) {
        filtered = filtered.filter((product) => {
          const cat: any = product.category;
          return cat === filter.category || cat?._id === filter.category;
        });
      }

      if (filter.status) {
        filtered = filtered.filter((product) =>
          product.isActive === (filter.status === "active")
        );
      }

      return filtered;
    }
    return [];
  }, [isSuccess, data, filter.category, filter.status]);

  useEffect(() => {
    if (searchInput.current) searchInput.current.focus();
  }, []);
  useEffect(() => {
    setFilter((prev) => ({ ...prev, search, pageIndex: 0 }));
  }, [search]);

  // console.log(data?.data?.data)

  return (
    <section className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent whitespace-nowrap">
            Products Management
          </h2>
          <p className="text-sm text-gray-500 mt-1">View and manage your product catalog</p>
        </div>
      </div>
      <div className="rounded-lg border bg-white px-4 md:px-6 py-6 shadow-sm">
        <header className="mb-5 ml-2 flex flex-col sm:flex-row items-start sm:items-end gap-3">
          <span className="h-8 w-5 rounded-md bg-violet-300 flex-shrink-0 mb-1"></span>
          <div className="flex flex-col gap-2 w-full sm:w-96">
            <label className="text-sm font-medium text-gray-700">Search</label>
            <Input
              ref={searchInput}
              value={search}
              placeholder="Search products here"
              onChange={(e) => setSearch(e.target.value)}
              className="w-full placeholder:text-base"
            />
          </div>
          <FilterSelect
            label="Category"
            value={filter.category}
            onChange={(category) => setFilter((prev) => ({ ...prev, category, pageIndex: 0 }))}
            options={categoryOptions}
          />
          <FilterSelect
            label="Status"
            value={filter.status}
            onChange={(status) => setFilter((prev) => ({ ...prev, status, pageIndex: 0 }))}
            options={[
              { value: "published", label: "Published" },
              { value: "draft", label: "Draft" },
            ]}
          />
        </header>
        <div className="overflow-x-auto">
          {isSuccess && (
            <DataTable
              columns={ProductColumns}
              data={products}
              page={filter.pageIndex}
              totalPage={data.data?.data?.totalPage}
              changePage={changePage}
            />
          )}
        </div>
        {isLoading && <LoadingScreen />}
      </div>
    </section>
  );
};

export default ProductList;
