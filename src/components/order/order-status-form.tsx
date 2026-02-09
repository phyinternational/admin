import FormProvider from "../form/FormProvider";

import { useForm } from "react-hook-form";
import FormGroupSelect from "../form/form-select";
import FormInput from "../form/FormInput";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { useUpdateOrder } from "@/lib/react-query/order-query";
import { toast } from "sonner";
import { useParams } from "react-router";

const OrderStatusEnum = z.enum([
  "PLACED",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED_BY_ADMIN",
  "CANCELLED_BY_USER",
  "RETURN_REQUESTED",
  "RETURN_APPROVED",
  "RETURN_REJECTED",
  "RETURNED",
  "REPLACEMENT_REQUESTED",
  "REPLACEMENT_APPROVED",
  "REPLACEMENT_REJECTED",
  "REPLACEMENT_IN_PROGRESS",
]);

const orderSchema = z.object({
  order_status: OrderStatusEnum,
  reason: z.string().optional(),
});

export type OrderFormType = z.infer<typeof orderSchema>;

type Props = {
  defaultValues: { order_status: any };
  disabled?: boolean;
};

const statusOptions = [
  { label: "Placed", value: "PLACED" },
  { label: "Shipped", value: "SHIPPED" },
  { label: "Delivered", value: "DELIVERED" },
  { label: "Cancelled by Admin", value: "CANCELLED_BY_ADMIN" },
  { label: "Cancelled by User", value: "CANCELLED_BY_USER" },
  { label: "Return Requested", value: "RETURN_REQUESTED" },
  { label: "Return Approved", value: "RETURN_APPROVED" },
  { label: "Return Rejected", value: "RETURN_REJECTED" },
  { label: "Returned", value: "RETURNED" },
  { label: "Replacement Requested", value: "REPLACEMENT_REQUESTED" },
  { label: "Replacement Approved", value: "REPLACEMENT_APPROVED" },
  { label: "Replacement Rejected", value: "REPLACEMENT_REJECTED" },
  { label: "Replacement in Progress", value: "REPLACEMENT_IN_PROGRESS" },
];
const OrderStatusForm = ({ defaultValues, disabled }: Props) => {
  const { id } = useParams();
  const { mutate, isPending } = useUpdateOrder();
  const form = useForm<OrderFormType>({
    resolver: zodResolver(orderSchema),
    defaultValues: defaultValues,
  });

  const onSubmit = (data: OrderFormType) => {
    mutate({...data,_id:id}, {
      onSuccess: () => {
        toast.success("Order Status Updated");
      },
      onError: (error: any) => {
        const msg = error?.response?.data?.error?.message || error.message || "Failed to update order status";
        toast.error(msg);
      },
    });
  };

  return (
    <FormProvider
      className="space-y-4"
      methods={form}
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <div className="flex flex-col gap-4">
        <FormGroupSelect
          options={statusOptions}
          control={form.control}
          name="order_status"
          label="Status"
          disabled={disabled}
        />
        <FormInput
          control={form.control}
          name="reason"
          placeholder="Reason for change (optional)"
          label="Reason"
          disabled={disabled}
        />
        <Button
          type="submit"
          size={"sm"}
          className="w-full flex justify-center"
          disabled={isPending || disabled}
        >
          {isPending && <Loader2 className="animate-spin mr-2" size={18} />}
          {isPending ? "Updating..." : "Update"}
        </Button>
      </div>
    </FormProvider>
  );
};

export default OrderStatusForm;
