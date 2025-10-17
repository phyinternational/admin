import { useAddBanner } from "@/lib/react-query/banner-query"; // Assuming you have this hook defined
import BannerForm from "./banner-form"; // Assuming you have a BannerForm component defined

const AddBannerForm = () => {
  const { mutate, isPending } = useAddBanner();
  
  const onSubmit = (data: any) => {
    mutate(data);
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
