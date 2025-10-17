import { useGetOrderById } from "@/lib/react-query/order-query";
import { useParams } from "react-router";
import LoadingScreen from "../common/loading-screen";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Order } from "./orders";
import dayjs from "dayjs";
import { Badge } from "../ui/badge";
import OrderStatusForm from "./order-status-form";

const OrderView = () => {
  const { id } = useParams();
  const { isLoading, data } = useGetOrderById(String(id));

  if (isLoading) return <LoadingScreen />;

  // `useGetOrderById` now returns the order object directly (or null)
  const order: Order = data ?? {};
  const day = order?.createdAt ? dayjs(order.createdAt).format("DD/MM/YYYY") : "N/A";
  const products = Array.isArray(order?.products) ? order.products : [];
  const total = products.reduce((acc, product) => {
    return acc + (product.price || 0) * (product.quantity || 1);
  }, 0);


  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Order</h1>
      <section className="p-4 bg-white flex  gap-8 rounded-md">
        <Card>
          <CardHeader>
            <CardTitle>Shipping Details</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="space-y-2">
              <div className="">
                <div className="text-sm font-semibold">Order ID:</div>
                <div className="text-sm font-semibold w-36 truncate">
                  {id}
                </div>
              </div>
              <div className="">
                <div className="text-sm font-semibold">Order Date:</div>
                <div className="text-sm font-semibold">{day}</div>
              </div>
                            <div className="">
                <div className="text-sm font-semibold">Product Id:</div>
                <div className="text-sm font-semibold w-36 truncate">
                  {products[0]?.product?.productSlug || "N/A"}
                </div>
              </div>
            </CardDescription>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <span className="text-sm font-semibold">Payment Method:</span>
                <span className="text-sm font-semibold">
                  {order.payment_mode}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <span className="text-sm font-semibold">Order Status:</span>
                <span className="text-sm font-semibold">
                  {/* Map enum statuses to colors */}
                  {(() => {
                    const status = (order.order_status || "").toString();
                    // Map to badge variant names
                    const map: Record<string, string> = {
                      PLACED: "yellow",
                      SHIPPED: "orange",
                      DELIVERED: "green",
                      CANCELLED_BY_ADMIN: "red",
                      CANCELLED: "red",
                    };
                    const variant = (map[status] || "default") as any;
                    // Show friendly text by replacing underscores
                    const label = (status.replace(/_/g, " ") || "N/A");
                    return <Badge variant={variant}>{label}</Badge>;
                  })()}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <span className="text-sm font-semibold">Payment Status:</span>
                <span className="text-sm font-semibold">
                  {order.payment_status}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <span className="text-sm font-semibold">Delivery Address:</span>
                <span className="text-sm font-semibold">
                  {order?.shippingAddress?.firstName} {order?.shippingAddress?.lastName}<br/>
                  {order?.shippingAddress?.street}<br/>
                  {order?.shippingAddress?.city}, {order?.shippingAddress?.state} {order?.shippingAddress?.zip}<br/>
                  {order?.shippingAddress?.phoneNumber}
                  {order?.shippingAddress?.email && <><br/>{order?.shippingAddress?.email}</>}
                </span>
              </div>
            </CardDescription>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <CardHeader>
              <CardTitle className="text-left">Order Status Form</CardTitle>
            </CardHeader>
            <OrderStatusForm
              defaultValues={{ order_status: order.order_status }}
            />
          </CardContent>
        </Card>
      </section>
      <section className="p-4 mt-8 bg-white flex flex-col  rounded-md">
        <h1 className="text-lg font-semibold mb-4">Products</h1>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product Name</TableHead>
              <TableHead>Product Id</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product, i) => (
              <TableRow key={i}>
                <TableCell>{product?.product?.productTitle || "N/A"}</TableCell>
                <TableCell>{product?.product?.productSlug || "N/A"}</TableCell>
                <TableCell>{product?.quantity || 1}</TableCell>
                <TableCell>₹{((product?.price || 0) * (product?.quantity || 1)).toLocaleString('en-IN')}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3} className="text-right">Total</TableCell>
              <TableCell>
                <span className="text-sm font-semibold">₹{total.toLocaleString('en-IN')}</span>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </section>
    </div>
  );
};

export default OrderView;
