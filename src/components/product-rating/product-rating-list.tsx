import { useMemo, useState } from "react";
import LoadingScreen from "../common/loading-screen";
import { DataTable } from "../table/data-table";
import { Input } from "../ui/input";
import { IProductRating } from "./product-rating";
import { useGetProductRatings } from "@/lib/react-query/product-rating-query";
import { ProductRatingColumns } from "./columns";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";

const ProductRatingList = () => {
  const [search, setSearch] = useState<string>("");
  const { productId } = useParams();

  const { data, isLoading, isSuccess } = useGetProductRatings(productId!);

  const productRatings = useMemo(() => {
    if (isSuccess) {
      return data?.data?.productRating || ([] as IProductRating[]);
    }

    return [];
  }, [data, isSuccess]);

  console.log(productRatings);
  return (
    <section className="">
      <h2 className="mb-2 text-3xl tracking-wide">ProductRatings List</h2>
      <div className="mt-4 rounded-lg border bg-white px-4 py-6">
        <header className="mb-5  ml-2 flex items-center">
          <span className="mr-3 h-8 w-5 rounded-md bg-violet-300"></span>
          <Input
            value={search}
            placeholder="Search product Ratings here"
            onChange={(e) => setSearch(e.target.value)}
            className="w-96 placeholder:text-base"
          />
          <Link
            className="ml-auto"
            to={`/dashboard/product/add_rating/${productId}`}
          >
            <Button>
              <Plus size={20} className="mr-2" /> Add Rating
            </Button>
          </Link>
        </header>
        {isSuccess && (
          <DataTable columns={ProductRatingColumns} data={productRatings} />
        )}
        {isLoading && <LoadingScreen />}
      </div>
    </section>
  );
};

export default ProductRatingList;
