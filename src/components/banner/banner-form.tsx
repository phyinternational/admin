import { z } from "zod";
import FormProvider from "../form/FormProvider";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "../form/FormInput";
import FormTextArea from "../form/FormTextArea";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import FormImageUploader from "../form/FormMultipleImages";
import { FormControl, FormField } from "@/components/ui/form";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";

const bannerSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().max(100, "Content must be less than 100 characters").optional().or(z.literal("")),
  meaning: z.string().optional(),
  isActive: z.boolean().optional(),
  bannerImages: z.array(z.string().url()),
  images: z.array(z.any()).optional(),
});

export type BannerType = z.infer<typeof bannerSchema>;

type Props = {
  onSubmit: (data: any) => void;
  defaultValues?: Partial<BannerType>;
  isPending: boolean;
};

const BannerForm = ({ onSubmit, defaultValues, isPending }: Props) => {
  const form = useForm<BannerType>({
    resolver: zodResolver(bannerSchema),
    defaultValues: {
      isActive: true,
      ...defaultValues,
    },
  });

  return (
    <main className="max-w-lg bg-white p-4 rounded-md mt-20">
      <FormProvider
        className="space-y-4"
        methods={form}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h2 className="font-bold text-gray-900 text-2xl tracking-tight">Banner Details</h2>
          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <div className="flex items-center space-x-2 bg-violet-50 px-3 py-1.5 rounded-full border border-violet-100 shadow-sm transition-all hover:bg-violet-100">
                <Label htmlFor="active-mode" className="text-xs font-bold text-violet-700 uppercase cursor-pointer">
                  {field.value ? "Status: Active" : "Status: Inactive"}
                </Label>
                <FormControl>
                  <Switch
                    id="active-mode"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="data-[state=checked]:bg-violet-600"
                  />
                </FormControl>
              </div>
            )}
          />
        </div>

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
          label="Banner Content (Optional, Max 100 chars)"
        />
        <p className={`text-[11px] text-right -mt-3 mb-2 ${(form.watch("content")?.length || 0) > 100 ? 'text-red-500' : 'text-gray-400'}`}>
          {form.watch("content")?.length || 0} / 100 characters
        </p>

        <FormTextArea
          control={form.control}
          name="meaning"
          placeholder="Enter Shlok Meaning/Translation"
          label="Shlok Meaning (Optional)"
        />

        <Button className="w-full mt-4" type="submit" disabled={isPending}>
          {isPending && <Loader2 className="animate-spin" size={16} />}
          {isPending ? "Submitting..." : "Submit"}
        </Button>
      </FormProvider>
    </main>
  );
};

export default BannerForm;
