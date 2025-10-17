import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import LoadingScreen from "../common/loading-screen";
import { useGetColor } from "@/lib/react-query/color-query";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import FormProvider from "../form/FormProvider";
import FormImageUploader from "../form/FormMultipleImages";

const ProductImageSchema = z.object({
  imageUrls: z.array(z.string().min(1, "Select a product")),
  color: z.string().min(1, "Select a color"),
  productId: z.string().min(1, "Select a product"),
});

export type ProductImageType = z.infer<typeof ProductImageSchema>;

type Props = {
  onSubmit: (data: ProductImageType) => void;
  defaultValues?: ProductImageType;
  isPending: boolean;
};

const ProductVariantImage = ({ onSubmit, defaultValues, isPending }: Props) => {
  const form = useForm<ProductImageType>({
    resolver: zodResolver(ProductImageSchema),
    defaultValues: defaultValues,
  });

  const { isLoading } = useGetColor();

  if (isLoading) return <LoadingScreen />;

  return (
    <main className="max-w-lg bg-white p-4 rounded-md mt-20">
      <FormProvider
        className="space-y-4"
        methods={form}
        onSubmit={form.handleSubmit((values) => {
          // Check for file objects stored in form state under 'images'
          const files: File[] | undefined = (form.getValues() as any).images;

          if (files && Array.isArray(files) && files.length > 0) {
            const fd = new FormData();
            fd.append('productId', values.productId);
            fd.append('color', values.color);
            files.forEach((file) => fd.append('images', file));
            // call parent onSubmit with FormData
            (onSubmit as any)(fd as unknown as ProductImageType);
            return;
          }

          // No files - fallback to sending imageUrls array (existing URLs)
          onSubmit(values);
        })}
      >
        <h2 className="font-semibold text-gray-800 text-xl mb-4">
          Product Image Form
        </h2>
        <FormImageUploader control={form.control} name={"imageUrls"} />

        <Button className="w-full mt-4" type="submit" disabled={isPending}>
          {isPending && <Loader2 className="animate-spin" size="sm" />}
          {isPending ? "Adding Category" : "Add Category"}
        </Button>
      </FormProvider>
    </main>
  );
};

export default ProductVariantImage;
