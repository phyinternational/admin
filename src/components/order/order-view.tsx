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
import { Package, XCircle, AlertCircle, RefreshCcw, Clock } from "lucide-react";

const OrderView = () => {
  const { id } = useParams();
  const { isLoading, data, refetch } = useGetOrderById(String(id));
  const [adminComment, setAdminComment] = useState("");
  const [overrideWindow, setOverrideWindow] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isLoading) return <LoadingScreen />;

  // `useGetOrderById` now returns the order object directly (or null)
  const order: Order = data ?? {};
  const day = order?.createdAt ? dayjs(order.createdAt).format("DD/MM/YYYY") : "N/A";
  const products = Array.isArray(order?.products) ? order.products : [];

  // Helper function to check if an item is cancelled
  const isItemCancelled = (productId: string, variantId?: string) => {
    return order.cancelled_items?.some(
      c => c.product?._id?.toString() === productId?.toString() ||
           c.product?.toString() === productId?.toString()
    );
  };

  // Helper function to get item return request
  const getItemReturnRequest = (productId: string, variantId?: string) => {
    return order.item_return_requests?.find(
      r => (r.product?._id?.toString() === productId?.toString() ||
            r.product?.toString() === productId?.toString()) &&
           r.status === 'PENDING'
    );
  };

  // Helper function to get item replacement request
  const getItemReplacementRequest = (productId: string, variantId?: string) => {
    return order.item_replacement_requests?.find(
      r => (r.product?._id?.toString() === productId?.toString() ||
            r.product?.toString() === productId?.toString()) &&
           r.status === 'PENDING'
    );
  };

  // Categorize items
  const activeItems = products.filter(p => {
    const prodId = p.product?._id || p.product;
    // Active items = not cancelled AND no pending return/replacement requests
    return !isItemCancelled(prodId, p.variant) &&
           !getItemReturnRequest(prodId, p.variant) &&
           !getItemReplacementRequest(prodId, p.variant);
  });

  const cancelledItems = products.filter(p => {
    const prodId = p.product?._id || p.product;
    return isItemCancelled(prodId, p.variant);
  });

  const itemsWithReturnRequests = products.filter(p => {
    const prodId = p.product?._id || p.product;
    return getItemReturnRequest(prodId, p.variant);
  });

  const itemsWithReplacementRequests = products.filter(p => {
    const prodId = p.product?._id || p.product;
    return getItemReplacementRequest(prodId, p.variant);
  });

  const total = activeItems.reduce((acc, product) => {
    return acc + (product.price || 0) * (product.quantity || 1);
  }, 0);

  const cancelledTotal = cancelledItems.reduce((acc, product) => {
    return acc + (product.price || 0) * (product.quantity || 1);
  }, 0);

  // Check for order-level requests (backward compatibility)
  const hasOrderReturnRequest = order.order_status === "RETURN_REQUESTED" && order.return_request?.status === "PENDING";
  const hasOrderReplacementRequest = order.order_status === "REPLACEMENT_REQUESTED" && order.replacement_request?.status === "PENDING";

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
      refetch();
    } catch (error) {
      toast.error(`Failed to reject ${type} request`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getItemCountSummary = () => {
    const total = products.length;
    const cancelled = cancelledItems.length;
    const returnRequests = itemsWithReturnRequests.length;
    const replacementRequests = itemsWithReplacementRequests.length;

    const badges = [];
    if (cancelled > 0) badges.push(`${cancelled} cancelled`);
    if (returnRequests > 0) badges.push(`${returnRequests} return pending`);
    if (replacementRequests > 0) badges.push(`${replacementRequests} replacement pending`);

    return badges.length > 0 ? `${total} items (${badges.join(', ')})` : `${total} items`;
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Order Details</h1>

      {/* Item Count Summary Badge */}
      <div className="mb-4">
        <Badge variant="outline" className="text-sm">
          {getItemCountSummary()}
        </Badge>
      </div>

      <section className="p-4 bg-white flex flex-col lg:flex-row gap-4 lg:gap-8 rounded-md">
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Shipping Details</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="space-y-2 text-gray-700">
              <div className="">
                <div className="text-sm font-semibold text-gray-500 uppercase tracking-tight">Order ID:</div>
                <div className="text-sm font-bold break-all">
                  {id}
                </div>
              </div>
              <div className="">
                <div className="text-sm font-semibold text-gray-500 uppercase tracking-tight">Order Date:</div>
                <div className="text-sm font-semibold">{day}</div>
              </div>
              <div className="">
                <div className="text-sm font-semibold text-gray-500 uppercase tracking-tight">Customer:</div>
                <div className="text-sm font-semibold">
                  {order?.buyer?.displayName || order?.buyer?.email || "N/A"}
                </div>
              </div>
            </CardDescription>
          </CardContent>
        </Card>
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="space-y-2 text-gray-700">
              <div className="flex justify-between md:grid md:grid-cols-2 gap-2">
                <span className="text-sm font-semibold text-gray-500">Payment Method:</span>
                <span className="text-sm font-semibold">
                  {order.payment_mode}
                </span>
              </div>
              <div className="flex justify-between md:grid md:grid-cols-2 gap-2">
                <span className="text-sm font-semibold text-gray-500">Order Status:</span>
                <span className="text-sm font-semibold">
                  {(() => {
                    const status = (order.order_status || "").toString();
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
                    const label = (status.replace(/_/g, " ") || "N/A");
                    return <Badge variant={variant} className="whitespace-nowrap">{label}</Badge>;
                  })()}
                </span>
              </div>
              <div className="flex justify-between md:grid md:grid-cols-2 gap-2">
                <span className="text-sm font-semibold text-gray-500">Payment Status:</span>
                <span className="text-sm font-semibold">
                  {order.payment_status}
                </span>
              </div>
              <div className="flex flex-col md:grid md:grid-cols-2 gap-2">
                <span className="text-sm font-semibold text-gray-500">Delivery Address:</span>
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
        <Card className="flex-1">
          <CardContent className="p-0">
            <CardHeader>
              <CardTitle className="text-left">Order Status Form</CardTitle>
            </CardHeader>
            <div className="p-6 pt-0">
              <OrderStatusForm
                defaultValues={{ order_status: order.order_status }}
              />
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ACTIVE ITEMS - Items to Ship/Track */}
      {activeItems.length > 0 && (
        <section className="p-4 mt-8 bg-white rounded-md border-l-4 border-green-500">
          <div className="flex items-center gap-2 mb-4">
            <Package className="text-green-600" size={20} />
            <h2 className="text-lg font-semibold text-green-700">
              Active Items {order.order_status === 'PLACED' && '(Ready to Ship)'}
            </h2>
            <Badge variant="green">{activeItems.length} {activeItems.length === 1 ? 'item' : 'items'}</Badge>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="whitespace-nowrap">Product Name</TableHead>
                  <TableHead className="whitespace-nowrap">Product ID</TableHead>
                  <TableHead className="whitespace-nowrap">Quantity</TableHead>
                  <TableHead className="whitespace-nowrap">Price</TableHead>
                  <TableHead className="whitespace-nowrap">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activeItems.map((product, i) => (
                  <TableRow key={i} className="bg-green-50/30">
                    <TableCell className="font-medium whitespace-nowrap">{product?.product?.productTitle || "N/A"}</TableCell>
                    <TableCell className="text-xs text-gray-600 whitespace-nowrap">{product?.product?.productSlug || "N/A"}</TableCell>
                    <TableCell>{product?.quantity || 1}</TableCell>
                    <TableCell className="whitespace-nowrap">₹{(product?.price || 0).toLocaleString('en-IN')}</TableCell>
                    <TableCell className="font-semibold whitespace-nowrap">₹{((product?.price || 0) * (product?.quantity || 1)).toLocaleString('en-IN')}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={4} className="text-right font-semibold">Active Items Total</TableCell>
                  <TableCell>
                    <span className="text-sm font-bold text-green-700 whitespace-nowrap">₹{total.toLocaleString('en-IN')}</span>
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        </section>
      )}

      {/* CANCELLED ITEMS */}
      {cancelledItems.length > 0 && (
        <section className="p-4 mt-8 bg-white rounded-md border-l-4 border-red-500">
          <div className="flex items-center gap-2 mb-4">
            <XCircle className="text-red-600" size={20} />
            <h2 className="text-lg font-semibold text-red-700">Cancelled Items</h2>
            <Badge variant="destructive">{cancelledItems.length} {cancelledItems.length === 1 ? 'item' : 'items'}</Badge>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="whitespace-nowrap">Product Name</TableHead>
                  <TableHead className="whitespace-nowrap">Product ID</TableHead>
                  <TableHead className="whitespace-nowrap">Quantity</TableHead>
                  <TableHead className="whitespace-nowrap">Price</TableHead>
                  <TableHead className="whitespace-nowrap">Reason</TableHead>
                  <TableHead className="whitespace-nowrap">Cancelled On</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cancelledItems.map((product, i) => {
                  const prodId = product?.product?._id || product?.product;
                  const cancelInfo = order.cancelled_items?.find(
                    c => c.product?._id?.toString() === prodId?.toString() ||
                        c.product?.toString() === prodId?.toString()
                  );
                  return (
                    <TableRow key={i} className="bg-red-50/30">
                      <TableCell className="font-medium line-through text-gray-500 whitespace-nowrap">{product?.product?.productTitle || "N/A"}</TableCell>
                      <TableCell className="text-xs text-gray-600 whitespace-nowrap">{product?.product?.productSlug || "N/A"}</TableCell>
                      <TableCell>{product?.quantity || 1}</TableCell>
                      <TableCell className="line-through text-gray-500 whitespace-nowrap">₹{((product?.price || 0) * (product?.quantity || 1)).toLocaleString('en-IN')}</TableCell>
                      <TableCell className="text-sm text-red-700 whitespace-nowrap">{cancelInfo?.reason || "N/A"}</TableCell>
                      <TableCell className="text-xs text-gray-600 whitespace-nowrap">
                        {cancelInfo?.cancelledAt ? dayjs(cancelInfo.cancelledAt).format("DD/MM/YYYY HH:mm") : "N/A"}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={5} className="text-right text-gray-500">Cancelled Amount</TableCell>
                  <TableCell>
                    <span className="text-sm line-through text-gray-500 whitespace-nowrap">₹{cancelledTotal.toLocaleString('en-IN')}</span>
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        </section>
      )}

      {/* ITEMS WITH RETURN REQUESTS (Item-Level) */}
      {itemsWithReturnRequests.length > 0 && (
        <section className="p-4 mt-8 bg-white rounded-md border-l-4 border-blue-500">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="text-blue-600" size={20} />
            <h2 className="text-lg font-semibold text-blue-700">Items with Return Requests</h2>
            <Badge variant="blue">{itemsWithReturnRequests.length} pending</Badge>
          </div>

          {itemsWithReturnRequests.map((product, i) => {
            const prodId = product?.product?._id || product?.product;
            const returnRequest = getItemReturnRequest(prodId, product.variant);

            if (!returnRequest) return null;

            return (
              <Card key={i} className="mb-4 border-blue-200">
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10">
                    {/* Left: Product Info */}
                    <div>
                      <h3 className="font-semibold text-lg mb-3">{product?.product?.productTitle || "N/A"}</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600 font-medium">Product ID:</span>
                          <span className="font-semibold text-gray-900 border-b border-gray-100">{product?.product?.productSlug || "N/A"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 font-medium">Quantity:</span>
                          <span className="font-semibold text-gray-900">{returnRequest.quantity || product.quantity}</span>
                        </div>
                        <div className="flex justify-between border-t pt-2 mt-2">
                          <span className="text-gray-600 font-bold uppercase text-xs">Price:</span>
                          <span className="font-bold text-blue-700">₹{((product?.price || 0) * (returnRequest.quantity || product.quantity || 1)).toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Return Request Details */}
                    <div>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-semibold mb-1 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                            User Reason:
                          </p>
                          <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100 italic shadow-sm">"{returnRequest.reason}"</p>
                        </div>

                        {returnRequest.proof_images && returnRequest.proof_images.length > 0 && (
                          <div>
                            <p className="text-sm font-semibold mb-2">Proof Images:</p>
                            <div className="flex gap-2 flex-wrap">
                              {returnRequest.proof_images.map((img, idx) => (
                                <img
                                  key={idx}
                                  src={img}
                                  alt={`Proof ${idx + 1}`}
                                  className="w-20 h-20 object-cover rounded-lg border shadow-sm cursor-pointer hover:scale-105 transition active:scale-95"
                                  onClick={() => window.open(img, '_blank')}
                                />
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="pt-2">
                          <p className="text-[11px] font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-full w-fit">
                            Requested on {dayjs(returnRequest.requestedAt).format("DD/MM/YYYY HH:mm")}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Admin Action Section */}
                  <div className="mt-6 pt-6 border-t border-dashed">
                    <label className="text-sm font-semibold block mb-2 text-gray-700">Admin Comment:</label>
                    <textarea
                      value={adminComment}
                      onChange={(e) => setAdminComment(e.target.value)}
                      placeholder="Explain the reason for approval or rejection..."
                      className="w-full p-3 border border-gray-200 rounded-lg text-sm mb-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-inner"
                      rows={3}
                    />
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button
                        onClick={() => handleApproveRequest("return")}
                        disabled={isSubmitting}
                        className="flex-1 bg-green-600 hover:bg-green-700 shadow-md h-11"
                      >
                        Approve Return
                      </Button>
                      <Button
                        onClick={() => handleRejectRequest("return")}
                        disabled={isSubmitting}
                        variant="destructive"
                        className="flex-1 shadow-md h-11"
                      >
                        Reject Return
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </section>
      )}

      {/* ITEMS WITH REPLACEMENT REQUESTS (Item-Level) */}
      {itemsWithReplacementRequests.length > 0 && (
        <section className="p-4 mt-8 bg-white rounded-md border-l-4 border-purple-500">
          <div className="flex items-center gap-2 mb-4">
            <RefreshCcw className="text-purple-600" size={20} />
            <h2 className="text-lg font-semibold text-purple-700">Items with Replacement Requests</h2>
            <Badge variant="purple">{itemsWithReplacementRequests.length} pending</Badge>
          </div>

          {itemsWithReplacementRequests.map((product, i) => {
            const prodId = product?.product?._id || product?.product;
            const replacementRequest = getItemReplacementRequest(prodId, product.variant);

            if (!replacementRequest) return null;

            return (
              <Card key={i} className="mb-4 border-purple-200">
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10">
                    {/* Left: Product Info */}
                    <div>
                      <h3 className="font-semibold text-lg mb-3">{product?.product?.productTitle || "N/A"}</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600 font-medium">Product ID:</span>
                          <span className="font-semibold text-gray-900 border-b border-gray-100">{product?.product?.productSlug || "N/A"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 font-medium">Quantity:</span>
                          <span className="font-semibold text-gray-900">{replacementRequest.quantity || product.quantity}</span>
                        </div>
                        <div className="flex justify-between border-t pt-2 mt-2">
                          <span className="text-gray-600 font-bold uppercase text-xs">Price:</span>
                          <span className="font-bold text-purple-700">₹{((product?.price || 0) * (replacementRequest.quantity || product.quantity || 1)).toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Replacement Request Details */}
                    <div>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-semibold mb-1 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                            User Reason:
                          </p>
                          <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100 italic shadow-sm">"{replacementRequest.reason}"</p>
                        </div>

                        {replacementRequest.proof_images && replacementRequest.proof_images.length > 0 && (
                          <div>
                            <p className="text-sm font-semibold mb-2">Proof Images:</p>
                            <div className="flex gap-2 flex-wrap">
                              {replacementRequest.proof_images.map((img, idx) => (
                                <img
                                  key={idx}
                                  src={img}
                                  alt={`Proof ${idx + 1}`}
                                  className="w-20 h-20 object-cover rounded-lg border shadow-sm cursor-pointer hover:scale-105 transition active:scale-95"
                                  onClick={() => window.open(img, '_blank')}
                                />
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="pt-2">
                          <p className="text-[11px] font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-full w-fit">
                            Requested on {dayjs(replacementRequest.requestedAt).format("DD/MM/YYYY HH:mm")}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Admin Action Section */}
                  <div className="mt-6 pt-6 border-t border-dashed">
                    <label className="text-sm font-semibold block mb-2 text-gray-700">Admin Comment:</label>
                    <textarea
                      value={adminComment}
                      onChange={(e) => setAdminComment(e.target.value)}
                      placeholder="Explain the reason for approval or rejection..."
                      className="w-full p-3 border border-gray-200 rounded-lg text-sm mb-4 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-inner"
                      rows={3}
                    />
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button
                        onClick={() => handleApproveRequest("replacement")}
                        disabled={isSubmitting}
                        className="flex-1 bg-green-600 hover:bg-green-700 shadow-md h-11"
                      >
                        Approve Replacement
                      </Button>
                      <Button
                        onClick={() => handleRejectRequest("replacement")}
                        disabled={isSubmitting}
                        variant="destructive"
                        className="flex-1 shadow-md h-11"
                      >
                        Reject Replacement
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </section>
      )}

      {/* ORDER-LEVEL Return Request (Backward Compatibility) */}
      {hasOrderReturnRequest && (
        <section className="p-4 mt-8 bg-white rounded-md border border-blue-200">
          <h2 className="text-lg font-semibold mb-4 text-blue-600">Order-Level Return Request Pending Approval</h2>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-semibold">User Reason:</p>
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100 italic shadow-sm">"{order.return_request?.reason}"</p>
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
                          className="w-24 h-24 object-cover rounded-lg border shadow-sm cursor-pointer hover:scale-105 transition"
                          onClick={() => window.open(img, '_blank')}
                        />
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-sm font-semibold block mb-2 text-gray-700">Admin Comment:</label>
                  <textarea
                    value={adminComment}
                    onChange={(e) => setAdminComment(e.target.value)}
                    placeholder="Explain the reason for approval or rejection..."
                    className="w-full p-3 border border-gray-200 rounded-lg text-sm mb-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-inner"
                    rows={3}
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={() => handleApproveRequest("return")}
                    disabled={isSubmitting}
                    className="flex-1 bg-green-600 hover:bg-green-700 shadow-md h-11"
                  >
                    Approve Return
                  </Button>
                  <Button
                    onClick={() => handleRejectRequest("return")}
                    disabled={isSubmitting}
                    variant="destructive"
                    className="flex-1 shadow-md h-11"
                  >
                    Reject Return
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      {/* ORDER-LEVEL Replacement Request (Backward Compatibility) */}
      {hasOrderReplacementRequest && (
        <section className="p-4 mt-8 bg-white rounded-md border border-purple-200">
          <h2 className="text-lg font-semibold mb-4 text-purple-600">Order-Level Replacement Request Pending Approval</h2>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-semibold">User Reason:</p>
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100 italic shadow-sm">"{order.replacement_request?.reason}"</p>
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
                          className="w-24 h-24 object-cover rounded-lg border shadow-sm cursor-pointer hover:scale-105 transition"
                          onClick={() => window.open(img, '_blank')}
                        />
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-sm font-semibold block mb-2 text-gray-700">Admin Comment:</label>
                  <textarea
                    value={adminComment}
                    onChange={(e) => setAdminComment(e.target.value)}
                    placeholder="Explain the reason for approval or rejection..."
                    className="w-full p-3 border border-gray-200 rounded-lg text-sm mb-4 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-inner"
                    rows={3}
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={() => handleApproveRequest("replacement")}
                    disabled={isSubmitting}
                    className="flex-1 bg-green-600 hover:bg-green-700 shadow-md h-11"
                  >
                    Approve Replacement
                  </Button>
                  <Button
                    onClick={() => handleRejectRequest("replacement")}
                    disabled={isSubmitting}
                    variant="destructive"
                    className="flex-1 shadow-md h-11"
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
        <section className="p-4 mt-8 bg-white rounded-md border shadow-sm">
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <Clock size={18} className="text-gray-500" />
            Order Timeline
          </h2>
          <div className="space-y-4 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
            {order.status_history.map((history, idx) => (
              <div key={idx} className="relative pl-8 pb-4 last:pb-0">
                <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-white border-2 border-blue-400 z-10"></div>
                <div className="p-4 border border-gray-100 bg-gray-50 rounded-xl hover:shadow-md transition-all">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 mb-2">
                    <p className="text-sm font-bold text-gray-900 uppercase tracking-tight">{history.status?.replace(/_/g, " ")}</p>
                    <p className="text-[11px] font-medium text-gray-400 bg-white px-2 py-0.5 rounded-full border">
                      {dayjs(history.updatedAt).format("DD/MM/YYYY HH:mm")}
                    </p>
                  </div>
                  {history.reason && (
                    <div className="mt-2 text-sm text-gray-600 bg-white p-3 rounded-lg border border-dashed border-gray-200">
                      <span className="font-semibold text-gray-400 text-xs block mb-1">REASON / COMMENT:</span>
                      {history.reason}
                    </div>
                  )}
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
