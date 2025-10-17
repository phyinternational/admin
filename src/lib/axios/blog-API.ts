import instance from './instance';

export const blogAPI = {
    getBlogs: async () => {
        return instance.get('/blog/all');
    },
    addBlog: async (payload:unknown) => {
        return instance.post(`/admin/blog/add`, payload);
    },
    getBlog: async (id:string) => {
        return instance.get(`/blog/${id}`);
    },
    updateBlog: async (payload:any) => {
        return instance.put(`/admin/blog/${payload._id}/edit`, payload);
    },
 };
