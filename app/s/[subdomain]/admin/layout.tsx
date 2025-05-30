"use client";
import React, { Suspense, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import Sidebar from "@/components/common/sidebar";
import AdminNav from "@/components/common/admin-nav";
import { useSession } from "next-auth/react";

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [expanded, setExpanded] = useState(true);
  const session = useSession();
  const role = session?.data?.user?.role || "owner";
  return (
    <div className="flex justify-between min-h-screen w-full bg-muted/40 relative bg-white">
      <div
        className={` flex flex-col h-screen bg-sidebar ${
          expanded ? "w-[15%]" : "w-[5%]"
        }`}
      >
        <Sidebar expanded={expanded} role={role} />
      </div>
      <div
        className={`h-full flex flex-col bg-sidebar ${
          expanded ? "w-[85%]" : "w-[95%]"
        }`}
      >
        <div className="z-30 px-0 pb-20">
          <AdminNav expanded={expanded} setExpanded={setExpanded} />
        </div>

        <div>
          <Suspense
            fallback={
              <div className="h-[100vh] w-full flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2550a5]"></div>
              </div>
            }
          >
            {children}
          </Suspense>
        </div>
        <Toaster />
      </div>
    </div>
  );
}
