import { z } from "zod";
import FormProvider from "../form/FormProvider";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "../form/FormInput";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";

const brandSchema = z.object({
  brand_name: z.string(),
});

export type BrandType = z.infer<typeof brandSchema>;

type Props = {
  onSubmit: (data: BrandType) => void;
  defaultValues?: BrandType;
  isPending: boolean;
};

const BrandForm = ({ onSubmit, defaultValues, isPending }: Props) => {
  const form = useForm<BrandType>({
    resolver: zodResolver(brandSchema),
    defaultValues: defaultValues,
  });

  return (
    <main className="max-w-lg bg-white p-4 rounded-md mt-20">
      <FormProvider
        className="space-y-4"
        methods={form}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <h2 className="font-semibold text-gray-800 text-xl mb-4">Brand Form</h2>

        <FormInput
          control={form.control}
          name="brand_name"
          placeholder="Enter Brand Name"
          label="Brand Name"
        />

        <Button className="w-full mt-4" type="submit" disabled={isPending}>
          {isPending && <Loader2 className="animate-spin" size="sm" />}
          {isPending ? "Submitting..." : "Submit"}
        </Button>
      </FormProvider>
    </main>
  );
};

export default BrandForm;
