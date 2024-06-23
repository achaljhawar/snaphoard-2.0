"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Pacifico, Permanent_Marker } from "next/font/google";
const marker = Permanent_Marker({
  weight: "400",
  subsets: ["latin"],
});
const pacifico = Pacifico({
  weight: "400",
  subsets: ["latin"],
});
import { BrushIcon, ShareIcon, InfoIcon } from "@/components/icons";

export default function Home() {
  return (
    <div className="flex flex-col min-h-[100dvh]">
      <main className="flex-1">
        <section className="w-full pt-12 md:pt-24 lg:pt-32">
          <div className="container grid gap-6 px-4 md:px-6 lg:grid-cols-2 lg:gap-12">
            <img
              src="/hero.png"
              width={400}
              height={400}
              alt="hero"
              className="mx-auto aspect-square overflow-hidden rounded-xl object-cover sm:w-full shadow-lg"
            />
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-5">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-gray-900 dark:text-gray-50 text-center">
                  <span className={pacifico.className}>
                    Discover and Share Snaps{" "}
                  </span>
                </h1>
                <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400 text-center">
                  Unleash your creativity and connect with others who share your
                  passion for nature, architecture, and art. Upload your snaps
                  and start exploring!
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center items-center">
                  <Link
                    href="/auth/signup"
                    className="inline-flex h-10 items-center justify-center rounded-md bg-gray-900 px-8 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
                    prefetch={false}
                  >
                    Get Started
                  </Link>
                  <Link
                    href="#"
                    className="inline-flex h-10 items-center justify-center rounded-md border border-gray-200 bg-white px-8 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300"
                    prefetch={false}
                  >
                    Download
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
        <br></br>
        <br></br>
        <div className="h-6 bg-gray-100 dark:bg-gray-800" />
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6 justify-center text-center">
            <div className="flex flex-col items-center space-y-4 ">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-gray-200 px-3 py-1 text-sm dark:bg-gray-600">
                  Key Features
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Unleash Your Creativity
                </h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Our app makes it easy to create and share stunning posters.
                  Discover a vibrant community of artists and designers, and get
                  inspired.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="grid gap-1">
                <div className="flex items-center gap-2">
                  <BrushIcon className="h-6 w-6" />
                  <h3 className="text-xl font-bold">Easy Poster Creation</h3>
                </div>
                <p className="text-gray-500 dark:text-gray-400">
                  Our intuitive design tools make it simple to create
                  eye-catching posters.
                </p>
              </div>
              <div className="grid gap-1">
                <div className="flex items-center gap-2">
                  <ShareIcon className="h-6 w-6" />
                  <h3 className="text-xl font-bold">Seamless Sharing</h3>
                </div>
                <p className="text-gray-500 dark:text-gray-400">
                  Share your creations with the world and connect with a
                  community of artists.
                </p>
              </div>
              <div className="grid gap-1">
                <div className="flex items-center gap-2">
                  <InfoIcon className="h-6 w-6" />
                  <h3 className="text-xl font-bold">Discover Inspiration</h3>
                </div>
                <p className="text-gray-500 dark:text-gray-400">
                  Explore a vast collection of user-generated posters and get
                  inspired.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm dark:bg-gray-800">
                  Featured Posters
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Discover Inspiring Posters
                </h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Browse our gallery of user-generated posters and find your
                  next creative inspiration.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <img
                src="/landingposter-1.jpeg"
                width="300"
                height="300"
                alt="Poster"
                className="mx-auto aspect-square overflow-hidden rounded-xl object-cover"
              />
              <img
                src="/landingposter-2.jpeg"
                width="300"
                height="300"
                alt="Poster"
                className="mx-auto aspect-square overflow-hidden rounded-xl object-cover"
              />
              <img
                src="/landingposter-3.jpeg"
                width="300"
                height="300"
                alt="Poster"
                className="mx-auto aspect-square overflow-hidden rounded-xl object-cover"
              />
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container grid items-center gap-4 px-4 md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                Join Our Vibrant Community
              </h2>
              <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Sign up today and start creating, sharing, and discovering
                amazing posters.
              </p>
            </div>
            <div className="mx-auto w-full max-w-sm space-y-2">
              <form className="flex space-x-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="max-w-lg flex-1 text-white dark:bg-gray-900"
                />
                <Button type="submit">Sign Up</Button>
              </form>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                By signing up, you agree to our{" "}
                <Link
                  href="#"
                  className="underline underline-offset-2"
                  prefetch={false}
                >
                  Terms of Service
                </Link>
                .
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
