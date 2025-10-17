import {
  useGetProduct,
  useGetProductImages,
  useUpsertProductImages,
} from "@/lib/react-query/product-query";
import ProductImageForm, { ProductImageType } from "./product-image-form";
import { useParams } from "react-router";
import { useGetColorById } from "@/lib/react-query/color-query";
import LoadingScreen from "../common/loading-screen";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const UpdateProductImage = () => {
  const { productId, colorId } = useParams();
  const { isPending, mutate } = useUpsertProductImages();

  const { data, isLoading } = useGetProduct(productId ?? "");
  const { data: colorData, isLoading: colorLoading } = useGetColorById(
    colorId ?? ""
  );

  const { data: imagedata, isLoading: imageLoading } = useGetProductImages(
    productId ?? "",
    colorId ?? ""
  );

  if (isLoading || colorLoading || imageLoading) return <LoadingScreen />;

  const imageUrls = imagedata?.data?.data?.productImage?.imageUrls ?? [];
  const onSubmit = (data: any) => {
    // If the form provided FormData (files), forward it directly to the mutation
    if (data instanceof FormData) {
      mutate(data as any);
      return;
    }

    // Otherwise handle the JSON payload as before
    mutate({
      productId: data.productId,
      color: data.color,
      imageUrls: data.imageUrls,
    });
  };

  const defaultValues: ProductImageType = {
    productId: productId ?? "",
    color: colorId ?? "",
    imageUrls: imageUrls,
  };

  return (
    <section className="flex flex-col space-y-4">
      <header className="border-b mb-6 pb-4">
        <h1 className="text-2xl font-bold">Product Variant</h1>
        <p className="text-sm text-gray-500">
          Add a new product variant to the product
        </p>
      </header>{" "}
      <section>
        <Card>
          <CardHeader>
            <CardTitle>Product</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">
              {data?.data?.data?.product?.productTitle} -{" "}
              {data?.data?.data?.brand}
            </p>
            <h2 className="text-xl font-semibold">
              {colorData?.data?.data?.color?.color_name}
            </h2>
          </CardContent>
        </Card>
      </section>
      <ProductImageForm
        defaultValues={defaultValues}
        isPending={isPending}
        onSubmit={onSubmit}
      />
    </section>
  );
};

export default UpdateProductImage;
