"use client";
import React, { useState } from "react";
import { Button } from "../../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, LogOut } from "lucide-react";
import OtpModalLogin from "../../models/otp-modal-login";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const TicketMenuBar = () => {
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const pathName = usePathname()
 
  const session  = useSession();
      const router = useRouter();
   const handleLogout = () => {
  
   
    router.push('/ticket/new');
    window.location.reload();
  };
  return (
    <>
      <nav className="flex items-center justify-between bg-white p-4 shadow-md">
        <ul className="flex space-x-4">
          <li>
            {session ? (
              <Button>
                <Link href={pathName == "/ticket/new" ? "/ticket/my-tickets" : "/ticket/new"}> {pathName == "/ticket/new" ? "My Tickets" : "New Ticket"}</Link>
              </Button>
            ) : (
              <Button onClick={() => setIsOtpModalOpen(true)}>
                My Tickets
              </Button>
            )}
          </li>
        </ul>
        {session && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 gap-1 pl-1 pr-2">
                <span className="hidden text-sm font-normal md:inline-block">
                  {session?.data?.user.name}
                </span>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuItem   onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </nav>
      <OtpModalLogin
        setIsOtpModalOpen={setIsOtpModalOpen}
        isOtpModalOpen={isOtpModalOpen}
      />
    </>
  );
};

export default TicketMenuBar;
