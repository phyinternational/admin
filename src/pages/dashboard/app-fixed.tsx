import DashboardCard from "@/components/dashboard/card";
import LowStockAlert from "@/components/products/low-stock-alert";
import { useDashboardData } from "@/lib/react-query/auth-query";
import { useGetLowStockProducts, useBulkUpdatePricing } from "@/lib/react-query/product-query";
import {
  Box,
  Package,
  User,
  ShoppingCart,
  TimerIcon,
  Check,
  X,
  LucideIcon,
  RefreshCcw,
} from "lucide-react"; // Import icons
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const DashboardHome = () => {
  // Define default metrics with useMemo to avoid recreation on each render
  const defaultOrderMetrics = useMemo(() => [
    { title: "Total Orders", value: "0", icon: Box },
    { title: "Complete Orders", value: "0", icon: Check },
    { title: "Pending Orders", value: "0", icon: TimerIcon },
    { title: "Canceled Orders", value: "0", icon: X },
  ], []);

  const defaultOtherMetrics = useMemo(() => [
    { title: "Total Products", value: "0", icon: ShoppingCart },
    { title: "Total Users", value: "0", icon: User },
    { title: "Total Categories", value: "0", icon: Package },
  ], []);

  const { data } = useDashboardData();
  const { data: lowStockData, isLoading: isLoadingLowStock } = useGetLowStockProducts(5);
  const { mutate: updateAllPricing, isPending: isUpdatingPrices } = useBulkUpdatePricing();
  
  const lowStockItems = useMemo(() => {
    return lowStockData?.data?.data?.products || [];
  }, [lowStockData]);

  // Extract metrics from API response
  const { orderMetrics, otherMetrics } = useMemo(() => {
    if (data?.data?.data) {
      return {
        orderMetrics: data.data.data.orderMetrics ?? [],
        otherMetrics: data.data.data.otherMetrics ?? [],
      };
    }
    return {
      orderMetrics: [],
      otherMetrics: [],
    };
  }, [data]);
  
  // Combine default metrics with API data
  const displayOrderMetrics = useMemo(() => {
    return defaultOrderMetrics.map((defaultMetric, index) => {
      const apiMetric = orderMetrics[index];
      return {
        ...defaultMetric,
        value: apiMetric?.value || defaultMetric.value
      };
    });
  }, [defaultOrderMetrics, orderMetrics]);

  const displayOtherMetrics = useMemo(() => {
    return defaultOtherMetrics.map((defaultMetric, index) => {
      const apiMetric = otherMetrics[index];
      return {
        ...defaultMetric,
        value: apiMetric?.value || defaultMetric.value
      };
    });
  }, [defaultOtherMetrics, otherMetrics]);

  const handleUpdateAllPricing = () => {
    updateAllPricing();
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4 text-secondary">
        Dashboard Home
      </h1>
      
      {/* Low Stock Alert Section */}
      {!isLoadingLowStock && lowStockItems.length > 0 && (
        <LowStockAlert items={lowStockItems} threshold={5} />
      )}
      
      {/* Dynamic Pricing Section */}
      {/* <Card className="mb-8">
        <CardHeader className="bg-blue-50">
          <CardTitle className="flex items-center text-blue-700">
            <RefreshCcw className="mr-2 h-5 w-5" />
            Dynamic Pricing Update
          </CardTitle>
          <CardDescription className="text-blue-600">
            Update all product prices based on current silver rates
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <p className="mb-4">
            Silver jewelry prices are calculated based on the current silver rate, labor percentage, and GST.
            Click the button below to update all product prices.
          </p>
          <Button 
            onClick={handleUpdateAllPricing} 
            disabled={isUpdatingPrices}
          >
            {isUpdatingPrices ? "Updating..." : "Update All Prices"}
          </Button>
        </CardContent>
      </Card> */}
      
      <section className="mb-8 p-4 bg-gray-50 rounded-lg border">
        <h2 className="text-xl font-semibold mb-2">Orders</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Map over the orderMetrics array to render DashboardCard components */}
          {displayOrderMetrics.map(
            (
              metric: { icon: LucideIcon; title: string; value: string },
              index: number
            ) => (
              <DashboardCard
                key={index}
                Icon={metric.icon}
                title={metric.title}
                value={metric.value}
              />
            )
          )}
        </div>
      </section>
      <section className="mb-8 p-4 bg-gray-50 rounded-lg border">
        <h2 className="text-xl font-semibold mb-2">Other Metrics</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Map over the otherMetrics array to render DashboardCard components */}
          {displayOtherMetrics.map(
            (
              metric: { icon: LucideIcon; title: string; value: string },
              index: number
            ) => (
              <DashboardCard
                key={index}
                Icon={metric.icon}
                title={metric.title}
                value={metric.value}
              />
            )
          )}
        </div>
      </section>
    </div>
  );
};

export default DashboardHome;
