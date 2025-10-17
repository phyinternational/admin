import {
  useGetVariant,
  useUpdateProductVariant,
} from "@/lib/react-query/product-query";
import ProductVariantForm, { ProductVariantType } from "./product-variant-form";
import { useParams } from "react-router";
import LoadingScreen from "../common/loading-screen";
import { useMemo } from "react";

const AddProductVariant = () => {
  const { productVariantId } = useParams();
  const { isPending, mutate } = useUpdateProductVariant();
  const { isLoading, error, data } = useGetVariant(productVariantId);

  const defaultValues: ProductVariantType = useMemo(() => {
    if (data?.data.data.variant === undefined)
      return {
        productId: "",
        size: "",
        price: 0,
        salePrice: 0,
        stock: 0,
        color: "",
        imageUrls: [],
      };
    const defaultValues: any = {};
    defaultValues.productId = data?.data.data.variant.productId;
    defaultValues.color = data?.data.data.variant.color._id;
    defaultValues.size = String(
      data?.data.data.variant.size
    ).toLocaleUpperCase();
    defaultValues.isActive = data?.data.data.variant.isActive;
    defaultValues.imageUrls = data?.data.data.variant.imageUrls;
    defaultValues.stock = String(data?.data.data.variant.stock);
    defaultValues.price = String(data?.data.data.variant.price);
    defaultValues.salePrice = String(data?.data.data.variant.salePrice);

    return defaultValues;
  }, [data]);

  if (isLoading) return <LoadingScreen />;

  if (!productVariantId)
    return (
      <div className=" h-screen flex justify-center items-center w-screen">
        <h1>Product not found</h1>
      </div>
    );

  if (error)
    return (
      <div className=" h-screen flex justify-center items-center w-screen">
        <h1>Product not found</h1>
      </div>
    );

  const onSubmit = (data: any) => {
    const payload = {
      ...data,
      _id: productVariantId,
      stock: Number(data.stock),
      price: Number(data.price),
      salePrice: Number(data.salePrice),
      productId: data?.productId ?? "",
    };
    mutate(payload);
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
