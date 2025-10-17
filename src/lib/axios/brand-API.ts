import instance from './instance';

export const brandAPI = {
    getBrands: async () => {
        return instance.get('/brand/all');
    },
    addBrand: async (payload: any) => {
        return instance.post(`/admin/brand/add`, payload);
    },
    getBrand: async (id: string) => {
        return instance.get(`/brand/${id}`);
    },
    updateBrand: async (payload: any) => {
        return instance.put(`/admin/brand/${payload._id}/edit`, payload);
    },
    deleteBrand: async (id: string) => {
        return instance.delete(`/admin/brand/${id}/delete`);
    }
};
