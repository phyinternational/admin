import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { blogAPI } from "../axios/blog-API";

export const useGetBlogs = () => {
  return useQuery({
    queryKey: ["blogs"],
    queryFn: () => blogAPI.getBlogs(),
    staleTime: 15 * 60 * 1000,
  });
};

export const useAddBlog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: blogAPI.addBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      toast.success("Successfully Added!");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data.error.message ?? "Error adding category"
      );
    },
  });
};

export const useGetBlog = (id: string) => {
  return useQuery({
    queryKey: ["blog", id],
    queryFn: () => blogAPI.getBlog(id),
    staleTime: 15 * 60 * 1000,
  });
};

export const useUpdateBlog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: blogAPI.updateBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      toast.success("Successfully Updated!");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data.error.message ?? "Error updating category"
      );
    },
  });
};
