"use client"

import withAuth from "@/components/withAuth";
import React from "react";

function Page() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      hello
    </div>
  );
}
export default withAuth(Page);