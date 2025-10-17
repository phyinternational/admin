import { useGetBlog, useUpdateBlog } from "@/lib/react-query/blog-query";
import { useParams } from "react-router";
import LoadingScreen from "../common/loading-screen";
import BlogForm from "./blog-form";
import { useMemo } from "react";

const UpdateBlogForm = () => {
  const { id } = useParams();
  const { data: blogData, isLoading } = useGetBlog(id ?? "");
  const { mutate, isPending } = useUpdateBlog();

  const onSubmit = (data: any) => {
    mutate({ ...data, _id: id });
  };

  const defaultValues: any = useMemo(() => {
    if (!blogData) return null;

    const blog = blogData.data.data.blog;
    return {
      title: blog.title,
      content: blog.content,
      displayImage: blog.displayImage,
    };
  }, [blogData]);

  console.log(defaultValues);

  if (isLoading && !defaultValues) <LoadingScreen />;

  if (!defaultValues) return null;
  return (
    <section className="flex flex-col space-y-4">
      <header className="border-b mb-10 pb-4">
        <h1 className="text-2xl font-bold">Update Blog</h1>
        <p className="text-sm text-gray-500">
          Update an existing blog in your store.
        </p>
      </header>
      <BlogForm
        isPending={isPending}
        defaultValues={defaultValues}
        onSubmit={onSubmit}
      />
    </section>
  );
};

export default UpdateBlogForm;
