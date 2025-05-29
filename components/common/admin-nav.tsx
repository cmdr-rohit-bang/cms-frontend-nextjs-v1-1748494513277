import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
            <DropdownMenuContent>
              <CardHeader>
                <CardTitle>hello</CardTitle>
                <CardDescription></CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div>
                  <div className="mb-4 grid grid-cols-[25px_1fr] border-b shadow-sm items-start pb-4 last:mb-0">
                    <span className="flex h-2 w-2 translate-y-1 rounded-full " />
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none ">
                        wel come
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {/* {notification.description} */}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={"outline"} size="icon" className="rounded-full ml-2">
                <CircleUser className="h-5 w-5 bg-g" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() =>
                  signOut({
                    redirect: true,
                    callbackUrl: `${window.location.origin}/login`,
                  })
                }
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
