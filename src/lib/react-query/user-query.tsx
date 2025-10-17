import { useQuery } from "@tanstack/react-query";
import { userAPI } from "../axios/user-API";

export const useGetAllUsers = (filter: unknown) => {
  return useQuery({
    queryKey: ["user", "all", filter],
    queryFn: () => userAPI.getAllUsers(filter),
    staleTime: 1000 * 60 * 60 * 24,
  });
};

export const useGetCart = (id?: string) => {
  return useQuery({
    queryKey: ["user", "cart"],
    queryFn: () => userAPI.getUserCart(id ?? ""),
    staleTime: 1000 * 60 * 60 * 24,
    enabled: Boolean(id),
  });
};
