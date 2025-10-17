import instance from './instance';

export const bannerAPI = {
    getBanners: async () => {
        return instance.get('/banners');
    },
    addBanner: async (payload: unknown) => {
        return instance.post(`/admin/banners`, payload);
    },
    getBanner: async (id: string) => {
        return instance.get(`/banners/${id}`);
    },
    updateBanner: async (payload: any) => {
        return instance.put(`/admin/banners/${payload._id}`, payload);
    },
    deleteBanner: async (id: string) => {
        return instance.delete(`/admin/banners/${id}`);
    },
};
