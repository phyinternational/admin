import { useEffect, useMemo, useRef, useState } from "react";
import LoadingScreen from "../common/loading-screen";
import DataTable from "../table/data-table-server";
import { Input } from "../ui/input";
import { Order } from "./orders";
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
import { Filter, X } from "lucide-react";

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
  const searchInput = useRef<HTMLInputElement>();
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

    const type = reviewOrder.order.order_status === 'REPLACEMENT_REQUESTED' ? 'replacement' : 'return';
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

  useEffect(() => {
    if (searchInput.current) searchInput.current.focus();
  });
  useEffect(() => {
    setFilter((f) => ({ ...f, search, pageIndex: 0 }));
  }, [search]);

  return (
    <section className="">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-3xl tracking-wide">Orders List</h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 ${showFilters ? 'bg-gray-100 border-blue-500 text-blue-600' : ''}`}
          >
            <Filter size={18} />
            {showFilters ? 'Hide Filters' : 'Advanced Filters'}
          </Button>
          {(filter.startDate || filter.endDate || filter.paymentMode !== 'ALL' || filter.paymentStatus !== 'ALL' || filter.minPrice || filter.maxPrice || filter.search) && (
            <Button variant="ghost" onClick={resetFilters} className="text-red-500 hover:text-red-600 flex items-center gap-1">
              <X size={16} />
              Reset Filters
            </Button>
          )}
        </div>
      </div>

      <Tabs value={filter.status} onValueChange={handleStatusChange} className="mt-6">
        <TabsList className="bg-neutral-100 text-black p-1 h-auto w-fit flex flex-wrap gap-1 justify-start">
          <TabsTrigger value="ALL" className="data-[state=active]:bg-white px-4 py-2">All Orders</TabsTrigger>
          <TabsTrigger value="PLACED" className="data-[state=active]:bg-white px-4 py-2">Placed</TabsTrigger>
          <TabsTrigger value="SHIPPED" className="data-[state=active]:bg-white px-4 py-2">Shipped</TabsTrigger>
          <TabsTrigger value="DELIVERED" className="data-[state=active]:bg-white px-4 py-2">Delivered</TabsTrigger>
          <TabsTrigger value="cancelled" className="data-[state=active]:bg-white px-4 py-2 text-red-600">Cancelled</TabsTrigger>
          <TabsTrigger value="return" className="data-[state=active]:bg-white px-4 py-2 text-blue-600">Returns</TabsTrigger>
          <TabsTrigger value="replacement" className="data-[state=active]:bg-white px-4 py-2 text-purple-600">Replacements</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="mt-4 rounded-lg border bg-white px-4 py-6">
        {showFilters && (
          <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-md border border-dashed border-gray-300 animate-in slide-in-from-top-2 duration-300">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500">Start Date</label>
              <Input 
                type="date" 
                value={filter.startDate} 
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                className="bg-white h-9"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500">End Date</label>
              <Input 
                type="date" 
                value={filter.endDate} 
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                className="bg-white h-9"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500">Payment Mode</label>
              <Select value={filter.paymentMode} onValueChange={(v) => handleFilterChange('paymentMode', v)}>
                <SelectTrigger className="bg-white h-9">
                  <SelectValue placeholder="Mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Modes</SelectItem>
                  <SelectItem value="ONLINE">Online (Stripe/RZP)</SelectItem>
                  <SelectItem value="COD">Cash on Delivery</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500">Payment Status</label>
              <Select value={filter.paymentStatus} onValueChange={(v) => handleFilterChange('paymentStatus', v)}>
                <SelectTrigger className="bg-white h-9">
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
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500">Min Price (₹)</label>
              <Input 
                type="number" 
                placeholder="0"
                value={filter.minPrice} 
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                className="bg-white h-9"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500">Max Price (₹)</label>
              <Input 
                type="number" 
                placeholder="No limit"
                value={filter.maxPrice} 
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                className="bg-white h-9"
              />
            </div>
          </div>
        )}

        <header className="mb-5  ml-2 flex items-center">
          <span className="mr-3 h-8 w-5 rounded-md bg-violet-300"></span>
          <Input
            value={search}
            placeholder="Search Orders here"
            onChange={(e) => setSearch(e.target.value)}
            className="w-96 placeholder:text-base"
          />
        </header>
        {isSuccess && (
          <DataTable
            columns={columns}
            data={orders}
            page={filter.pageIndex}
            totalPage={data?.data?.data?.totalPages ?? data?.data?.totalPage}
            changePage={changePage}
          />
        )}
        {isLoading && <LoadingScreen />}
      </div>

      <Dialog open={!!reviewOrder} onOpenChange={(open) => !open && setReviewOrder(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="capitalize">
              {reviewOrder?.action} {reviewOrder?.order?.order_status?.replace(/_/g, ' ')}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-500 mb-2">
              User Reason: <span className="font-semibold text-gray-700">
                {reviewOrder?.order?.return_request?.reason || reviewOrder?.order?.replacement_request?.reason || "N/A"}
              </span>
            </p>
            <label className="text-sm font-medium mb-1 block">Admin Comment (Reason for {reviewOrder?.action}):</label>
            <Textarea 
              value={adminComment} 
              onChange={(e) => setAdminComment(e.target.value)}
              placeholder="Enter comment here..."
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReviewOrder(null)}>Cancel</Button>
            <Button 
              className={reviewOrder?.action === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
              onClick={submitReview}
              disabled={approveMutation.isPending || rejectMutation.isPending}
            >
              {(approveMutation.isPending || rejectMutation.isPending) ? "Processing..." : `Confirm ${reviewOrder?.action}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default OrdersList;
