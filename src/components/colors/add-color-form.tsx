import ColorForm from "./color-form";
import { useAddColor } from "@/lib/react-query/color-query";

const AddColorForm = () => {
  const { mutate, isPending } = useAddColor();
  const onSubmit = (data: any,onSuccess?:()=>void) => {
    mutate({ ...data, hexcode: `${data.hexcode}`},{
      onSuccess: () => {
        onSuccess && onSuccess();
      },
    });
  };
  return (
    <section className="flex flex-col space-y-4">
      <header className="border-b mb-6 pb-4">
        <h1 className="text-2xl font-bold">Add Color</h1>
        <p className="text-sm text-gray-500">
          Add a new product to your store.
        </p>
      </header>
      <ColorForm isPending={isPending} onSubmit={onSubmit} />
    </section>
  );
};

export default AddColorForm;
