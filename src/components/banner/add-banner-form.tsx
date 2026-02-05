import { useAddBanner } from "@/lib/react-query/banner-query"; // Assuming you have this hook defined
import BannerForm from "./banner-form"; // Assuming you have a BannerForm component defined
import { useNavigate } from "react-router-dom";

const AddBannerForm = () => {
  const { mutate, isPending } = useAddBanner();
  const navigate = useNavigate();

  const onSubmit = (data: any) => {
    let payload = data;
    
    if (data.images && data.images.length > 0) {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("content", data.content);
      formData.append("isActive", String(data.isActive ?? true));
      formData.append("position", String(data.position ?? 0));
      if (data.meaning) formData.append("meaning", data.meaning);
      data.bannerImages.forEach((img: string) => formData.append("bannerImages", img));
      data.images.forEach((file: File) => formData.append("images", file));
      payload = formData;
    }
    
    mutate(payload, {
      onSuccess: () => {
        setTimeout(() => navigate("/dashboard/banners/list"), 600);
      }
    });
  };
  
  return (
    <section className="flex flex-col space-y-4">
      <header className="border-b mb-10 pb-4">
        <h1 className="text-2xl font-bold">Add Banner</h1>
        <p className="text-sm text-gray-500">
          Add a new banner to your store.
        </p>
      </header>
      <BannerForm isPending={isPending} onSubmit={onSubmit} />
    </section>
  );
};

export default AddBannerForm;
