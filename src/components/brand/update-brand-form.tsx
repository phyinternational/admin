import { useGetBrand, useUpdateBrand } from "@/lib/react-query/brand-query"; // Import the appropriate hooks for updating brands
import { useParams } from "react-router";
import LoadingScreen from "../common/loading-screen";
import BrandForm from "./brand-form"; // Import the BrandForm component
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

const UpdateBrandForm = () => {
  const { id } = useParams();
  const { data: brandData, isLoading } = useGetBrand(id ?? "");
  const { mutate, isPending } = useUpdateBrand(); // Use the hook for updating brands
  const navigate = useNavigate();

  const onSubmit = (data: any) => {
    mutate({ ...data, _id: id }, {
      onSuccess: () => {
        setTimeout(() => navigate('/dashboard/brands/list'), 700);
      }
    });
  };

  const defaultValues: any = useMemo(() => {
    if (!brandData) return null;

    const brand = brandData.data.data.brand;
    return {
      brand_name: brand.brand_name,
    };
  }, [brandData]);

  if (isLoading && !defaultValues) return <LoadingScreen />;

  if (!defaultValues) return null;
  return (
    <section className="flex flex-col space-y-4">
      <header className="border-b mb-10 pb-4">
        <h1 className="text-2xl font-bold">Update Brand</h1>
        <p className="text-sm text-gray-500">
          Update an existing brand in your store.
        </p>
      </header>
      <BrandForm
        isPending={isPending}
        defaultValues={defaultValues}
        onSubmit={onSubmit}
      />
    </section>
  );
};

export default UpdateBrandForm;
