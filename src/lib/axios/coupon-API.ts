import instance from './instance';

export const couponAPI = {
  createCoupon: async (payload: unknown) => {
    return instance.post('/admin/coupon/add', payload);
  },

  getCoupons: async () => {
    return instance.get('/coupon/all');
  },

  getCouponById: async (couponId: string) => {
    return instance.get(`/coupon/single/${couponId}`);
  },

  getCouponByCode: async (couponCode: string) => {
    return instance.get(`/coupon/${couponCode}/get}`);
  },

  updateCoupon: async (payload:any) => {
    return instance.post(`/admin/coupon/${payload._id}/edit`, payload);
  },

  deleteCoupon: async (couponId: string) => {
    return instance.delete(`/coupons/${couponId}`);
  },
};
