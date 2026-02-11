import FormInput from "@/components/form/FormInput";
import FormProvider from "@/components/form/FormProvider";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGetConstants,
  useUpdateConstants,
} from "@/lib/react-query/auth-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Settings2 } from "lucide-react";
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent whitespace-nowrap">
            Web Settings
          </h2>
          <p className="text-sm text-gray-500 mt-1">Configure global store constants and shipping thresholds</p>
        </div>
      </div>
      <main className="max-w-lg bg-white p-6 rounded-lg border shadow-sm">
        <FormProvider
          className="space-y-4"
          methods={form}
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="flex items-center gap-2 mb-4">
            <Settings2 className="text-gray-400" size={20} />
            <h3 className="font-semibold text-gray-800 text-lg">
              General Configuration
            </h3>
          </div>

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
  </div>
  );
};

export default WebSettingsForm;
