import {
  useProductRating,
  useUpdateRating,
} from "@/lib/react-query/product-rating-query"; // Import the appropriate hooks for updating reviews
import { useParams } from "react-router";
import LoadingScreen from "../common/loading-screen";
import ReviewForm from "./review-form"; // Import the ReviewForm component
import { useMemo } from "react";

const UpdateRatingForm = () => {
  const { id } = useParams();
  const { data: reviewData, isLoading } = useProductRating(id ?? "");
  const { mutate, isPending } = useUpdateRating();

  const onSubmit = (data: any) => {
    mutate({ ...data, _id: id });
  };

  const defaultValues = useMemo(() => {
    if (!reviewData) return null;

    const review = reviewData.data;
    return {
      rating: review.rating,
      name: review.name,
      reviewText: review.reviewText,
    };
  }, [reviewData]);

  if (isLoading && !defaultValues) return <LoadingScreen />;

  if (!defaultValues) return null;

  return (
    <section className="flex flex-col space-y-4">
      <header className="border-b mb-10 pb-4">
        <h1 className="text-2xl font-bold">Update Rating</h1>
        <p className="text-sm text-gray-500">
          Update an existing rating for a product.
        </p>
      </header>
      <ReviewForm
        isPending={isPending}
        defaultValues={defaultValues}
        onSubmit={onSubmit}
      />
    </section>
  );
};

export default UpdateRatingForm;
