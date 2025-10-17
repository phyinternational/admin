"use client";

import * as React from "react";
import z from "zod";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import FormInput from "@/components/form/FormInput";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import FormProvider from "@/components/form/FormProvider";
import { useAuthLogin } from "@/lib/react-query/auth-query";

interface Props extends React.HTMLAttributes<HTMLDivElement> {}

const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const defaultValues = {
  email: "admin@example.com",
  password: "admin123",
};
type FormValues = z.infer<typeof signUpSchema>;
export function UserLoginForm({ className, ...props }: Props) {
  const form = useForm<FormValues>({
    defaultValues,
    resolver: zodResolver(signUpSchema),
  });

  const { mutate, isPending } = useAuthLogin();

  const onSubmit = (values: FormValues) => {
    mutate(values);
  };
  return (
    <div className={cn("grid w-full gap-6", className)} {...props}>
      <h2 className="text-3xl  font-bold">Log in for an Account</h2>
      <FormProvider methods={form} onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid gap-4">
          <div className="space-y-3 gap-1">
            <FormInput
              control={form.control}
              name="email"
              id="email"
              label="Email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoCorrect="off"
              disabled={isPending}
            />
            <FormInput
              control={form.control}
              name="password"
              id="password"
              label="Password"
              placeholder="********"
              type="password"
              disabled={isPending}
            />
          </div>
          <Button disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sign In with Email
          </Button>
        </div>
      </FormProvider>
    </div>
  );
}
