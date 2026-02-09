import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { PaymentMethodRevenue } from "@/types/analytics";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface Props {
  data: PaymentMethodRevenue[];
}

const COLORS = {
  'COD': '#f59e0b',
  'ONLINE': '#3b82f6',
  'UPI': '#10b981',
  'CARD': '#8b5cf6',
  'WALLET': '#ec4899',
};

export default function RevenueByPaymentMethod({ data }: Props) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Revenue by Payment Method</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">No payment data available</div>
        </CardContent>
      </Card>
    );
  }

  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue by Payment Method</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              dataKey="revenue"
              nameKey="paymentMethod"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label={({ paymentMethod, revenue }) =>
                `${paymentMethod}: ${((revenue / totalRevenue) * 100).toFixed(1)}%`
              }
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[entry.paymentMethod as keyof typeof COLORS] || '#6b7280'}
                />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => formatCurrency(value)} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
        <div className="mt-4 space-y-2">
          {data.map((item) => (
            <div key={item.paymentMethod} className="flex justify-between text-sm">
              <span className="font-medium">{item.paymentMethod}</span>
              <span className="text-muted-foreground">
                {formatCurrency(item.revenue)} ({item.orders} orders)
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
