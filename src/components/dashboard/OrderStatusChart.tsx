import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBreakdown } from "@/types/analytics";
import { PieChart as PieChartIcon } from "lucide-react";

interface OrderStatusChartProps {
  data: StatusBreakdown[];
}

// Status-specific colors for meaningful visual mapping
const STATUS_COLORS: Record<string, string> = {
  PLACED: "#FBBF24",           // yellow
  SHIPPED: "#F97316",          // orange
  DELIVERED: "#10B981",        // green
  CANCELLED: "#EF4444",        // red
  CANCELLED_BY_USER: "#EF4444",
  CANCELLED_BY_ADMIN: "#DC2626",
  RETURN_REQUESTED: "#3B82F6", // blue
  RETURN_APPROVED: "#6366F1",  // indigo
  RETURN_REJECTED: "#F43F5E",  // rose
  RETURNED: "#8B5CF6",         // violet
  REPLACEMENT_REQUESTED: "#A855F7", // purple
  REPLACEMENT_APPROVED: "#0D9488",  // teal
  REPLACEMENT_REJECTED: "#E11D48",
  REPLACEMENT_IN_PROGRESS: "#D946EF", // fuchsia
};

const STATUS_LABELS: Record<string, string> = {
  PLACED: "Placed",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
  CANCELLED_BY_USER: "Cancelled (User)",
  CANCELLED_BY_ADMIN: "Cancelled (Admin)",
  RETURN_REQUESTED: "Return Requested",
  RETURN_APPROVED: "Return Approved",
  RETURN_REJECTED: "Return Rejected",
  RETURNED: "Returned",
  REPLACEMENT_REQUESTED: "Replacement Requested",
  REPLACEMENT_APPROVED: "Replacement Approved",
  REPLACEMENT_REJECTED: "Replacement Rejected",
  REPLACEMENT_IN_PROGRESS: "Replacement In Progress",
};

export default function OrderStatusChart({ data }: OrderStatusChartProps) {
  const chartData = data
    .filter((d) => d.count > 0)
    .map((d) => ({
      ...d,
      label: STATUS_LABELS[d.status] || d.status.replace(/_/g, " "),
    }))
    .sort((a, b) => b.count - a.count);

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Item Status Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          {chartData.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <PieChartIcon className="h-10 w-10 mb-3 opacity-30" />
              <p className="text-sm font-medium">No order data</p>
              <p className="text-xs">No items found for the selected period</p>
            </div>
          ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="45%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={3}
                dataKey="count"
                nameKey="label"
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={STATUS_COLORS[entry.status] || "#94A3B8"}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number, name: string) => [value, name]}
                contentStyle={{ fontSize: "13px", borderRadius: "8px" }}
              />
              <Legend
                verticalAlign="bottom"
                iconSize={10}
                wrapperStyle={{ fontSize: "11px", lineHeight: "18px" }}
              />
            </PieChart>
          </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
