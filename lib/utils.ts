import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

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



// utils/auth.ts
import { signOut } from "next-auth/react";

export const handleLogout = async () => {
  // Get current URL information
  const currentHost = window.location.host;
  const hostParts = currentHost.split('.');
  
  // Determine redirect URL based on current location
  let redirectUrl: string;
  
  // Check if current host is a subdomain (but not www)
  if (hostParts.length >= 2 && hostParts[0] !== 'www' && hostParts[0] !== 'localhost') {
    // This is a subdomain - redirect to subdomain root
    redirectUrl = `${window.location.protocol}//${currentHost}/`;
  } else {
    // This is main domain - redirect to main domain root  
    redirectUrl = `${window.location.protocol}//${currentHost}/`;
  }
  
  console.log("Logout redirect URL:", redirectUrl);
  
  // Sign out with custom redirect - use redirect: false to handle manually
  await signOut({
    callbackUrl: redirectUrl,
    redirect: false
  }).then(() => {
    // Manually redirect to avoid NextAuth's default behavior
    window.location.href = redirectUrl;
  });
};

// Alternative: More explicit version that handles the routing logic
export const handleLogoutWithContext = async () => {
  const currentUrl = window.location.href;
  const url = new URL(currentUrl);
  
  // Determine the appropriate redirect URL
  const redirectUrl = getLogoutRedirectUrl(url);
  
  await signOut({
    callbackUrl: redirectUrl,
    redirect: true
  });
};

function getLogoutRedirectUrl(url: URL): string {
  const host = url.host;
  const hostParts = host.split('.');
  
  // Check if it's a subdomain (but not www)
  if (hostParts.length >= 2 && hostParts[0] !== 'www') {
    // Subdomain: redirect to subdomain root
    return `${url.protocol}//${host}/`;
  } else {
    // Main domain: redirect to main domain root
    return `${url.protocol}//${host}/`;
  }
}