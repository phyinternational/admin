import { z } from "zod";
import FormProvider from "../form/FormProvider";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "../form/FormInput";
import FormTextArea from "../form/FormTextArea";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import FormImageUploader from "../form/FormMultipleImages";

const bannerSchema = z.object({
  title: z.string(),
  content: z.string(),
  bannerImages: z.array(z.string().url()),
});

export type BannerType = z.infer<typeof bannerSchema>;

type Props = {
  onSubmit: (data: any) => void;
  defaultValues?: BannerType;
  isPending: boolean;
};

const BannerForm = ({ onSubmit, defaultValues, isPending }: Props) => {
  const form = useForm<BannerType>({
    resolver: zodResolver(bannerSchema),
    defaultValues: defaultValues,
  });

  return (
    <main className="max-w-lg bg-white p-4 rounded-md mt-20">
      <FormProvider
        className="space-y-4"
        methods={form}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <h2 className="font-semibold text-gray-800 text-xl mb-4">Banner Form</h2>

        <FormInput
          control={form.control}
          name="title"
          placeholder="Enter Banner Title"
          label="Banner Title"
        />
        <FormImageUploader
          control={form.control}
          name="bannerImages"
          label="Banner Images"
         /> 

        <FormTextArea
          control={form.control}
          name="content"
          placeholder="Enter Banner Content"
          label="Banner Content"
        />

        <Button className="w-full mt-4" type="submit" disabled={isPending}>
          {isPending && <Loader2 className="animate-spin" size="sm" />}
          {isPending ? "Submitting..." : "Submit"}
        </Button>
      </FormProvider>
    </main>
  );
};

export default BannerForm;
