import { useEffect, useMemo, useRef, useState } from "react";
import LoadingScreen from "../common/loading-screen";
import DataTable from "../table/data-table-server";
import { Input } from "../ui/input";
import { Order, ItemEntry, computeItemStatus } from "./orders";
import { useGetOrders, useApproveOrderRequest, useRejectOrderRequest } from "@/lib/react-query/order-query";
import { getOrderColumns } from "./order-columns";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { toast } from "sonner";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Filter, X, Search, AlertCircle } from "lucide-react";

type TableFilter = {
  pageIndex: number;
  pageSize: number;
  search: string;
  status: string;
  startDate: string;
  endDate: string;
  paymentMode: string;
  paymentStatus: string;
  minPrice: string;
  maxPrice: string;
};

const OrdersList = () => {
  const [search, setSearch] = useState<string>("");
  const searchInput = useRef<HTMLInputElement>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filter, setFilter] = useState<TableFilter>({
    pageIndex: 0,
    pageSize: 10,
    search: "",
    status: "ALL",
    startDate: "",
    endDate: "",
    paymentMode: "ALL",
    paymentStatus: "ALL",
    minPrice: "",
    maxPrice: "",
  });

  const [reviewOrder, setReviewOrder] = useState<{ order: Order; action: 'approve' | 'reject' } | null>(null);
  const [adminComment, setAdminComment] = useState("");

  const approveMutation = useApproveOrderRequest();
  const rejectMutation = useRejectOrderRequest();

  const changePage = ({ pageIndex }: { pageIndex: number }) => {
    setFilter((prev) => ({ ...prev, pageIndex: pageIndex }));
  };

  const handleStatusChange = (value: string) => {
    setFilter((prev) => ({ ...prev, status: value, pageIndex: 0 }));
  };

  const handleFilterChange = (key: keyof TableFilter, value: any) => {
    setFilter(prev => ({ ...prev, [key]: value, pageIndex: 0 }));
  };

  const resetFilters = () => {
    setFilter({
      pageIndex: 0,
      pageSize: 10,
      search: "",
      status: "ALL",
      startDate: "",
      endDate: "",
      paymentMode: "ALL",
      paymentStatus: "ALL",
      minPrice: "",
      maxPrice: "",
    });
    setSearch("");
  };

  const { isLoading, data, isSuccess } = useGetOrders(filter);

  const handleReview = (order: Order, action: 'approve' | 'reject') => {
    setReviewOrder({ order, action });
    setAdminComment("");
  };

  const submitReview = async () => {
    if (!reviewOrder) return;
    if (!adminComment.trim()) {
      toast.error("Please enter a comment/reason.");
      return;
    }

    const type = reviewOrder.order.order_status?.includes('REPLACEMENT') ? 'replacement' : 'return';
    const payload = { type, admin_comment: adminComment };

    try {
      if (reviewOrder.action === 'approve') {
        await approveMutation.mutateAsync({ id: reviewOrder.order._id, data: payload });
        toast.success("Request approved successfully.");
      } else {
        await rejectMutation.mutateAsync({ id: reviewOrder.order._id, data: payload });
        toast.success("Request rejected successfully.");
      }
      setReviewOrder(null);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Action failed.");
    }
  };

  const columns = useMemo(() => getOrderColumns(handleReview), []);

  const orders: Order[] = useMemo(() => {
    // Backend now returns { docs, page, limit, totalDocs, totalPages, hasPrevPage, hasNextPage }
    if (data) return data?.data?.data?.docs ?? data?.data?.data ?? [];

    return [];
  }, [data]);

  // Flatten orders into item-level entries for the table
  const itemEntries: ItemEntry[] = useMemo(() => {
    if (!orders.length) return [];

    const entries: ItemEntry[] = orders.flatMap((order) => {
      if (!order.products || !order.products.length) return [];

      return order.products.map((item) => {
        const itemProductId = item.product?._id || item.product;
        const itemStatus = computeItemStatus(order, item);
        return { order, item, itemStatus, itemProductId };
      });
    });

    // Filter by active tab status (only show items matching that tab)
    const status = filter.status;
    if (status === "ALL") return entries;
    if (status === "PLACED") return entries.filter((e) => e.itemStatus === "PLACED");
    if (status === "SHIPPED") return entries.filter((e) => e.itemStatus === "SHIPPED");
    if (status === "DELIVERED") return entries.filter((e) => e.itemStatus === "DELIVERED");
    if (status === "cancelled") return entries.filter((e) => e.itemStatus.includes("CANCELLED"));
    if (status === "return") return entries.filter((e) => e.itemStatus.includes("RETURN"));
    if (status === "replacement") return entries.filter((e) => e.itemStatus.includes("REPLACEMENT"));

    // Fallback: specific status match
    return entries.filter((e) => e.itemStatus === status);
  }, [orders, filter.status]);

  useEffect(() => {
    if (searchInput.current) searchInput.current.focus();
  });
  useEffect(() => {
    setFilter((f) => ({ ...f, search, pageIndex: 0 }));
  }, [search]);

  return (
    <section className="space-y-6">
      {/* Header with Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Orders Management
          </h2>
          <p className="text-sm text-gray-500 mt-1">Track and manage all customer orders</p>
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <div className="flex flex-col gap-2 w-full sm:w-auto">
            <label className="text-sm font-medium text-gray-700">Search</label>
            <Input
              ref={searchInput}
              value={search}
              placeholder="Search Orders here"
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-96 placeholder:text-base h-10"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 transition-all shadow-sm ${
              showFilters
                ? 'bg-blue-50 border-blue-500 text-blue-600 shadow-blue-100'
                : 'hover:border-blue-400'
            }`}
          >
            <Filter size={18} />
            {showFilters ? 'Hide Filters' : 'Advanced Filters'}
          </Button>
          {(filter.startDate || filter.endDate || filter.paymentMode !== 'ALL' || filter.paymentStatus !== 'ALL' || filter.minPrice || filter.maxPrice || filter.search) && (
            <Button
              variant="ghost"
              onClick={resetFilters}
              className="flex-1 sm:flex-none text-red-500 hover:text-red-600 hover:bg-red-50 flex items-center justify-center gap-1 transition-all"
            >
              <X size={16} />
              Reset Filters
            </Button>
          )}
        </div>
      </div>

      {/* Status Tabs */}
      <Tabs value={filter.status} onValueChange={handleStatusChange} className="w-full">
        <TabsList className="bg-white border rounded-xl p-1.5 h-auto w-full flex flex-wrap gap-2 justify-start shadow-sm">
          <TabsTrigger
            value="ALL"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-gray-900 data-[state=active]:to-gray-700 data-[state=active]:text-white data-[state=active]:shadow-md px-5 py-2.5 rounded-lg font-medium transition-all"
          >
            All Orders
          </TabsTrigger>
          <TabsTrigger
            value="PLACED"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-400 data-[state=active]:to-yellow-500 data-[state=active]:text-yellow-900 data-[state=active]:shadow-md px-5 py-2.5 rounded-lg font-medium transition-all"
          >
            Placed
          </TabsTrigger>
          <TabsTrigger
            value="SHIPPED"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-400 data-[state=active]:to-blue-500 data-[state=active]:text-white data-[state=active]:shadow-md px-5 py-2.5 rounded-lg font-medium transition-all"
          >
            Shipped
          </TabsTrigger>
          <TabsTrigger
            value="DELIVERED"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-400 data-[state=active]:to-green-500 data-[state=active]:text-white data-[state=active]:shadow-md px-5 py-2.5 rounded-lg font-medium transition-all"
          >
            Delivered
          </TabsTrigger>
          <TabsTrigger
            value="cancelled"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-400 data-[state=active]:to-red-500 data-[state=active]:text-white data-[state=active]:shadow-md px-5 py-2.5 rounded-lg font-medium text-red-600 transition-all"
          >
            Cancelled
          </TabsTrigger>
          <TabsTrigger
            value="return"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md px-5 py-2.5 rounded-lg font-medium text-blue-600 transition-all"
          >
            Returns
          </TabsTrigger>
          <TabsTrigger
            value="replacement"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-400 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-md px-5 py-2.5 rounded-lg font-medium text-purple-600 transition-all"
          >
            Replacements
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Orders Table Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
        {/* Advanced Filters Section */}
        {showFilters && (
          <div className="p-6 bg-gradient-to-br from-gray-50 to-white border-b border-gray-200 animate-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="text-blue-600" size={20} />
              <h3 className="text-sm font-semibold text-gray-700">Advanced Filters</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Start Date</label>
                <Input
                  type="date"
                  value={filter.startDate}
                  onChange={(e) => handleFilterChange('startDate', e.target.value)}
                  className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-10 shadow-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">End Date</label>
                <Input
                  type="date"
                  value={filter.endDate}
                  onChange={(e) => handleFilterChange('endDate', e.target.value)}
                  className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-10 shadow-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Payment Mode</label>
                <Select value={filter.paymentMode} onValueChange={(v) => handleFilterChange('paymentMode', v)}>
                  <SelectTrigger className="bg-white border-gray-300 h-10 shadow-sm">
                    <SelectValue placeholder="Mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Modes</SelectItem>
                    <SelectItem value="ONLINE">Online (Stripe/RZP)</SelectItem>
                    <SelectItem value="COD">Cash on Delivery</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Payment Status</label>
                <Select value={filter.paymentStatus} onValueChange={(v) => handleFilterChange('paymentStatus', v)}>
                  <SelectTrigger className="bg-white border-gray-300 h-10 shadow-sm">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Status</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="COMPLETE">Complete</SelectItem>
                    <SelectItem value="FAILED">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Min Price (₹)</label>
                <Input
                  type="number"
                  placeholder="0"
                  value={filter.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-10 shadow-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Max Price (₹)</label>
                <Input
                  type="number"
                  placeholder="No limit"
                  value={filter.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-10 shadow-sm"
                />
              </div>
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className="p-6 border-b border-gray-200 bg-white">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input
              value={search}
              placeholder="Search by Order ID, User name, or Phone..."
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-11 bg-gray-50 border-gray-300 focus:bg-white focus:border-blue-500 focus:ring-blue-500 shadow-sm transition-all"
            />
          </div>
        </div>

        {/* Orders Table */}
        <div className="p-6">
          {isSuccess && (
            <DataTable
              columns={columns}
              data={itemEntries}
              page={filter.pageIndex}
              totalPage={data?.data?.data?.totalPages ?? data?.data?.totalPage}
              changePage={changePage}
            />
          )}
          {isLoading && <LoadingScreen />}
        </div>
      </div>

      {/* Review Modal */}
      <Dialog open={!!reviewOrder} onOpenChange={(open) => !open && setReviewOrder(null)}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold capitalize flex items-center gap-2">
              <div className={`p-2 rounded-lg ${
                reviewOrder?.action === 'approve'
                  ? 'bg-green-100 text-green-600'
                  : 'bg-red-100 text-red-600'
              }`}>
                {reviewOrder?.action === 'approve' ? '✓' : '✗'}
              </div>
              {reviewOrder?.action} {reviewOrder?.order?.order_status?.includes('REPLACEMENT') ? 'Replacement' : 'Return'} Request
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">User's Reason</p>
              <p className="text-sm text-gray-800 font-medium">
                {reviewOrder?.order?.return_request?.reason ||
                 reviewOrder?.order?.replacement_request?.reason ||
                 reviewOrder?.order?.item_return_requests?.[0]?.reason ||
                 reviewOrder?.order?.item_replacement_requests?.[0]?.reason ||
                 "N/A"}
              </p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                Admin Comment
                <span className={`text-xs ${reviewOrder?.action === 'approve' ? 'text-green-600' : 'text-red-600'}`}>
                  (Reason for {reviewOrder?.action})
                </span>
              </label>
              <Textarea
                value={adminComment}
                onChange={(e) => setAdminComment(e.target.value)}
                placeholder="Enter your comment or reason here..."
                rows={4}
                className="resize-none focus:ring-2 focus:ring-blue-500 border-gray-300"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setReviewOrder(null)}
              className="hover:bg-gray-100"
            >
              Cancel
            </Button>
            <Button
              className={`${
                reviewOrder?.action === 'approve'
                  ? 'bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600'
                  : 'bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600'
              } text-white shadow-md transition-all`}
              onClick={submitReview}
              disabled={approveMutation.isPending || rejectMutation.isPending}
            >
              {(approveMutation.isPending || rejectMutation.isPending) ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin">⏳</span> Processing...
                </span>
              ) : (
                `Confirm ${reviewOrder?.action}`
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default OrdersList;
