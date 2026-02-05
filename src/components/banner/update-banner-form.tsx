import { useGetBanner, useUpdateBanner } from "@/lib/react-query/banner-query"; // Assuming you have these hooks defined
import { useParams, useNavigate } from "react-router-dom";
import LoadingScreen from "../common/loading-screen";
import BannerForm from "./banner-form"; // Assuming you have a BannerForm component defined
import { useMemo } from "react";

const UpdateBannerForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: bannerData, isLoading } = useGetBanner(id ?? "");
  const { mutate, isPending } = useUpdateBanner();

  const onSubmit = (data: any) => {
    let payload = { ...data, _id: id };
    
    if (data.images && data.images.length > 0) {
      const formData = new FormData();
      formData.append("_id", id ?? "");
      formData.append("title", data.title);
      formData.append("content", data.content);
      formData.append("isActive", String(data.isActive ?? true));
      formData.append("position", String(data.position ?? 0));
      if (data.meaning) formData.append("meaning", data.meaning);
      data.bannerImages.forEach((img: string) => formData.append("bannerImages", img));
      data.images.forEach((file: File) => formData.append("images", file));
      payload = formData as any;
    }

    mutate(payload, {
      onSuccess: () => {
        setTimeout(() => navigate("/dashboard/banners/list"), 600);
      }
    });
  };

  const defaultValues: any = useMemo(() => {
    if (!bannerData) return null;

    const banner = bannerData.data.data.banner;
    return {
      title: banner.title,
      content: banner.content,
      meaning: banner.meaning,
      isActive: banner.isActive,
      position: banner.position,
      bannerImages: banner.bannerImages,
    };
  }, [bannerData]);

  if (isLoading && !defaultValues) return <LoadingScreen />;

  if (!defaultValues) return null;
  
  return (
    <section className="flex flex-col space-y-4">
      <header className="border-b mb-10 pb-4">
        <h1 className="text-2xl font-bold">Update Banner</h1>
        <p className="text-sm text-gray-500">
          Update an existing banner in your store.
        </p>
      </header>
      <BannerForm
        isPending={isPending}
        defaultValues={defaultValues}
        onSubmit={onSubmit}
      />
    </section>
  );
};

export default UpdateBannerForm;
