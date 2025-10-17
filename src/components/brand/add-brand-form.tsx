import { useAddBrand } from "@/lib/react-query/brand-query"; // Import the appropriate hook for adding brands
import BrandForm from "./brand-form"; // Import the BrandForm component
import { useNavigate } from "react-router-dom";

const AddBrandForm = () => {
  const { mutate, isPending } = useAddBrand(); // Use the hook for adding brands
  const navigate = useNavigate();
  const onSubmit = (data: any) => {
    mutate(data, {
      onSuccess: () => {
        // delay navigation slightly so success toast is visible
        setTimeout(() => navigate("/dashboard/brands/list"), 700);
      },
    });
  };
  return (
    <section className="flex flex-col space-y-4">
      <header className="border-b mb-10 pb-4">
        <h1 className="text-2xl font-bold">Add Brand</h1>
        <p className="text-sm text-gray-500">
          Add a new brand to your store.
        </p>
      </header>
      <BrandForm isPending={isPending} onSubmit={onSubmit} /> {/* Render the BrandForm component */}
    </section>
  );
};

export default AddBrandForm;
