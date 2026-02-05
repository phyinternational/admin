import instance from './instance';

export const blogAPI = {
    getBlogs: async () => {
        return instance.get('/blog/all?admin=true');
    },
    addBlog: async (payload:unknown) => {
        return instance.post(`/admin/blog/add`, payload);
    },
    getBlog: async (id:string) => {
        return instance.get(`/blog/id/${id}`);
    },
    updateBlog: async (payload:any) => {
        return instance.put(`/admin/blog/${payload._id}/edit`, payload);
    },
    deleteBlog: async (id:string) => {
        return instance.delete(`/admin/blog/${id}/delete`);
    },
    toggleBlogStatus: async (id:string) => {
        return instance.patch(`/admin/blog/${id}/toggle-status`);
    },
 };
