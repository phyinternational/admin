import { useMemo, useState } from "react";
import LoadingScreen from "../common/loading-screen";
import { Input } from "../ui/input";
import { ProductVariantColumns } from "./columns";
import { useGetProductVariants } from "@/lib/react-query/product-query";
import { useParams } from "react-router";
import { DataTable } from "../table/data-table";
import ProductVariant from "./product-variant";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import CustomSelect from "../ui/custom-select";

const ProductVariantList = () => {
  const [filter, setFilter] = useState({
    size: "",
    color: "",
    search: "",
  });

  const { id } = useParams();

  const { isLoading, data, isSuccess } = useGetProductVariants(String(id));

  const productVariants: ProductVariant[] = useMemo(() => {
    if (isSuccess && data) {
      let filteredVariants = Array.from(data.data.data.variants).filter(
        (variant: any) =>
          variant.size.toLowerCase().includes(filter.search.toLowerCase()) ||
          variant.price.toString().includes(filter.search.toLowerCase())
      ) as ProductVariant[];

      if (filter.size) {
        if (filter.size !== "all")
          filteredVariants = filteredVariants.filter(
            (variant) => variant.size === filter.size
          );
      }
      if (filter.color) {
        if (filter.color !== "all")
          filteredVariants = filteredVariants.filter(
            (variant) => variant.color.slug === filter.color
          );
      }
      return filteredVariants;
    }
    return [];
  }, [isSuccess, data, filter]);

  const sizeOptions = useMemo(() => {
    const sizes = new Set<string>();
    if (!data) return [];
    Array.from(data.data.data.variants).forEach((variant: any) => {
      sizes.add(variant.size);
    });
    const sizeOptions = Array.from(sizes).map((size: any) => ({
      label: size,
      value: size,
    }));
    const allSizeOption = {
      label: "All",
      value: "all",
    };
    return [allSizeOption, ...sizeOptions];
  }, [data]);

  const colorOptions = useMemo(() => {
    const colors = new Set<string>();
    if (!data) return [];
    Array.from(data.data.data.variants).forEach((variant: any) => {
      colors.add(variant.color?.slug);
    });

    const coloroptions = Array.from(colors).map((color: any) => ({
      label: color,
      value: color,
    }));

    const allColorOption = {
      label: "All",
      value: "all",
    };
    return [allColorOption, ...coloroptions];
  }, [data]);

  return (
    <section className="">
      <h2 className="mb-2 text-3xl tracking-wide">ProductVariant List</h2>
      <div className="mt-4 rounded-lg border bg-white px-4 py-6">
        <header className="mb-5  ml-2 flex items-center">
          <span className="mr-3 h-8 w-5 rounded-md bg-violet-300"></span>
          <Input
            value={filter.search}
            placeholder="Search ProductVariant here"
            onChange={(e) => setFilter({ ...filter, search: e.target.value })}
            className="w-96 placeholder:text-base"
          />
          <CustomSelect
            options={sizeOptions}
            placeholder="Filter by Size"
            value={filter.size}
            onValueChange={(e) => setFilter({ ...filter, size: e })}
            className="w-40 ml-4"
          />
          <CustomSelect
            options={colorOptions}
            placeholder="Filter by Color"
            onValueChange={(e) => setFilter({ ...filter, color: e })}
            value={filter.color}
            className="w-40 ml-4"
          />

          <Link className="ml-auto" to={`/dashboard/product-variant/${id}/add`}>
            <Button size={"sm"} color={"violet"}>
              <Plus size={16} className="mr-2" />
              Add Product Variant
            </Button>
          </Link>
        </header>
        {isSuccess && (
          <DataTable columns={ProductVariantColumns} data={productVariants} />
        )}
        {isLoading && <LoadingScreen />}
      </div>
    </section>
  );
};

export default ProductVariantList;
