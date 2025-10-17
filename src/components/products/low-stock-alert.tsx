import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
// import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { AlertCircle } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";

interface LowStockItem {
  _id: string;
  productTitle: string;
  stock: number;
  productImageUrl: string;
  skuNo: string;
}

interface LowStockAlertProps {
  items: LowStockItem[];
  threshold?: number;
}

const LowStockAlert: React.FC<LowStockAlertProps> = ({ items, threshold = 5 }) => {
  const navigate = useNavigate();
  
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <Card className="mb-8">
      <CardHeader className="bg-amber-50">
        <CardTitle className="flex items-center text-amber-700">
          <AlertCircle className="mr-2 h-5 w-5" />
          Low Stock Alert
        </CardTitle>
        <CardDescription className="text-amber-600">
          The following products are running low on inventory (below {threshold} items)
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item._id} className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center">
                <img 
                  src={item.productImageUrl} 
                  alt={item.productTitle}
                  className="w-10 h-10 mr-3 object-cover"
                />
                <div>
                  <div className="font-medium">{item.productTitle}</div>
                  <div className="text-sm text-gray-500">SKU: #{item.skuNo}</div>
                  {/* Removed silver/dynamic pricing display - not applicable */}
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Badge variant="outline" className={`${item.stock === 0 ? 'bg-red-50 text-red-700 border-red-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                  Stock: {item.stock}
                </Badge>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => navigate(`/dashboard/products/${item._id}`)}
                >
                  Update Stock
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default LowStockAlert;
