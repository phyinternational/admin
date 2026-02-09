import { IndianRupee, ShoppingBag, Users, CheckCircle, XCircle, RotateCcw, TrendingUp, TrendingDown, Package } from "lucide-react";
import { useMemo } from "react";
import DashboardCard from "./card";
import { FinancialMetrics, OrderMetrics, CustomerMetrics } from "@/types/analytics";

interface SummaryCardsProps {
  financials: FinancialMetrics;
  orders: OrderMetrics;
  customers: CustomerMetrics;
}

export default function SummaryCards({ financials, orders, customers }: SummaryCardsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatGrowth = (value: number) => {
    const isPositive = value >= 0;
    const sign = isPositive ? '+' : '';
    return `${sign}${value.toFixed(1)}%`;
  };

  // Compute item-level metrics from status breakdown
  const itemMetrics = useMemo(() => {
    const breakdown = orders.statusBreakdown || [];
    const countStatuses = (statuses: string[]) =>
      breakdown
        .filter((s) => statuses.includes(s.status))
        .reduce((sum, s) => sum + s.count, 0);

    const total = breakdown.reduce((sum, s) => sum + s.count, 0);
    const delivered = countStatuses(["DELIVERED"]);
    const cancelled = countStatuses(["CANCELLED", "CANCELLED_BY_USER", "CANCELLED_BY_ADMIN"]);
    const returned = countStatuses(["RETURN_REQUESTED", "RETURN_APPROVED", "RETURN_REJECTED", "RETURNED"]);

    return { total, delivered, cancelled, returned };
  }, [orders.statusBreakdown]);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Financials */}
      <DashboardCard
        title="Net Revenue"
        value={formatCurrency(financials.netRevenue)}
        Icon={IndianRupee}
        trend={formatGrowth(financials.revenueGrowth)}
        trendUp={financials.revenueGrowth >= 0}
      />
      <DashboardCard
        title="Gross Revenue"
        value={formatCurrency(financials.grossRevenue)}
        Icon={IndianRupee}
      />
      <DashboardCard
        title="Average Order Value"
        value={formatCurrency(financials.aov)}
        Icon={IndianRupee}
      />
      <DashboardCard
        title="Returns Value"
        value={formatCurrency(financials.returnedRevenue)}
        Icon={RotateCcw}
      />

      {/* Orders */}
      <DashboardCard
        title="Total Orders"
        value={orders.total.toString()}
        Icon={ShoppingBag}
        description={`${itemMetrics.total} total items`}
        trend={formatGrowth(orders.orderGrowth)}
        trendUp={orders.orderGrowth >= 0}
      />
      <DashboardCard
        title="Delivered Orders"
        value={orders.completed.toString()}
        Icon={CheckCircle}
        description={`${itemMetrics.delivered} items delivered`}
      />
       <DashboardCard
        title="Cancelled Orders"
        value={orders.cancelled.toString()}
        Icon={XCircle}
        description={`${itemMetrics.cancelled} items cancelled`}
      />
      <DashboardCard
        title="Returned Orders"
        value={orders.returned.toString()}
        Icon={RotateCcw}
        description={`${itemMetrics.returned} items returned`}
      />

      {/* Customers */}
       <DashboardCard 
        title="Paying Customers" 
        value={customers.payingCustomers.toString()} 
        Icon={Users} 
      />
      <DashboardCard 
        title="Logged In Users" 
        value={customers.totalUsers.toString()} 
        Icon={Users} 
      />
    </div>
  );
}
