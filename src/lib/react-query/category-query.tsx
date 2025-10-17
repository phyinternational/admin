import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { productAPI } from "../axios/product-API";
import { toast } from "sonner";

export const useGetCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => productAPI.getCategories(),
    staleTime: 15 * 60 * 1000,
  });
};


export const useAddCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: productAPI.addCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Successfully Added!");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data.error.message ?? "Error adding category"
      );
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) => {
      console.log("useUpdateCategory mutationFn called with payload:", payload);
      // Handle both FormData and regular object payloads
      if (payload.formData) {
        console.log("Detected FormData payload, calling updateCategoryWithFormData");
        return productAPI.updateCategoryWithFormData(payload.formData, payload._id);
      }
      console.log("Regular payload, calling updateCategory");
      return productAPI.updateCategory(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
      toast.success("Successfully Updated!");
    },
    onError: (error: any) => {
      console.error("useUpdateCategory error:", error);
      toast.error(
        error.response?.data.error.message ?? "Error updating category"
      );
    },
  });
}