
import { useEffect, useRef, useState } from "react";
import LoadingScreen from "../common/loading-screen";
import DataTable from "../table/data-table-server";
import Product from "./product";
import { useGetProducts } from "@/lib/react-query/product-query";
import { Input } from "../ui/input";
import { ProductColumns } from "./column";

type TableFilter = {
  date: string;
  pageIndex: number;
  pageSize: number;
  search: string;
};
const ProductList = () => {
  const [search, setSearch] = useState<string>("");
  const searchInput = useRef<HTMLInputElement>();
  const [products, setproducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState<TableFilter>({
    pageIndex: 2,
    pageSize: 10,
    date: "",
    search: "",
  });

  const changePage = ({ pageIndex }: { pageIndex: number }) => {
    setFilter((prev) => ({ ...prev, pageIndex: pageIndex }));
  };

  const { isLoading, data, isSuccess } = useGetProducts(filter);

  useEffect(() => {
    if (isSuccess) {
      const products: Product[] = Array.from(data.data.data.products);

      setproducts(products);
    }
  }, [isSuccess, data]);

  useEffect(() => {
    if (searchInput.current) searchInput.current.focus();
  });
  useEffect(() => {
    setFilter({ search, pageIndex: 0, pageSize: 10, date: "" });
  }, [search]);

  // console.log(data?.data?.data)

  return (
    <section className="">
      <h2 className="mb-2 text-3xl tracking-wide">Products List</h2>
      <div className="mt-4 rounded-lg border bg-white px-4 py-6">
        <header className="mb-5  ml-2 flex items-center">
          <span className="mr-3 h-8 w-5 rounded-md bg-violet-300"></span>
          <Input
            value={search}
            placeholder="Search products here"
            onChange={(e) => setSearch(e.target.value)}
            className="w-96 placeholder:text-base"
          />
        </header>
        {isSuccess && (
          <DataTable
            columns={ProductColumns}
            data={products}
            page={filter.pageIndex}
            totalPage={data.data?.data?.totalPage}
            changePage={changePage}
          />
        )}
        {isLoading && <LoadingScreen />}
      </div>
    </section>
  );
};

export default ProductList;
