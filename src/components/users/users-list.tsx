import { useEffect, useRef, useState } from "react";
import LoadingScreen from "../common/loading-screen";
import DataTable from "../table/data-table-server";
import { Input } from "../ui/input";
import IUsers from "./user";
import { UserColumns } from "./columns";
import { useGetAllUsers } from "@/lib/react-query/user-query";

type TableFilter = {
  date: string;
  pageIndex: number;
  pageSize: number;
  search: string;
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
  });

  const changePage = ({ pageIndex }: { pageIndex: number }) => {
    setFilter((prev) => ({ ...prev, pageIndex: pageIndex }));
  };

  const { isLoading, data, isSuccess } = useGetAllUsers(filter);

  useEffect(() => {
    if (isSuccess) {
      const userss: IUsers[] = Array.from(data.data.data.users);

      setuserss(userss);
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
      <h2 className="mb-2 text-3xl tracking-wide">Users List</h2>
      <div className="mt-4 rounded-lg border bg-white px-4 py-6">
        <header className="mb-5  ml-2 flex items-center">
          <span className="mr-3 h-8 w-5 rounded-md bg-violet-300"></span>
          <Input
            value={search}
            placeholder="Search Users here"
            onChange={(e) => setSearch(e.target.value)}
            className="w-96 placeholder:text-base"
          />
        </header>
        {isSuccess && (
          <DataTable
            columns={UserColumns}
            data={users}
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

export default UsersList;
