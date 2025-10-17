import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { silverRateAPI } from "../axios/silver-rate-API";
import { toast } from "sonner";

/**
 * Hook to fetch the current silver rate
 */
export const useGetCurrentSilverRate = () => {
  return useQuery({
    queryKey: ["silverRate", "current"],
    queryFn: silverRateAPI.getCurrentRate,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to update the silver rate
 */
export const useUpdateSilverRate = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: silverRateAPI.updateRate,
    onSuccess: () => {
      toast.success("Silver rate updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["silverRate"] });
      queryClient.invalidateQueries({ queryKey: ["products"] }); // Invalidate products as prices might change
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to update silver rate");
    },
  });
};

/**
 * Hook to fetch silver rate history
 */
export const useGetSilverRateHistory = (days: number = 30) => {
  return useQuery({
    queryKey: ["silverRate", "history", days],
    queryFn: () => silverRateAPI.getRateHistory(days),
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};

/**
 * Hook to fetch current market silver rate
 */
export const useGetMarketSilverRate = () => {
  return useQuery({
    queryKey: ["silverRate", "market"],
    queryFn: silverRateAPI.getMarketRate,
    staleTime: 10 * 60 * 1000, // 10 minutes - shorter time as market rates change frequently
  });
};

/**
 * Hook to get product price calculation details
 */
export const useGetProductPriceCalculation = (productId: string) => {
  return useQuery({
    queryKey: ["product", productId, "priceCalculation"],
    queryFn: () => silverRateAPI.getProductPriceCalculation(productId),
    enabled: Boolean(productId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
