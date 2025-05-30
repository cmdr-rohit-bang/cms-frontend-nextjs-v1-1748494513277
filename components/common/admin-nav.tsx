import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { CircleUser, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

export default function AdminNav({
  expanded,
  setExpanded,
}: {
  expanded: boolean;
  setExpanded: Function;
}) {

  const getCallbackUrl = () => {
    const currentHost = window.location.host
    return currentHost.includes('.localhost:3001') 
      ? `http://${currentHost}` 
      : 'http://localhost:3001'
  }
  return (
    <>
      <header
        className={`z-30 flex !h-16 bg-background items-center shadow-md gap-4 border-b    sm:px-2 justify-between top-0 fixed ${
          expanded ? " w-[85%]" : "w-[95%]"
        }`}
      >
        <button
          className="relative"
          onClick={() => setExpanded((curr: Boolean) => !curr)}
        >
          <span>
            <Menu />
          </span>
        </button>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant={"outline"}
                size="icon"
                className="rounded-full ml-2"
              >
                <CircleUser className="h-5 w-5 bg-g" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => {
                  signOut({
                    callbackUrl: getCallbackUrl(),
                    redirect: true,
                  });
                }}
              >
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
    </>
  );
}
