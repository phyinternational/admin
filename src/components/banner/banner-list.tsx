import { useEffect, useMemo, useRef, useState } from "react";
import LoadingScreen from "../common/loading-screen";
import DataTable from "../table/data-table-server";
import { Input } from "../ui/input";
import { BannerColumns } from "./columns"; // Assuming you have columns defined for banners
import { useGetBanners, useReorderBanners } from "@/lib/react-query/banner-query"; // Assuming you have a hook for fetching banners
import { Banner } from "./banner"; // Update import
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import BannerReorderList from "./BannerReorderList";
import { ArrowUpDown, Save, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { FilterSelect } from "../filters/filter-select";

type TableFilter = {
  pageIndex: number;
  pageSize: number;
  search: string;
  status: string;
};

const BannersList = () => {
  const searchInput = useRef<HTMLInputElement>(null);
  const [filter, setFilter] = useState<TableFilter>({
    pageIndex: 0,
    pageSize: 10,
    search: "",
    status: "",
  });

  const [isReordering, setIsReordering] = useState(false);
  const [tempBanners, setTempBanners] = useState<Banner[]>([]);

  const changePage = ({ pageIndex }: { pageIndex: number }) => {
    setFilter((prev) => ({ ...prev, pageIndex }));
  };

  const { isLoading, data, isSuccess } = useGetBanners();
  const reorderMutation = useReorderBanners();

  const banners: Banner[] = useMemo(() => {
    if (isSuccess && data) {
      const banners: Banner[] = Array.from(data.data.data.banners);
      // Sort by position initially
      const sorted = [...banners].sort((a, b) => (a.position || 0) - (b.position || 0));

      let filtered = sorted;
      
      if (filter.search) {
        filtered = filtered.filter((banner) =>
          banner.title.toLowerCase().includes(filter.search.toLowerCase())
        );
      }

      if (filter.status) {
        filtered = filtered.filter((banner) =>
          banner.isActive === (filter.status === "published")
        );
      }

      return filtered;
    }
    return [];
  }, [isSuccess, data, filter.search, filter.status]);

  useEffect(() => {
    if (banners.length > 0 && !isReordering) {
      setTempBanners(banners);
    }
  }, [banners, isReordering]);

  useEffect(() => {
    if (searchInput.current) searchInput.current.focus();
  }, []);

  const handleSaveOrder = async () => {
    const orders = tempBanners.map((banner, index) => ({
      id: banner._id,
      position: index + 1,
    }));

    try {
      await reorderMutation.mutateAsync(orders);
      setIsReordering(false);
    } catch (error) {
      // Error handled by mutation toast
    }
  };

  const handleCancel = () => {
    setTempBanners(banners);
    setIsReordering(false);
  };

  return (
    <section className="">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <h2 className="text-2xl md:text-3xl tracking-wide">Banners List</h2>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          {!isReordering ? (
            <>
              <Button
                variant="outline"
                className="flex-1 sm:flex-none flex items-center justify-center gap-2"
                onClick={() => setIsReordering(true)}
              >
                <ArrowUpDown size={16} />
                Update Position
              </Button>
              <Link to="/dashboard/banners/add" className="flex-1 sm:flex-none">
                <Button className="w-full bg-violet-600 hover:bg-violet-700 text-white flex items-center justify-center">
                  Add Banner
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 text-gray-500"
                onClick={handleCancel}
              >
                <X size={16} />
                Cancel
              </Button>
              <Button
                className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2"
                onClick={handleSaveOrder}
                disabled={reorderMutation.isPending}
              >
                {reorderMutation.isPending ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Save size={16} />
                )}
                Save Changes
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="mt-4 rounded-lg border bg-white px-4 md:px-6 py-6">
        {!isReordering && (
          <header className="mb-5 ml-2 flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <span className="flex-shrink-0 h-8 w-5 rounded-md bg-violet-300"></span>
            <Input
              value={filter.search}
              placeholder="Search Banners here"
              onChange={(e) =>
                setFilter((prev) => ({ ...prev, search: e.target.value }))
              }
              className="w-full sm:w-96 placeholder:text-base"
              ref={searchInput}
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
        )}

        {isReordering ? (
          <div className="bg-gray-50 border border-dashed border-gray-300 rounded-lg p-6">
            <p className="text-sm text-gray-500 mb-6 text-center italic">
              Drag the banners to change their order. Positions will be assigned from top to bottom.
            </p>
            <BannerReorderList 
              banners={tempBanners} 
              onOrderChange={setTempBanners} 
            />
          </div>
        ) : (
          <>
            {isSuccess && (
              <div className="overflow-x-auto">
                <DataTable
                  columns={BannerColumns}
                  data={banners}
                  page={filter.pageIndex}
                  totalPage={Math.ceil(data.data.data?.total / data.data.data?.limit)}
                  changePage={changePage}
                />
              </div>
            )}
            {isLoading && <LoadingScreen />}
          </>
        )}
      </div>
    </section>
  );
};

export default BannersList;
