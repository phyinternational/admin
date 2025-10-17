import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { productRatingAPI } from "../axios/product-rating-API";
import { toast } from "sonner";

export const useGetProductRatings = (productId: string) => {
  return useQuery({
    queryKey: ["products", "ratings", productId],
    queryFn: () => productRatingAPI.getRatingsByProduct(productId),
    staleTime: 15 * 60 * 1000,
  });
};

export const useAddRating = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: productRatingAPI.addRating,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products", "ratings"] });
      toast.success("Successfully Added!");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data.error.message ?? "Error adding category"
      );
    },
  });
};

export const useUpdateRating = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: productRatingAPI.updateRating,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products", "ratings"] });
      toast.success("Successfully Updated!");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data.error.message ?? "Error updating category"
      );
    },
  });
};

export const useProductRating = (id: string) => {
  return useQuery({
    queryKey: ["products", "ratings", id],
    queryFn: () => productRatingAPI.getRating(id),
    staleTime: 15 * 60 * 1000,
  });
};

export const useAddAdminRating = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: productRatingAPI.addAdminRating,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products", "ratings"] });
      toast.success("Successfully Added!");
    },
    onError: (error: any) => {
      console.log(error.response);
      toast.error(error.response?.data.error.message ?? "Error adding Rating");
    },
  });
};
