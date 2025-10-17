import { z } from "zod";
import FormProvider from "../form/FormProvider";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "../form/FormInput";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import FormGroupSelect from "../form/form-select";
import { useGetColor } from "@/lib/react-query/color-query";
import { sizeOptions } from "@/lib/utils";
import { useMemo } from "react";
import LoadingScreen from "../common/loading-screen";
import { ComboboxSelect } from "../ui/combobox";
import { FormLabel } from "../ui/form";
import FormSwitch from "../form/form-switch";

const ProductVariantSchema = z.object({
  productId: z.string().optional(),
  size: z.string().min(1, "Select a size"),
  price: z
    .string()
    .min(1, "Select a product")
    .refine((val) => !isNaN(Number(val)), {
      message: "Price must be a number",
    }),
  salePrice: z.string().refine((val) => !isNaN(Number(val)), {
    message: "Sale Price must be a number",
  }),
  isActive: z.boolean().optional(),
  stock: z.string().refine((val) => !isNaN(Number(val)), {
    message: "Stock must be a number",
  }),
  color: z.string().min(1, "Select a product"),
});

export type ProductVariantType = z.infer<typeof ProductVariantSchema>;

type Props = {
  onSubmit: (data: any) => void;
  defaultValues?: ProductVariantType;
  isPending: boolean;
};

const ProductVariantForm = ({ onSubmit, defaultValues, isPending }: Props) => {
  const form = useForm<ProductVariantType>({
    resolver: zodResolver(ProductVariantSchema),
    defaultValues: defaultValues,
  });

  const { data, isLoading } = useGetColor();
  const colorOptions: any[] = useMemo(() => {
    if (!data) return [];

    return data?.data.data.colors.map((color: any) => ({
      label: color.color_name,
      value: color._id,
    }));
  }, [data]);

  const { color } = form.watch();

  if (isLoading) return <LoadingScreen />;
  return (
    <main className="max-w-lg bg-white p-4 rounded-md  mt-20">
      <FormProvider
        className="space-y-4"
        methods={form}
        onSubmit={form.handleSubmit(onSubmit, (errors) => console.log(errors))}
      >
        <h2 className="font-semibold text-gray-800 text-xl mb-4">
          ProductVariant Form
        </h2>

        <FormGroupSelect
          control={form.control}
          label="Size"
          name="size"
          defaultValue={defaultValues?.size || ""}
          options={sizeOptions}
        />
        <FormSwitch
          control={form.control}
          name="isActive"
          label="Is Active"
          description="If Active it will shown to the user"
        />
        <FormInput
          label="Price"
          name="price"
          control={form.control}
          type="number"
          placeholder="Enter Price"
          required
        />

        <FormInput
          label="Sale Price"
          name="salePrice"
          control={form.control}
          type="number"
          placeholder="Enter Sale Price"
        />

        <FormInput
          label="Stock"
          name="stock"
          control={form.control}
          type="number"
          placeholder="Enter Stock"
          required
        />

        <div className="flex flex-col gap-1">
          <FormLabel> Color </FormLabel>
          <ComboboxSelect
            className="w-full"
            name="color"
            value={color}
            placeholder="Select Color"
            onValueChange={(e) => {
              form.setValue("color", e);
            }}
            options={colorOptions}
          />
        </div>

        <Button className="w-full mt-4" type="submit" disabled={isPending}>
          {isPending && <Loader2 className="animate-spin" size="sm" />}
          {isPending ? "Please wait..." : "Submit"}
        </Button>
      </FormProvider>
    </main>
  );
};

export default ProductVariantForm;
