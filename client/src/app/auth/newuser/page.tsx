"use client";
import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import * as z from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { newUser } from "@/actions/newuser";
import { useRouter } from "next/navigation";
import isNewUser from "@/components/isNewUser";

const NewUserValidator = z.object({
  username: z
    .string()
    .min(5, "Username must be at least 5 characters")
    .max(20, "Username must be less than 21 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores"
    ),
  role: z.enum(["Viewer", "Poster"], {
    errorMap: () => ({ message: "Please select a valid role" }),
  }),
});

type TNewUserCredentialValidator = z.infer<typeof NewUserValidator>;

const ErrorMessage: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <p className="text-xs text-red-600">{children}</p>;

function NewUserPage() {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TNewUserCredentialValidator>({
    resolver: zodResolver(NewUserValidator),
  });
  const router = useRouter();

  const onSubmit = async (data: TNewUserCredentialValidator) => {
    console.log(data);
    try {
      const result = await newUser(data);
      if (result.success) {
        router.push("/dashboard");
      } else {
        console.error(result.error || "New user creation failed");
      }
    } catch (error) {
      console.error("New user error:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh]">
      <Card className="mx-auto max-w-sm gap-2 -mt-20">
        <CardHeader>
          <CardTitle>Update Account Info</CardTitle>
          <CardDescription>
            Enter your username and role below to update your account.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">
                Username <span className="text-red-500">*</span>
              </Label>
              <Input
                id="username"
                placeholder="gavinbelson"
                {...register("username")}
              />
              {errors.username && (
                <ErrorMessage>{errors.username.message}</ErrorMessage>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">
                Role <span className="text-red-500">*</span>
              </Label>
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Viewer">Viewer</SelectItem>
                      <SelectItem value="Poster">Poster</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.role && (
                <ErrorMessage>{errors.role.message}</ErrorMessage>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" type="submit">
              Save
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
export default isNewUser(NewUserPage);