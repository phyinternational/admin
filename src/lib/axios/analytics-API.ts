import instance from './instance';

export const analyticsAPI = {
  getAnalytics: async (startDate?: string, endDate?: string) => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    return instance.get(`/admin/analytics?${params.toString()}`);
  },
};
