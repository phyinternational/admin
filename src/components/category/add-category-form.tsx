import { useAddCategory } from "@/lib/react-query/category-query";
import CategoryForm, { CategoryFormType } from "./category-form";
import { useSearchParams, useNavigate } from "react-router-dom";

const AddCategoryForm = () => {
  const [urlParams] = useSearchParams();
  const parentId = urlParams.get("parentId");
  const defaultValues: CategoryFormType = {
    name: "",
    imageUrl: "",
    slug: "",
    isActive: true,
    type: "main",
    parentId: parentId ?? "",
    images: [],
  };

  const { mutate, isPending } = useAddCategory();
  const navigate = useNavigate();

  const onSubmit = (data: any) => {
    // Use mutate callback to navigate after successful creation.
    mutate(data, {
      onSuccess: () => {
        // small delay so the success toast is visible before redirect
        setTimeout(() => navigate("/dashboard/categories/list"), 600);
      },
    });
  };

  return (
    <section className="flex flex-col space-y-4">
      <header className="border-b mb-6 pb-4">
        <h1 className="text-2xl font-bold">Add Category</h1>
        <p className="text-sm text-gray-500">
          Add a new product to your store.
        </p>
      </header>{" "}
      <CategoryForm
        defaultValues={defaultValues}
        isPending={isPending}
        onSubmit={onSubmit}
      />
    </section>
  );
};

export default AddCategoryForm;
