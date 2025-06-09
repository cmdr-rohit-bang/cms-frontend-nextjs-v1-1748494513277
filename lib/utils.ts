import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { signOut } from "next-auth/react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}



export const formatDate = (dateInput: string | Date) => {
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
  }).format(date);
};


// Add this to your existing utils file
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const handleLogout = async () => {
  // Get current URL information
  const currentHost = window.location.host;
  const hostParts = currentHost.split('.');
  const currentPath = window.location.pathname;
  const currentSearch = window.location.search;
  
  // Determine redirect URL based on current location
  let redirectUrl: string;
  let callbackUrl: string;
  
  // Encode the current path and search params as callback URL
  callbackUrl = encodeURIComponent(`${currentPath}${currentSearch}`);
  
  // Check if current host is a subdomain (but not www)
  if (hostParts.length >= 2 && hostParts[0] !== 'www' && hostParts[0] !== 'localhost') {
    // This is a subdomain - redirect to subdomain root with callback
    redirectUrl = `${window.location.protocol}//${currentHost}/?callbackUrl=${callbackUrl}`;
  } else {
    // This is main domain - redirect to login with callback
    redirectUrl = `${window.location.protocol}//${currentHost}/login?callbackUrl=${callbackUrl}`;
  }
  

  
  // Sign out with custom redirect - use redirect: false to handle manually
  await signOut({
    callbackUrl: redirectUrl,
    redirect: false
  }).then(() => {
    // Manually redirect to avoid NextAuth's default behavior
    window.location.href = redirectUrl;
  });
};
