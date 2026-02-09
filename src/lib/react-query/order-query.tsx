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
      // backend: successRes(res, { data: order, replacementOrder }) -> res.data = { status, data: { data: order, replacementOrder } }
      const inner = d.data || d;
      const order = inner.data || inner;
      // Attach replacementOrder if present (for orders with approved replacements)
      if (inner.replacementOrder) {
        order._replacementOrder = inner.replacementOrder;
      }
      return order;
    },
    staleTime: 15 * 60 * 1000,
    refetchInterval: 10000, // Auto-refresh every 10 seconds
    refetchIntervalInBackground: false, // Don't refetch when tab is not active
  });
};

export const useUpdateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["order", "update"],
    mutationFn: (data: any) => orderAPI.updateOrder(data),
    onSuccess: (_, variables) => {
      // Invalidate both the specific order and the orders list
      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });
      if (variables._id) {
        queryClient.invalidateQueries({
          queryKey: ["order", variables._id],
        });
      }
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
