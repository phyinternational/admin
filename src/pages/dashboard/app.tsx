import LowStockAlert from "@/components/products/low-stock-alert";
import { useAnalytics } from "@/lib/react-query/analytics-query";
import { useGetLowStockProducts } from "@/lib/react-query/product-query";
import { useState, useMemo } from "react";
import { DateRangePicker } from "@/components/dashboard/DateRangeFilter";
import SummaryCards from "@/components/dashboard/SummaryCards";
import OrderStatusChart from "@/components/dashboard/OrderStatusChart";
import TopProductsTable from "@/components/dashboard/TopProductsTable";
import SalesTrendChart from "@/components/dashboard/SalesTrendChart";
import RevenueByCategoryChart from "@/components/dashboard/RevenueByCategoryChart";
import RevenueByPaymentMethod from "@/components/dashboard/RevenueByPaymentMethod";
import { subDays, format } from "date-fns";
import { Loader2 } from "lucide-react";

const DashboardHome = () => {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

  const { data: analytics, isLoading: isLoadingAnalytics } = useAnalytics(
    format(dateRange.from, "yyyy-MM-dd"),
    format(dateRange.to, "yyyy-MM-dd")
  );

  const { data: lowStockData, isLoading: isLoadingLowStock } = useGetLowStockProducts(5);
  
  const lowStockItems = useMemo(() => {
    return lowStockData?.data?.data?.products || [];
  }, [lowStockData]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Dashboard Overview
          </h2>
          <p className="text-sm text-gray-500 mt-1">Monitor your store's performance and analytics</p>
        </div>
        <DateRangePicker onRangeChange={setDateRange} />
      </div>

      {isLoadingAnalytics ? (
        <div className="flex h-[400px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : analytics ? (
        <>
          {/* Low Stock Alert Section */}
          {!isLoadingLowStock && lowStockItems.length > 0 && (
            <LowStockAlert items={lowStockItems} threshold={5} />
          )}

          <SummaryCards
            financials={analytics.financials}
            orders={analytics.orders}
            customers={analytics.customers}
          />

          <SalesTrendChart data={analytics.salesTrend} />

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <OrderStatusChart data={analytics.orders.statusBreakdown} />
            <RevenueByPaymentMethod data={analytics.financials.revenueByPaymentMethod} />
            <TopProductsTable products={analytics.topProducts} />
          </div>

          <RevenueByCategoryChart data={analytics.financials.revenueByCategory} />
        </>
      ) : (
        <div className="text-center py-10">Failed to load analytics data</div>
      )}
    </div>
  );
};

export default DashboardHome;
