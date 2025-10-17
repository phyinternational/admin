import { useAddBlog } from "@/lib/react-query/blog-query";
import BlogForm from "./blog-form";

const AddBlogForm = () => {
  const { mutate, isPending } = useAddBlog();
  const onSubmit = (data: any) => {
    mutate(data);
  };
  return (
    <section className="flex flex-col space-y-4">
      <header className="border-b mb-10 pb-4">
        <h1 className="text-2xl font-bold">Add Blog</h1>
        <p className="text-sm text-gray-500">
          Add a new product to your store.
        </p>
      </header>
      <BlogForm isPending={isPending} onSubmit={onSubmit} />
    </section>
  );
};

export default AddBlogForm;
