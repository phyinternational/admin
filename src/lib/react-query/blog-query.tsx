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
export const useDeleteBlog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: blogAPI.deleteBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      toast.success("Successfully Deleted!");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data.error.message ?? "Error deleting blog"
      );
    },
  });
};

export const useToggleBlogStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: blogAPI.toggleBlogStatus,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      toast.success(data.data.message || "Status updated!");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data.error.message ?? "Error updating status"
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
