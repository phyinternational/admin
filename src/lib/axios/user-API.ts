import instance from './instance';

export const userAPI = {
  getAllUsers: async (filter:unknown) => {
    return instance.get('/admin/user/all',{params:filter});
  },
  loginUser:async (payload: unknown) => {
    return instance.post('/admin/signin',payload);
  },
  getUser: () => instance.get('/user/current'),
  getUserCart: (id:string) => instance.get('/admin/user/cart/'+id),
};

