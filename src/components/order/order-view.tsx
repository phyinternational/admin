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
import { useState } from "react";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { orderAPI } from "@/lib/axios/order-API";

const OrderView = () => {
  const { id } = useParams();
  const { isLoading, data, refetch } = useGetOrderById(String(id));
  const [showReturnApproval, setShowReturnApproval] = useState(false);
  const [showReplacementApproval, setShowReplacementApproval] = useState(false);
  const [adminComment, setAdminComment] = useState("");
  const [overrideWindow, setOverrideWindow] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isLoading) return <LoadingScreen />;

  // `useGetOrderById` now returns the order object directly (or null)
  const order: Order = data ?? {};
  const day = order?.createdAt ? dayjs(order.createdAt).format("DD/MM/YYYY") : "N/A";
  const products = Array.isArray(order?.products) ? order.products : [];
  const total = products.reduce((acc, product) => {
    return acc + (product.price || 0) * (product.quantity || 1);
  }, 0);

  const hasReturnRequest = order.order_status === "RETURN_REQUESTED" && order.return_request?.status === "PENDING";
  const hasReplacementRequest = order.order_status === "REPLACEMENT_REQUESTED" && order.replacement_request?.status === "PENDING";

  const handleApproveRequest = async (type: "return" | "replacement") => {
    if (!adminComment.trim()) {
      toast.error("Admin comment is required");
      return;
    }

    setIsSubmitting(true);
    try {
      await orderAPI.approveRequest(String(id), {
        type,
        admin_comment: adminComment,
        overrideWindow,
      });
      toast.success(`${type} request approved successfully`);
      setAdminComment("");
      setOverrideWindow(false);
      setShowReturnApproval(false);
      setShowReplacementApproval(false);
      refetch();
    } catch (error) {
      toast.error(`Failed to approve ${type} request`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRejectRequest = async (type: "return" | "replacement") => {
    if (!adminComment.trim()) {
      toast.error("Admin comment is required");
      return;
    }

    setIsSubmitting(true);
    try {
      await orderAPI.rejectRequest(String(id), {
        type,
        admin_comment: adminComment,
      });
      toast.success(`${type} request rejected successfully`);
      setAdminComment("");
      setShowReturnApproval(false);
      setShowReplacementApproval(false);
      refetch();
    } catch (error) {
      toast.error(`Failed to reject ${type} request`);
    } finally {
      setIsSubmitting(false);
    }
  };


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
                      CANCELLED_BY_USER: "red",
                      RETURN_REQUESTED: "blue",
                      RETURN_APPROVED: "blue",
                      RETURN_REJECTED: "red",
                      RETURNED: "green",
                      REPLACEMENT_REQUESTED: "blue",
                      REPLACEMENT_APPROVED: "blue",
                      REPLACEMENT_REJECTED: "red",
                      REPLACEMENT_IN_PROGRESS: "orange",
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

      {/* Return Request Section */}
      {hasReturnRequest && (
        <section className="p-4 mt-8 bg-white rounded-md border border-blue-200">
          <h2 className="text-lg font-semibold mb-4 text-blue-600">Return Request Pending Approval</h2>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-semibold">User Reason:</p>
                  <p className="text-sm text-gray-700">{order.return_request?.reason}</p>
                </div>
                
                {order.return_request?.proof_images && order.return_request.proof_images.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold mb-2">Proof Images:</p>
                    <div className="flex gap-2 flex-wrap">
                      {order.return_request.proof_images.map((img, idx) => (
                        <img 
                          key={idx}
                          src={img} 
                          alt={`Proof ${idx + 1}`}
                          className="w-24 h-24 object-cover rounded border"
                        />
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-sm font-semibold block mb-2">Admin Comment:</label>
                  <textarea
                    value={adminComment}
                    onChange={(e) => setAdminComment(e.target.value)}
                    placeholder="Enter your comment for approval or rejection"
                    className="w-full p-2 border rounded text-sm"
                    rows={3}
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => handleApproveRequest("return")}
                    disabled={isSubmitting}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Approve Return
                  </Button>
                  <Button
                    onClick={() => handleRejectRequest("return")}
                    disabled={isSubmitting}
                    variant="destructive"
                  >
                    Reject Return
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      {/* Replacement Request Section */}
      {hasReplacementRequest && (
        <section className="p-4 mt-8 bg-white rounded-md border border-purple-200">
          <h2 className="text-lg font-semibold mb-4 text-purple-600">Replacement Request Pending Approval</h2>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-semibold">User Reason:</p>
                  <p className="text-sm text-gray-700">{order.replacement_request?.reason}</p>
                </div>
                
                {order.replacement_request?.proof_images && order.replacement_request.proof_images.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold mb-2">Proof Images:</p>
                    <div className="flex gap-2 flex-wrap">
                      {order.replacement_request.proof_images.map((img, idx) => (
                        <img 
                          key={idx}
                          src={img} 
                          alt={`Proof ${idx + 1}`}
                          className="w-24 h-24 object-cover rounded border"
                        />
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-sm font-semibold block mb-2">Admin Comment:</label>
                  <textarea
                    value={adminComment}
                    onChange={(e) => setAdminComment(e.target.value)}
                    placeholder="Enter your comment for approval or rejection"
                    className="w-full p-2 border rounded text-sm"
                    rows={3}
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => handleApproveRequest("replacement")}
                    disabled={isSubmitting}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Approve Replacement
                  </Button>
                  <Button
                    onClick={() => handleRejectRequest("replacement")}
                    disabled={isSubmitting}
                    variant="destructive"
                  >
                    Reject Replacement
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      {/* Status History Section */}
      {order.status_history && order.status_history.length > 0 && (
        <section className="p-4 mt-8 bg-white rounded-md">
          <h2 className="text-lg font-semibold mb-4">Order Timeline</h2>
          <div className="space-y-3">
            {order.status_history.map((history, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 border-l-4 border-blue-400 bg-gray-50">
                <div className="flex-1">
                  <p className="text-sm font-semibold">{history.status?.replace(/_/g, " ")}</p>
                  {history.reason && <p className="text-sm text-gray-600">{history.reason}</p>}
                  <p className="text-xs text-gray-500 mt-1">
                    {dayjs(history.updatedAt).format("DD/MM/YYYY HH:mm")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default OrderView;
