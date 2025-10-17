import { useGetBanner, useUpdateBanner } from "@/lib/react-query/banner-query"; // Assuming you have these hooks defined
import { useParams } from "react-router";
import LoadingScreen from "../common/loading-screen";
import BannerForm from "./banner-form"; // Assuming you have a BannerForm component defined
import { useMemo } from "react";

const UpdateBannerForm = () => {
  const { id } = useParams();
  const { data: bannerData, isLoading } = useGetBanner(id ?? "");
  const { mutate, isPending } = useUpdateBanner();

  const onSubmit = (data: any) => {
    mutate({ ...data, _id: id });
  };

  const defaultValues: any = useMemo(() => {
    if (!bannerData) return null;

    const banner = bannerData.data.data.banner;
    return {
      title: banner.title,
      content: banner.content,
      bannerImages: banner.bannerImages,
    };
  }, [bannerData]);

  console.log(defaultValues);

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
