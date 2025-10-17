import { useFormContext, Controller } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

// ----------------------------------------------------------------------

interface Props {
  name: string;
  helperText?: string;
  label?: string;
}

export default function FormImageInput({ name, helperText, label }: Props) {
  const url = useFormContext().watch(name);
  const fileInput = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState(url);
  const { control, setValue, getValues } = useFormContext();

  useEffect(() => {
    setPreview(url);
  }, [url]);
  // On file select, store the File object in form state under 'images' and show preview
  const onUpload = () => {
    if (!fileInput.current) return;
    const files = fileInput.current.files;
    if (!files || files.length === 0) return;

    const file = files[0];

    // Create preview URL
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(String(reader.result || ''));
      // Set productImageUrl to preview (optional) and store file in images field
      setValue(name, String(reader.result || ''));
      // Store file list under images key so product form can append files to FormData
      const existing = getValues('images') || [];
      setValue('images', [...existing, file]);
    };
    reader.readAsDataURL(file);
  };
  return (
    <Controller
      name={name}
      control={control}
      render={({ fieldState: { error } }) => (
        <div>
          <Label className="mb-1 block font-medium">{label}</Label>
          <div className=" block font-medium  rounded-md">
            <Input
              type="file"
              ref={fileInput}
              className="pt-2"
              onChange={onUpload}
            />
            {error && (
              <p className="text-xs text-red-500 mt-1">{error.message}</p>
            )}
            {helperText && (
              <p className="text-xs text-gray-500 mt-1">{helperText}</p>
            )}
            {preview && (
              <img
                className="mt-4 h-24 w-24 rounded-sm border object-cover"
                src={preview}
              />
            )}
          </div>
        </div>
      )}
    />
  );
}
