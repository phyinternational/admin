import { useEffect, useMemo, useRef, useState } from "react";
import LoadingScreen from "../common/loading-screen";
import { Input } from "../ui/input";
import { CategoryColumns } from "./columns";
import Category from "./category-model";
import { useGetCategories } from "@/lib/react-query/category-query";
import { DataTable } from "../table/data-table";
import { FilterSelect } from "../filters/filter-select";

type TableFilter = {
  date: string;
  pageIndex: number;
  pageSize: number;
  search: string;
  status: string;
};
// Category list component for managing and viewing all categories
const CategoryList = () => {
  const [search, setSearch] = useState<string>("");
  const searchInput = useRef<HTMLInputElement>();
  const [filter, setFilter] = useState<TableFilter>({
    pageIndex: 0,
    pageSize: 10,
    date: "",
    search: "",
    status: "",
  });

  const { isLoading, data, isSuccess } = useGetCategories();

  const categories: Category[] = useMemo(() => {
    if (isSuccess) {
      const categories: Category[] = Array.from(data.data.data.categories);

      let filtered = categories
        .filter((category) =>
          category?.name
            ?.toLocaleLowerCase()
            .includes(filter?.search.toLocaleLowerCase())
        )
        .filter((category) => !category.parentId);

      if (filter.status) {
        filtered = filtered.filter((category) =>
          category.isActive === (filter.status === "active")
        );
      }

      return filtered;
    }
    return [];
  }, [isSuccess, data, filter.search, filter.status]);

  useEffect(() => {
    if (searchInput.current) searchInput.current.focus();
  }, []);
  useEffect(() => {
    setFilter((prev) => ({ ...prev, search, pageIndex: 0 }));
  }, [search]);

  return (
    <section className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent whitespace-nowrap">
            Category Management
          </h2>
          <p className="text-sm text-gray-500 mt-1">Organize and manage your product categories</p>
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
              placeholder="Search categories here"
              onChange={(e) => setSearch(e.target.value)}
              className="w-full placeholder:text-base"
            />
          </div>
          <FilterSelect
            label="Status"
            value={filter.status}
            onChange={(status) => setFilter((prev) => ({ ...prev, status }))}
            options={[
              { value: "active", label: "Active" },
              { value: "inactive", label: "Inactive" },
            ]}
          />
        </header>
        <div className="overflow-x-auto">
          {isSuccess && <DataTable columns={CategoryColumns} data={categories} />}
        </div>
        {isLoading && <LoadingScreen />}
      </div>
    </section>
  );
};

export default CategoryList;
