import { useEffect, useMemo, useRef, useState } from "react";
import LoadingScreen from "../common/loading-screen";
import DataTable from "../table/data-table-server";
import { Input } from "../ui/input";
import { BannerColumns } from "./columns"; // Assuming you have columns defined for banners
import { useGetBanners } from "@/lib/react-query/banner-query"; // Assuming you have a hook for fetching banners
import { Banner } from "./banner"; // Update import
import { Link } from "react-router-dom";
import { Button } from "../ui/button";

type TableFilter = {
  pageIndex: number;
  pageSize: number;
  search: string;
};

const BannersList = () => {
  const searchInput = useRef<HTMLInputElement>(null);
  const [filter, setFilter] = useState<TableFilter>({
    pageIndex: 0,
    pageSize: 10,
    search: "",
  });

  const changePage = ({ pageIndex }: { pageIndex: number }) => {
    setFilter((prev) => ({ ...prev, pageIndex }));
  };

  const { isLoading, data, isSuccess } = useGetBanners();

  const banners: Banner[] = useMemo(() => {
    if (isSuccess && data) {
      const banners: Banner[] = Array.from(data.data.data.banners);

      if (filter.search) {
        return banners.filter((banner) =>
          banner.title.toLowerCase().includes(filter.search.toLowerCase())
        );
      }
      console.log(banners);
      return banners;
    }
    return [];
  }, [isSuccess, data, filter.search]);

  useEffect(() => {
    if (searchInput.current) searchInput.current.focus();
  }, []);

  return (
    <section className="">
      <h2 className="mb-2 text-3xl tracking-wide">Banners List</h2>
      <div className="mt-4 rounded-lg border bg-white px-4 py-6">
        <header className="mb-5  ml-2 flex items-center">
          <span className="mr-3 h-8 w-5 rounded-md bg-violet-300"></span>
          <Input
            value={filter.search}
            placeholder="Search Banners here"
            onChange={(e) =>
              setFilter((prev) => ({ ...prev, search: e.target.value }))
            }
            className="w-96 placeholder:text-base"
            ref={searchInput}
          />
          <Link to="/dashboard/banners/add" className="ml-auto">
            <Button>Add Banner</Button>
          </Link>
        </header>
        {isSuccess && (
          <DataTable
            columns={BannerColumns}
            data={banners}
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

export default BannersList;
