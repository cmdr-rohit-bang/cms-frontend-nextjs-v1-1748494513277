import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { Grid3X3 } from "lucide-react";
import { usePathname } from "next/navigation";

const HomeNav = () => {
  const pathname = usePathname();
  const isSignup = pathname.includes("/signup");
  const isAdmin = pathname.includes("/admin");
  const isAdminLogin = pathname.includes("/admin/login");
  const isAdminForgotPassword = pathname.includes("/admin/forgot-password");
  const isAdminResetPassword = pathname.includes("/admin/reset-password");

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Grid3X3 className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">FlexiCMS</span>
        </div>
        {
          isSignup || isAdmin || isAdminLogin || isAdminForgotPassword || isAdminResetPassword ? null : (
              <>
              
              <nav className="hidden md:flex items-center gap-6">
            <Link href="#" className="text-sm font-medium hover:text-primary">
              Home
            </Link>
            <Link
              href="/#features"
              className="text-sm font-medium hover:text-primary"
            >
              Features
            </Link>
            <Link
              href="/#pricing"
              className="text-sm font-medium hover:text-primary"
            >
              Pricing
            </Link>
            <Link
              href="/#about"
              className="text-sm font-medium hover:text-primary"
            >
              About
            </Link>
            <Link
              href="/#contact"
              className="text-sm font-medium hover:text-primary"
            >
              Contact
            </Link>
          </nav>
        <div className="flex items-center gap-2">
          <Link href="/login">
            <Button variant="outline" size="sm" className="hidden sm:flex">
              Login
            </Button>
          </Link>
          <Link href="/signup">
            <Button size="sm" className="hidden sm:flex">
              Get Started
            </Button>
          </Link>
          <Button variant="ghost" size="icon" className="md:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          </Button>
        </div>
        </>
          )
        }
         
      </div>
    </header>
  );
};

export default HomeNav;
