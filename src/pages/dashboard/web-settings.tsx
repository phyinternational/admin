import FormInput from "@/components/form/FormInput";
import FormProvider from "@/components/form/FormProvider";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGetConstants,
  useUpdateConstants,
} from "@/lib/react-query/auth-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  purchaseThreshold: z.string().refine((val) => !Number.isNaN(Number(val)), {
    message: "Invalid number",
  }),
  shippingCharges: z.string().refine((val) => !Number.isNaN(Number(val)), {
    message: "Invalid number",
  }),
});

const WebSettingsForm = () => {
  const { data, isLoading } = useGetConstants();
  const { mutate, isPending } = useUpdateConstants();

  const form = useForm({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (values: any) => {
    mutate({
      constants: [
        {
          name: "purchase-threshold",
          value: values["purchaseThreshold"],
        },
        {
          name: "shipping-charges",
          value: values["shippingCharges"],
        },
      ],
    });
  };

  useEffect(() => {
    if (!data) return;
    const constants = data?.data.data.constants;

    const codCharges =
      constants.find((c: { name: string }) => c.name === "purchase-threshold")
        ?.value ?? 0;
    const shippingCharges =
      constants.find((c: { name: string }) => c.name === "shipping-charges")
        ?.value ?? 0;
    if (data) {
      form.reset({
        purchaseThreshold: String(codCharges ?? "0"),
        shippingCharges: String(shippingCharges ?? "0"),
      });
    }
  }, [data, form]);

  if (isLoading) return <Skeleton className="w-72 h-72" />;

  console.log(data);

  return (
    <main className="max-w-lg bg-white p-4 rounded-md  ">
      <FormProvider
        className="space-y-4"
        methods={form}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <h2 className="font-semibold text-gray-800 text-xl mb-4">
          Web Settings
        </h2>

        <FormInput
          control={form.control}
          name="purchaseThreshold"
          description="Maximum purchase amount (threshold) allowed for the site or for applying special rules."
          placeholder="Enter maximum purchase amount"
          label="Threshold (maximum purchase amount)"
        />
        <FormInput
          control={form.control}
          name="shippingCharges"
          description=" Enter the shipping charges for the products."
          placeholder="Enter Shipping Charges"
          label="Shipping Charges"
        />

        <Button
          type="submit"
          className="w-full"
          disabled={form.formState.isSubmitting}
        >
          {isPending ? <Loader2 className="w-6 h-6" /> : "Save"}
        </Button>
      </FormProvider>
    </main>
  );
};

export default WebSettingsForm;
