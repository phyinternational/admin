import { useAddAdminRating } from "@/lib/react-query/product-rating-query"; // Import the appropriate hook for adding reviews
import ReviewForm from "./review-form"; // Import the ReviewForm component
import { useParams } from "react-router";

const AddReviewForm = () => {
  const { id } = useParams();
  const { mutate, isPending } = useAddAdminRating(); // Use the hook for adding reviews
  const onSubmit = (data: any) => {
    mutate({ ...data, product: id, rating: Number(data.rating) });
  };

  return (
    <section className="flex flex-col space-y-4">
      <header className="border-b mb-10 pb-4">
        <h1 className="text-2xl font-bold">Add Review</h1>
        <p className="text-sm text-gray-500">Add a new review for a product.</p>
      </header>
      <ReviewForm isPending={isPending} onSubmit={onSubmit} />{" "}
    </section>
  );
};

export default AddReviewForm;
