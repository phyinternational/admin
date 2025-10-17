import { z } from "zod";
import FormProvider from "../form/FormProvider";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "../form/FormInput";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import FormGroupSelect from "../form/form-select";
import RHFDateInput from "../form/form-date-picker";
import { useEffect } from "react";

const CouponSchema = z.object({
  couponCode: z.string().min(1, "Coupon code is required"),
  couponAmount: z
    .string()
    .min(1, "Coupon amount is required")
    .refine((val) => !isNaN(Number(val)), {
      message: "Coupon amount must be a number",
    }),
  couponQuantity: z
    .string()
    .min(1, "Coupon quantity is required")
    .refine((val) => !isNaN(Number(val)), {
      message: "Coupon quantity must be a number",
    }),
  couponType: z.enum(["INR", "PERCENTAGE"], {
    description: "Coupon type must be either INR or PERCENTAGE",
  }),
  minCartAmount: z
    .string()
    .min(1, "Minimum cart amount is required")
    .refine((val) => !isNaN(Number(val)), {
      message: "Minimum cart amount must be a number",
    }),
  expiryDate: z.date(),
});

export type CouponType = z.infer<typeof CouponSchema>;

type Props = {
  onSubmit: (data: any) => void;
  defaultValues?: CouponType;
  isPending: boolean;
};

const CouponForm = ({ onSubmit, defaultValues, isPending }: Props) => {
  const form = useForm<CouponType>({
    resolver: zodResolver(CouponSchema),
    defaultValues: defaultValues,
  });
  const { couponCode } = form.watch();
  useEffect(() => {
    if (couponCode) {
      form.setValue("couponCode", couponCode.toUpperCase().replace(/ /g, ""));
    }
  }, [couponCode, form]);
  return (
    <main className="max-w-lg bg-white p-4 rounded-md mt-20">
      <FormProvider
        className="space-y-4"
        methods={form}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <h2 className="font-semibold text-gray-800 text-xl mb-4">
          Coupon Form
        </h2>

        <FormInput
          label="Coupon Code"
          name="couponCode"
          control={form.control}
          placeholder="Enter Coupon Code"
          required
        />

        <FormInput
          label="Coupon Amount"
          name="couponAmount"
          control={form.control}
          description="Enter the coupon amount in INR or Percentage. For example, 100 or 10.5"
          type="number"
          placeholder="Enter Coupon Amount"
          required
        />

        <FormGroupSelect
          control={form.control}
          label="Coupon Type"
          name="couponType"
          options={[
            { label: "INR", value: "INR" },
            { label: "Percentage", value: "PERCENTAGE" },
          ]}
        />
        <FormInput
          label="Coupon Quantity"
          name="couponQuantity"
          control={form.control}
          type="number"
          placeholder="Enter Coupon Quantity"
          required
        />
        <FormInput
          label="Minimum Cart Amount"
          name="minCartAmount"
          control={form.control}
          type="number"
          placeholder="Enter Minimum Cart Amount"
          required
        />

        <RHFDateInput
          control={form.control}
          label="Expiry Date"
          name="expiryDate"
        />

        <Button className="w-full mt-4" type="submit" disabled={isPending}>
          {isPending && <Loader2 className="animate-spin" size="sm" />}
          {isPending ? "Submit... " : "Submit"}
        </Button>
      </FormProvider>
    </main>
  );
};

export default CouponForm;
