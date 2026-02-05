import { useAddCoupon } from "@/lib/react-query/coupon-query"; // Adjust the import path as needed
import CouponForm, { CouponType } from "./coupon-form"; // Adjust the import path to your CouponForm component
import { useNavigate } from "react-router-dom";

const defaultValues: CouponType = {
  couponCode: "",
  couponAmount: "0",
  couponQuantity: "0",
  couponType: "PERCENTAGE",
  minCartAmount: "0",
  expiryDate: new Date(),
};

const AddCouponForm = () => {
  const { mutate, isPending } = useAddCoupon();
  const navigate = useNavigate();

  const onSubmit = (data: any) => {
    mutate(
      {
        ...data,
        couponAmount: parseInt(data.couponAmount),
        minCartAmount: parseInt(data.minCartAmount),
        couponQuantity: parseInt(data.couponQuantity),
      },
      {
        onSuccess: () => {
          setTimeout(() => navigate("/dashboard/coupons/list"), 600);
        },
      }
    );
  };

  return (
    <div>
      <header className="border-b mb-6 pb-4">
        <h1 className="text-2xl font-bold">Add Coupon</h1>
        <p className="text-sm text-gray-500">Add a new coupon to your store.</p>
      </header>{" "}
      <CouponForm
        isPending={isPending}
        defaultValues={defaultValues}
        onSubmit={onSubmit}
      />
    </div>
  );
};

export default AddCouponForm;
