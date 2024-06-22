"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  MoonIcon,
  SunIcon,
  CameraIcon,
  HamburgerMenuIcon,
  CloseIcon,
} from "@/components/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePathname } from "next/navigation";
import useDeviceDetection from "@/hooks/useDeviceDetection";
import { Pacifico, Permanent_Marker } from "next/font/google";
const marker = Permanent_Marker({
  weight: "400",
  subsets: ["latin"],
});
const pacifico = Pacifico({
  weight: "400",
  subsets: ["latin"],
});
export default function UnAuthNavbar() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const { setTheme } = useTheme();
  const device = useDeviceDetection();
  console.log(device);
  useEffect(() => {
    setTheme(isDarkMode ? "dark" : "light");
  }, [isDarkMode, setTheme]);

  const handleThemeToggle = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <header className="flex items-center justify-between p-2 sm:p-4 md:px-6 lg:px-8">
      {" "}
      <Link href="/" className="flex items-center" prefetch={false}>
        <CameraIcon
          className={`h-6 w-6 ${isDarkMode ? "text-gray-50" : "text-gray-900"}`}
        />
        <span
          className={cn(
            `ml-2 text-xl font-medium ${
              isDarkMode ? "text-gray-50" : "text-gray-900"
            }`,
            pacifico.className
          )}
        >
          Snaphoard
        </span>
      </Link>
      {device === "Desktop" ? (
        <nav className="flex items-center space-x-2 sm:space-x-4 md:space-x-6">
          {" "}
          <Link
            href="#"
            className={cn(
              `text-sm sm:text-base font-medium transition-colors ${
                isDarkMode
                  ? "text-gray-400 hover:text-gray-50"
                  : "text-gray-700 hover:text-gray-900"
              }`,
              buttonVariants({ variant: "link" })
            )}
            prefetch={false}
          >
            Explore
          </Link>
          <>
            <Link
              href="#"
              className={cn(
                `text-sm sm:text-base font-medium transition-colors ${
                  isDarkMode
                    ? "text-gray-400 hover:text-gray-50"
                    : "text-gray-700 hover:text-gray-900"
                }`,
                buttonVariants({ variant: "link" })
              )}
              prefetch={false}
            >
              Login
            </Link>
            <Link
              href="#"
              className={cn(
                `text-sm sm:text-base font-medium transition-colors ${
                  isDarkMode
                    ? "text-gray-400 hover:text-gray-50"
                    : "text-gray-700 hover:text-gray-900"
                }`,
                buttonVariants({ variant: "link" })
              )}
              prefetch={false}
            >
              Signup
            </Link>
          </>
        </nav>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger
            asChild
            className="flex items-center space-x-4 md:space-x-6 ml-auto"
          >
            <Button variant="ghost" size="icon">
              <HamburgerMenuIcon
                className={`h-6 w-6 ${
                  isDarkMode ? "text-gray-50" : "text-gray-900"
                }`}
              />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <Link
                href="#"
                className={cn(
                  `text-sm sm:text-base font-medium transition-colors ${
                    isDarkMode
                      ? "text-gray-400 hover:text-gray-50"
                      : "text-gray-700 hover:text-gray-900"
                  }`,
                  buttonVariants({ variant: "link" })
                )}
                prefetch={false}
              >
                Explore
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link
                href="#"
                className={cn(
                  `text-sm sm:text-base font-medium transition-colors ${
                    isDarkMode
                      ? "text-gray-400 hover:text-gray-50"
                      : "text-gray-700 hover:text-gray-900"
                  }`,
                  buttonVariants({ variant: "link" })
                )}
                prefetch={false}
              >
                Login
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link
                href="#"
                className={cn(
                  `text-sm sm:text-base font-medium transition-colors ${
                    isDarkMode
                      ? "text-gray-400 hover:text-gray-50"
                      : "text-gray-700 hover:text-gray-900"
                  }`,
                  buttonVariants({ variant: "link" })
                )}
                prefetch={false}
              >
                Signup
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full ml-4"
        onClick={handleThemeToggle}
      >
        {isDarkMode ? (
          <SunIcon className="h-6 w-6 text-gray-50" />
        ) : (
          <MoonIcon className="h-6 w-6 text-gray-900" />
        )}
        <span className="sr-only">Toggle dark mode</span>
      </Button>
    </header>
  );
}
