import { useEffect, useRef, useState, useMemo } from "react";
import LoadingScreen from "../common/loading-screen";
import DataTable from "../table/data-table-server";
import { Input } from "../ui/input";
import { Blog } from "./blogs";
import { BlogColumns } from "./columns";
import { useGetBlogs } from "@/lib/react-query/blog-query";
import { FilterSelect } from "../filters/filter-select";


type TableFilter = {
  date: string;
  pageIndex: number;
  pageSize: number;
  search: string;
  status: string;
};
const BlogsList = () => {
  const [search, setSearch] = useState<string>("");
  const searchInput = useRef<HTMLInputElement>();
  const [blogs, setblogss] = useState<Blog[]>([]);
  const [filter, setFilter] = useState<TableFilter>({
    pageIndex: 0,
    pageSize: 10,
    date: "",
    search: "",
    status: "",
  });

  const changePage = ({ pageIndex }: { pageIndex: number }) => {
    setFilter((prev) => ({ ...prev, pageIndex: pageIndex }));
  };

  const { isLoading, data, isSuccess } = useGetBlogs();

  const filteredBlogs = useMemo(() => {
    if (isSuccess && data) {
      const blogs: Blog[] = Array.from(data.data.data.blogs);
      
      let filtered = blogs.filter((blog: any) =>
        (blog?.title ?? "").toLowerCase().includes(search.toLowerCase())
      );

      if (filter.status) {
        filtered = filtered.filter((blog: any) =>
          filter.status === "published" ? blog.isActive : !blog.isActive
        );
      }

      return filtered;
    }
    return [];
  }, [isSuccess, data, search, filter.status]);

  useEffect(() => {
    setblogss(filteredBlogs);
  }, [filteredBlogs]);

  useEffect(() => {
    if (searchInput.current) searchInput.current.focus();
  });
  useEffect(() => {
    setFilter((prev) => ({ ...prev, search, pageIndex: 0 }));
  }, [search]);

  return (
    <section className="">
      <h2 className="mb-2 text-2xl md:text-3xl tracking-wide">Blogs List</h2>
      <div className="mt-4 rounded-lg border bg-white px-4 md:px-6 py-6">
        <header className="mb-5 ml-2 flex flex-col sm:flex-row items-start sm:items-end gap-3">
          <span className="h-8 w-5 rounded-md bg-violet-300 flex-shrink-0 mb-1"></span>
          <Input
            value={search}
            placeholder="Search Blogs here"
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
        {isSuccess && (
          <div className="overflow-x-auto">
            <DataTable
              columns={BlogColumns}
              data={blogs}
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

export default BlogsList;
