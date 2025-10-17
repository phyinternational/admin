import instance from './instance';

export const productRatingAPI = {
  getRatings: async () => {
    return instance.get('/product/rating/all');
  },
  getRating: async (id: string) => {
    return instance.get(`/product/rating/single/${id}`);
  },
  getRatingsByProduct :async (productId:string)=>{
   return instance.get(`/product/rating/${productId}`)
  },
  addRating: async (data: any) => {
    return instance.post('/product/rating', data);
  },
  addAdminRating: async (data: any) => {
    return instance.post('/product/admin/rating', data);
  },
  updateRating: async (data: any) => {
    return instance.put(`/product/rating/${data._id}`, data);
  },
};
