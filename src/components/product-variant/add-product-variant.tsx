import { useAddProductVariant } from "@/lib/react-query/product-query";
import ProductVariantForm, { ProductVariantType } from "./product-variant-form";
import { useParams } from "react-router";

const AddProductVariant = () => {
  const { id } = useParams();
  const { isPending, mutate } = useAddProductVariant();

  const onSubmit = (data: ProductVariantType) => {
    mutate(
      {
        productId: data.productId,
        size: data.size,
        price: Number(data.price),
        salePrice: Number(data.salePrice),
        stock: Number(data.stock),
        color: data.color,
      }
    );
  };

  console.log(isPending, "IsPending");

  if (!id)
    return (
      <div className=" h-screen flex justify-center items-center w-screen">
        <h1>Product not found</h1>
      </div>
    );

  const defaultValues: ProductVariantType = {
    productId: id ?? "",
    size: "",
    price: "0",
    salePrice: "0",
    stock: "0",
    color: "",
  };
  return (
    <section className="flex flex-col space-y-4">
      <header className="border-b mb-6 pb-4">
        <h1 className="text-2xl font-bold">Product Variant</h1>
        <p className="text-sm text-gray-500">
          Add a new product variant to the product
        </p>
      </header>{" "}
      <ProductVariantForm
        defaultValues={defaultValues}
        isPending={isPending}
        onSubmit={onSubmit}
      />
    </section>
  );
};

export default AddProductVariant;
