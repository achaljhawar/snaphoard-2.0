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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import styled from "@emotion/styled";
import { useState, useTransition } from "react";
import { eyeClose, eyeOpen } from "@/components/icons";
import { loginUser } from "@/actions/login";
import { useRouter } from "next/navigation";

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

const AuthCredentialsValidator = z.object({
  username: z
    .string()
    .min(5, "Username must be at least 5 characters")
    .max(20, "Username must be less than 21 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores"
    ),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/\d/, "Password must contain at least one number")
    .regex(
      /[!@#$%^&*(),.?":{}|//<>]/,
      "Password must contain at least one special character"
    ),
});

export default function LoginPage() {
  const [type, setType] = useState("password");
  const [Icon, setIcon] = useState(() => eyeClose);
  const [isPending, startTransition] = useTransition();
  const [loginMessage, setLoginMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  type TAuthCredentialValidator = z.infer<typeof AuthCredentialsValidator>;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TAuthCredentialValidator>({
    resolver: zodResolver(AuthCredentialsValidator),
  });

  const onSubmit = async (data: TAuthCredentialValidator) => {
    setIsLoading(true);
    setLoginMessage("");

    try {
      const result = await loginUser(data);
      if (result.success) {
        router.push("/");
      } else {
        setLoginMessage(result.error || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleToggle = () => {
    if (type === "password") {
      setIcon(() => eyeOpen);
      setType("text");
    } else {
      setIcon(() => eyeClose);
      setType("password");
    }
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh]">
      <br />
      <br />
      <Card className="mx-auto max-w-sm gap-2 -mt-20">
        <CardHeader>
          <CardTitle className="text-xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4">
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
                <div className="flex justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="#" className="text-sm underline">
                    Forgot your password?
                  </Link>
                </div>
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
              <Button type="submit" className="w-full">
                Login
              </Button>
              <Button variant="outline" className="w-full" type="button">
                Sign up with 3rd-part service
              </Button>
            </div>
          </form>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/auth/signup" className="underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
