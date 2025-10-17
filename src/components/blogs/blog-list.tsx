import { useEffect, useRef, useState } from "react";
import LoadingScreen from "../common/loading-screen";
import DataTable from "../table/data-table-server";
import { Input } from "../ui/input";
import { Blog } from "./blogs";
import { BlogColumns } from "./columns";
import { useGetBlogs } from "@/lib/react-query/blog-query";


type TableFilter = {
  date: string;
  pageIndex: number;
  pageSize: number;
  search: string;
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
  });

  const changePage = ({ pageIndex }: { pageIndex: number }) => {
    setFilter((prev) => ({ ...prev, pageIndex: pageIndex }));
  };

  const { isLoading, data, isSuccess } = useGetBlogs();

  useEffect(() => {
    if (isSuccess) {
      const blogs: Blog[] = Array.from(data.data.data.blogs);

      setblogss(blogs);
    }
  }, [isSuccess, data]);

  useEffect(() => {
    if (searchInput.current) searchInput.current.focus();
  });
  useEffect(() => {
    setFilter({ search, pageIndex: 0, pageSize: 10, date: "" });
  }, [search]);

  return (
    <section className="">
      <h2 className="mb-2 text-3xl tracking-wide">Blogs List</h2>
      <div className="mt-4 rounded-lg border bg-white px-4 py-6">
        <header className="mb-5  ml-2 flex items-center">
          <span className="mr-3 h-8 w-5 rounded-md bg-violet-300"></span>
          <Input
            value={search}
            placeholder="Search Blogs here"
            onChange={(e) => setSearch(e.target.value)}
            className="w-96 placeholder:text-base"
          />
          
        </header>
        {isSuccess && (
          <DataTable
            columns={BlogColumns}
            data={blogs}
            page={filter.pageIndex}
            totalPage={Math.ceil(data.data.data?.total / data.data.data?.limit)}
            changePage={changePage}
          />
        )}
        {isLoading && <LoadingScreen />}
      </div>
    </section>
  );
};

export default BlogsList;
