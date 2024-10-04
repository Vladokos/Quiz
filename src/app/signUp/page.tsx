"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

import { Github } from "lucide-react";

import { useForm, SubmitHandler } from "react-hook-form";

interface IForm {
  login: string;
  email: string;
  password: string;
}

export default function signin() {
  const router = useRouter();

  const { register, handleSubmit } = useForm<IForm>();

  const onSubmit: SubmitHandler<IForm> = async (data) => {
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          login: data.login,
          email: data.email,
          password: data.password,
        }),
      });

      response.status === 201 && router.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form
      className="max-[1440px] my-0 mx-auto px-3 h-screen flex items-center justify-center"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Sign Up</CardTitle>
          <CardDescription>
            Enter your data below to create your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              {...register("email", { required: true })}
              placeholder="m@example.com"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Login</Label>
            <Input {...register("login", { required: true })} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              {...register("password", { required: true })}
              type="password"
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col">
          <Button type="submit" className="w-full">
            Sign Up
          </Button>
          <div className="flex items-center justify-center w-[40%] mt-4 mb-2">
            <Separator />
            <span className="mx-2 text-[#737373]">or</span>
            <Separator />
          </div>
          <div>
            <Button className="w-full">
              Sign in wih GitHub <Github className="ml-3" />
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Already have an account?
            <Link href="/signIn" className="underline">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </form>
  );
}
