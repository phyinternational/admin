import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

type Props = {
  title: string;
  Icon: LucideIcon;
  value: string;
  description?: string;
  trend?: string;
  trendUp?: boolean;
};

const DashboardCard = ({ title, value, Icon, description, trend, trendUp }: Props) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
        {trend && (
          <div className={`flex items-center text-xs mt-1 ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
            {trendUp ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
            <span>{trend} vs previous period</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardCard;
