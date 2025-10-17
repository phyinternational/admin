import instance from './instance';

export const orderAPI = {
    getOrders: async (filter: any) => {
        return instance.get('/admin/order/all', {
            params: {
                    page: filter.pageIndex + 1,
                    search: filter.search,
                    limit: filter.pageSize,
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
};
