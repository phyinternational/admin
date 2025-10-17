import instance from './instance';

export const authAPI = {
  registerUser: async (payload: unknown) => {
    return instance.post('/signup',payload);
  },
  loginUser:async (payload: unknown) => {
    return instance.post('/admin/signin',payload);
  },
  getUser: () => instance.get('/user/current'),
  getDashboardData: () => instance.get('/admin/dashboard'),
  getConstants: () => instance.get('/user/constants'),
  updateConstants: (payload: unknown) => instance.post('/user/constants', payload),
  logoutUser: () => instance.get('/logout'),
};

