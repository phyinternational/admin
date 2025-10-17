import FormProvider from "../form/FormProvider";

import { useForm } from "react-hook-form";
import FormGroupSelect from "../form/form-select";

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
  "CANCELLED BY ADMIN",
]);

const orderSchema = z.object({
  order_status: OrderStatusEnum,
});

export type OrderFormType = z.infer<typeof orderSchema>;

type Props = {
  defaultValues: OrderFormType;
};

const statusOptions = [
  { label: "Placed", value: "PLACED" },
  { label: "Shipped", value: "SHIPPED" },
  { label: "Delivered", value: "DELIVERED" },
  { label: "Cancelled by Admin", value: "CANCELLED BY ADMIN" },
];
const OrderStatusForm = ({ defaultValues }: Props) => {
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
      onError: (error) => {
        toast.error(error.message ?? "Failed to update order status");
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
        />
        <Button
          type="submit"
          size={"sm"}
          className="w-full flex justify-center"
          disabled={isPending}
        >
          {isPending && <Loader2 className="animate-spin mr-2" size={18} />}
          {isPending ? "Updating..." : "Update"}
        </Button>
      </div>
    </FormProvider>
  );
};

export default OrderStatusForm;
