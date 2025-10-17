import instance from './instance';

export const colorAPI = {
  getColors: async () => {
    return instance.get('/product/color/all');
  },
  addColor: async (payload:unknown) => {
    return instance.post(`/product/color/add`, payload);
  },
  updateColor: async (payload:any) => {
    return instance.post(`/product/color/update/${payload._id}`, payload);
  },
  getColor: async (id:string) => {
    return instance.get(`/product/color/${id}`);
  },
  deleteColor: async (id:string) => {
    return instance.delete(`/product/color/${id}`);
  },
};
