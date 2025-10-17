import { z } from "zod";
import FormProvider from "../form/FormProvider";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "../form/FormInput";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";

const reviewSchema = z.object({
  name: z.string().min(1, "Name is required"),
  rating: z.string().refine((val) => Number(val) >= 1 && Number(val) <= 5, {
    message: "Rating must be between 1 and 5",
  }),
  reviewText: z.string(),
});

export type ReviewType = z.infer<typeof reviewSchema>;

type Props = {
  onSubmit: (data: ReviewType) => void;
  defaultValues?: ReviewType;
  isPending: boolean;
};

const ReviewForm = ({ onSubmit, defaultValues, isPending }: Props) => {
  const form = useForm<ReviewType>({
    resolver: zodResolver(reviewSchema),
    defaultValues: defaultValues,
  });

  return (
    <main className="max-w-lg bg-white p-4 rounded-md mt-20">
      <FormProvider
        className="space-y-4"
        methods={form}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <h2 className="font-semibold text-gray-800 text-xl mb-4">
          Review Form
        </h2>

        <FormInput
          control={form.control}
          name="name"
          type="text"
          placeholder="Enter Name"
          label="Name"
        />

        <FormInput
          control={form.control}
          name="rating"
          type="number"
          placeholder="Enter Rating (1-5)"
          label="Rating"
        />

        <FormInput
          control={form.control}
          name="reviewText"
          type="text"
          placeholder="Enter Review Text"
          label="Review Text"
        />

        <Button className="w-full mt-4" type="submit" disabled={isPending}>
          {isPending && <Loader2 className="animate-spin" size="sm" />}
          {isPending ? "Submitting..." : "Submit"}
        </Button>
      </FormProvider>
    </main>
  );
};

export default ReviewForm;
