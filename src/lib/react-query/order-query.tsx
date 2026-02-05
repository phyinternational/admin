import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { orderAPI } from "../axios/order-API";

export const useGetOrders = (filter: unknown) => {
  return useQuery({
    queryKey: ["orders",filter],
    queryFn: () => orderAPI.getOrders(filter),
    staleTime: 15 * 60 * 1000,
  });
};

export const useGetOrderById = (id: string) => {
  return useQuery({
    queryKey: ["order", id],
    queryFn: async () => {
      const res = await orderAPI.getOrderId(id);
      // Unwrap nested successRes shapes from backend
      const d = res?.data;
      if (!d) return null;
      // backend: successRes(res, { data: order }) -> res.data = { status, data: { data: order } }
      if (d.data?.data) return d.data.data;
      if (d.data) return d.data;
      return d;
    },
    staleTime: 15 * 60 * 1000,
  });
};

export const useUpdateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["order", "update"],
    mutationFn: (data: any) => orderAPI.updateOrder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });
    },
  });
};

export const useApproveOrderRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["order", "approve-request"],
    mutationFn: ({ id, data }: { id: string, data: any }) => orderAPI.approveRequest(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["order", id] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};

export const useRejectOrderRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["order", "reject-request"],
    mutationFn: ({ id, data }: { id: string, data: any }) => orderAPI.rejectRequest(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["order", id] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};
