import { IndianRupee, ShoppingBag, Users, CheckCircle, XCircle, RotateCcw } from "lucide-react";
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

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Financials */}
      <DashboardCard 
        title="Net Revenue" 
        value={formatCurrency(financials.netRevenue)} 
        Icon={IndianRupee} 
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
      />
      <DashboardCard 
        title="Delivered Orders" 
        value={orders.completed.toString()} 
        Icon={CheckCircle} 
      />
       <DashboardCard 
        title="Cancelled Orders" 
        value={orders.cancelled.toString()} 
        Icon={XCircle} 
      />
      <DashboardCard 
        title="Returned Orders" 
        value={orders.returned.toString()} 
        Icon={RotateCcw} 
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
