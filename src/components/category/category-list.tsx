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
          category.isActive === (filter.status === "published")
        );
      }

      return filtered;
    }
    return [];
  }, [isSuccess, data, filter.search, filter.status]);

  useEffect(() => {
    if (searchInput.current) searchInput.current.focus();
  });
  useEffect(() => {
    setFilter((prev) => ({ ...prev, search, pageIndex: 0 }));
  }, [search]);

  return (
    <section className="">
      <h2 className="mb-2 text-2xl md:text-3xl tracking-wide">Category List</h2>
      <div className="mt-4 rounded-lg border bg-white px-4 md:px-6 py-6">
        <header className="mb-5 ml-2 flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <span className="h-8 w-5 rounded-md bg-violet-300 flex-shrink-0"></span>
          <Input
            ref={searchInput}
            value={search}
            placeholder="Search categorys here"
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-96 placeholder:text-base"
          />
          <FilterSelect
            label="Status"
            value={filter.status}
            onChange={(status) => setFilter((prev) => ({ ...prev, status }))}
            options={[
              { value: "published", label: "Published" },
              { value: "draft", label: "Draft" },
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
