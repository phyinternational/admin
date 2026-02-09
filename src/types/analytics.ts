export interface PaymentMethodRevenue {
  paymentMethod: string;
  revenue: number;
  orders: number;
}

export interface CategoryRevenue {
  categoryName: string;
  revenue: number;
  orders: number;
}

export interface FinancialMetrics {
  grossRevenue: number;
  returnedRevenue: number;
  netRevenue: number;
  aov: number;
  revenueGrowth: number;
  previousPeriodRevenue: number;
  revenueByPaymentMethod: PaymentMethodRevenue[];
  revenueByCategory: CategoryRevenue[];
}

export interface StatusBreakdown {
  status: string;
  count: number;
}

export interface OrderMetrics {
  total: number;
  active: number;
  completed: number;
  cancelled: number;
  returned: number;
  orderGrowth: number;
  previousPeriodOrders: number;
  statusBreakdown: StatusBreakdown[];
}

export interface CustomerMetrics {
  payingCustomers: number;
  totalUsers: number;
}

export interface TopProduct {
  _id: string;
  name: string;
  sku: string;
  quantitySold: number;
  revenue: number;
}

export interface SalesTrend {
  date: string;
  revenue: number;
  orders: number;
}

export interface AnalyticsData {
  financials: FinancialMetrics;
  orders: OrderMetrics;
  customers: CustomerMetrics;
  topProducts: TopProduct[];
  salesTrend: SalesTrend[];
}
