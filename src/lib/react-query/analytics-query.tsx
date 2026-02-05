import { useQuery } from "@tanstack/react-query";
import { analyticsAPI } from "../axios/analytics-API";
import { AnalyticsData } from "../../types/analytics";

export const useAnalytics = (startDate?: string, endDate?: string) => {
  return useQuery({
    queryKey: ["analytics", startDate, endDate],
    queryFn: async () => {
      const response = await analyticsAPI.getAnalytics(startDate, endDate);
      // Backend returns { status: "success", data: { ... } }
      return response.data.data as AnalyticsData;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });
};
