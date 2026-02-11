import { useEffect, useRef, useState, useMemo } from "react";
import LoadingScreen from "../common/loading-screen";
import DataTable from "../table/data-table-server";
import { Input } from "../ui/input";
import IUsers from "./user";
import { UserColumns } from "./columns";
import { useGetAllUsers } from "@/lib/react-query/user-query";
import { DateRangeFilter } from "../filters/date-range-filter";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

dayjs.extend(isBetween);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

type TableFilter = {
  date: string;
  pageIndex: number;
  pageSize: number;
  search: string;
  startDate: string;
  endDate: string;
};
const UsersList = () => {
  const [search, setSearch] = useState<string>("");
  const searchInput = useRef<HTMLInputElement>();
  const [users, setuserss] = useState<IUsers[]>([]);
  const [filter, setFilter] = useState<TableFilter>({
    pageIndex: 0,
    pageSize: 10,
    date: "",
    search: "",
    startDate: "",
    endDate: "",
  });

  const changePage = ({ pageIndex }: { pageIndex: number }) => {
    setFilter((prev) => ({ ...prev, pageIndex: pageIndex }));
  };

  const { isLoading, data, isSuccess } = useGetAllUsers(filter);

  const filteredUsers = useMemo(() => {
    if (isSuccess) {
      const userss: IUsers[] = Array.from(data.data.data.users);

      let filtered = userss.filter((user: any) =>
        (user?.name ?? "").toLowerCase().includes(search.toLowerCase()) ||
        (user?.email ?? "").toLowerCase().includes(search.toLowerCase())
      );

      if (filter.startDate || filter.endDate) {
        filtered = filtered.filter((user: any) => {
          const createdDate = dayjs(user.createdAt);
          const start = filter.startDate ? dayjs(filter.startDate) : null;
          const end = filter.endDate ? dayjs(filter.endDate) : null;

          if (start && end) {
            return createdDate.isBetween(start, end, null, "[]");
          } else if (start) {
            return createdDate.isSameOrAfter(start);
          } else if (end) {
            return createdDate.isSameOrBefore(end);
          }
          return true;
        });
      }

      return filtered;
    }
    return [];
  }, [isSuccess, data, search, filter.startDate, filter.endDate]);

  useEffect(() => {
    setuserss(filteredUsers);
  }, [filteredUsers]);

  useEffect(() => {
    if (searchInput.current) searchInput.current.focus();
  });
  useEffect(() => {
    setFilter((prev) => ({ ...prev, search, pageIndex: 0 }));
  }, [search]);

  return (
    <section className="">
      <h2 className="mb-2 text-2xl md:text-3xl tracking-wide">Users List</h2>
      <div className="mt-4 rounded-lg border bg-white px-4 md:px-6 py-6">
        <header className="mb-5 ml-2 flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-wrap">
          <span className="flex-shrink-0 h-8 w-5 rounded-md bg-violet-300"></span>
          <Input
            value={search}
            placeholder="Search Users here"
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-96 placeholder:text-base"
          />
          <DateRangeFilter
            label="Join Date"
            startDate={filter.startDate}
            endDate={filter.endDate}
            onStartDateChange={(date) =>
              setFilter((prev) => ({ ...prev, startDate: date }))
            }
            onEndDateChange={(date) =>
              setFilter((prev) => ({ ...prev, endDate: date }))
            }
          />
        </header>
        {isSuccess && (
          <div className="overflow-x-auto">
            <DataTable
              columns={UserColumns}
              data={users}
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

export default UsersList;
