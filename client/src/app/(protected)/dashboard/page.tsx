"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import withAuth from "@/components/withAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { User2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import LogoutBtn from "@/components/logout";

function Page() {
  return (
    <div className="flex justify-center mt-24">
      <Card className="w-3/5 max-w-3xl">
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>User Details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex w-full gap-8 py-4 max-md:flex-col">
            <div className="flex flex-1 flex-col items-end max-md:items-center">
              <Avatar className="relative h-48 w-48 max-md:h-36 max-md:w-36">
                <AvatarImage src={""} />
                <AvatarFallback>
                  <User2 className="h-12 w-12" />
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="flex flex-1 flex-col items-start justify-center gap-2 max-md:items-center">
              <p className="text-3xl">Achal Jhawar</p>
              <p className="text-sm text-secondary-foreground"></p>
              <Badge>@achaljhawar</Badge>
              <div className="flex gap-4 mt-4">
                <div className="text-center">
                  <p className="font-bold">1000</p>
                  <p className="text-sm text-secondary-foreground">Followers</p>
                </div>
                <div className="text-center">
                  <p className="font-bold">100</p>
                  <p className="text-sm text-secondary-foreground">Following</p>
                </div>
                <div className="text-center">
                  <p className="font-bold">0</p>
                  <p className="text-sm text-secondary-foreground">Posts</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="items-end justify-between text-xs text-secondary-foreground">
          Max avatar upload size: 1MB
          <LogoutBtn />
        </CardFooter>
      </Card>
    </div>
  );
}
export default withAuth(Page);
