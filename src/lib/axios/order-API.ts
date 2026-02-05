import instance from './instance';

export const orderAPI = {
    getOrders: async (filter: any) => {
        return instance.get('/admin/order/all', {
            params: {
                    page: (filter.pageIndex || 0) + 1,
                    search: filter.search,
                    limit: filter.pageSize || 10,
                    status: filter.status === 'ALL' ? undefined : filter.status,
                    startDate: filter.startDate,
                    endDate: filter.endDate,
                    payment_mode: filter.paymentMode === 'ALL' ? undefined : filter.paymentMode,
                    payment_status: filter.paymentStatus === 'ALL' ? undefined : filter.paymentStatus,
                    minPrice: filter.minPrice,
                    maxPrice: filter.maxPrice,
            }
        });
    },
    // getOrders: async () => {
    //     return instance.get('/admin/order/all');
    // },
    getOrderId: async (id: string) => {
        return instance.get(`/admin/order/${id}`);
    },
    updateOrder: async (data: any) => {
        return instance.put(`/admin/order/${data._id}/update`, data);
    },
    approveRequest: async (id: string, data: { type: 'return' | 'replacement', admin_comment: string, overrideWindow?: boolean }) => {
        return instance.post(`/admin/order/${id}/approve-request`, data);
    },
    rejectRequest: async (id: string, data: { type: 'return' | 'replacement', admin_comment: string }) => {
        return instance.post(`/admin/order/${id}/reject-request`, data);
    },
};
