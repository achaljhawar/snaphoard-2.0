"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AuthCredentialsValidator } from "@/schema/signupmodels";
import styled from "@emotion/styled";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast, Toaster } from "react-hot-toast";
import { eyeClose, eyeOpen } from "@/components/icons";

const ErrorMessage = styled.p`
  font-size: 0.75rem;
  color: #dc2626;
`;

const PasswordInputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const PasswordInput = styled(Input)`
  padding-right: 2.5rem; /* Make room for the icon */
`;

const IconWrapper = styled.button`
  position: absolute;
  right: 0.5rem;
  background: none;
  border: none;
  display: flex;
  align-items: center;
  cursor: pointer;
  svg {
    width: 1rem;
    height: 1rem;
  }
`;

export default function LoginPage() {
  const [type, setType] = useState("password");
  const [Icon, setIcon] = useState(() => eyeClose);

  type TAuthCredentialValidator = z.infer<typeof AuthCredentialsValidator>;

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TAuthCredentialValidator>({
    resolver: zodResolver(AuthCredentialsValidator),
  });

  const handleToggle = () => {
    if (type === "password") {
      setIcon(() => eyeOpen);
      setType("text");
    } else {
      setIcon(() => eyeClose);
      setType("password");
    }
  };

  const onSubmit = async (data: TAuthCredentialValidator) => {
    try {
      if (data) {
        console.log("Form submitted successfully:", data);
        const response = await fetch("http://localhost:7000/api/auth/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        if (!response.ok) {
          throw new Error("Error submitting form");
        } else {
          const { verification_code } = await response.json();
          console.log("Verification code:", verification_code);
        }
        toast.success(
          "Form submitted successfully. Check your email to verify your account."
        );
      } else {
        toast.error("Error submitting form. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("An unexpected error occurred. Please try again later.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh]">
      <br />
      <br />
      <br />
      <br />
      <Toaster position="top-center" reverseOrder={false} />
      <Card className="mx-auto max-w-sm gap-2 -mt-20">
        <CardHeader>
          <CardTitle className="text-xl">Sign Up</CardTitle>
          <CardDescription>
            Enter your information to create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="firstName">First name</Label>
                  <Input
                    id="firstName"
                    placeholder="Gavin"
                    {...register("firstName")}
                  />
                  {errors.firstName && (
                    <ErrorMessage>{errors.firstName.message}</ErrorMessage>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="lastName">Last name</Label>
                  <Input
                    id="lastName"
                    placeholder="Belson"
                    {...register("lastName")}
                  />
                  {errors.lastName && (
                    <ErrorMessage>{errors.lastName.message}</ErrorMessage>
                  )}
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="gavinbelson"
                  {...register("username")}
                />
                {errors.username && (
                  <ErrorMessage>{errors.username.message}</ErrorMessage>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="gavin@hooli.com"
                  {...register("email")}
                />
                {errors.email && (
                  <ErrorMessage>{errors.email.message}</ErrorMessage>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <PasswordInputWrapper>
                  <PasswordInput
                    id="password"
                    type={type}
                    placeholder="piedpipersucks"
                    {...register("password")}
                  />
                  <IconWrapper type="button" onClick={handleToggle}>
                    <Icon />
                  </IconWrapper>
                </PasswordInputWrapper>
                {errors.password && (
                  <ErrorMessage>{errors.password.message}</ErrorMessage>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="piedpipersucks"
                  {...register("confirmPassword")}
                />
                {errors.confirmPassword && (
                  <ErrorMessage>{errors.confirmPassword.message}</ErrorMessage>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role">Role</Label>
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
              <Button type="submit" className="w-full">
                Create an account
              </Button>
              <Button variant="outline" className="w-full" type="button">
                Sign up with 3rd-part service
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link href="/auth/signin" className="underline">
                Sign in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
