"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, UserSearch, Grid3X3, Ticket, Settings, MessageCircle } from "lucide-react";
import { useSession } from "next-auth/react";

interface SideMenuData {
  icon: React.ReactElement;
  hrefLink: string;
  name: string;
}

const Sidebar = ({ expanded, role }: { expanded: boolean, role: string   }) => {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const firstSegment = segments[0];
  const secondSegment = segments[1];
  const finalSegment = `/${firstSegment}/${secondSegment}`;
  const session = useSession();

  const SideBarListData: (SideMenuData | null)[] = [
    {
      icon: <LayoutDashboard size={expanded ? 16 : 24} />,
      hrefLink: "/admin/dashboard",
      name: "Dashboard",
    },
    role === "super_admin" ? {
      icon: <Users size={expanded ? 16 : 24} />,
      hrefLink: "/admin/tenants",
      name: "Tenants",
    } : null,
    role === "owner" ? {
      icon: <Users size={expanded ? 16 : 24} />,
      hrefLink: "/admin/users",
      name: "Users",
    } : null,
    role === "owner" ?   {
      icon: <UserSearch size={expanded ? 16 : 24} />,
      hrefLink: "/admin/contacts",
      name: "Contacts",
    } : null,
    role === "owner" ? {
      icon: <Ticket size={expanded ? 16 : 24} />,
      hrefLink: "/admin/tickets",
      name: "Tickets",
    } : null,
     role === "super_admin" ? {
      icon: <Settings size={expanded ? 16 : 24} />,
      hrefLink: "/admin/settings",
      name: "Settings",
    } : null,
    role === "owner" ? {
      icon: <MessageCircle size={expanded ? 16 : 24} />,
      hrefLink: "/admin/whatsapp-message",
      name: "Whatsapp Message",
    } : null,
  ].filter(Boolean);

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-10 hidden transition-all  flex-col border-r min-h-screen overflow-y-auto bg-background sm:flex ${
        expanded ? "w-[15%]" : "w-[5%]"
      }`}
    >
      <nav className="flex flex-col items-start gap-4 px-2 sm:py-5 w-fit mx-auto">
        <Link
          href="/"
          className={`flex h-9 w-9 text-[28px] items-center justify-start rounded-lg hover:text-foreground md:h-8 md:w-full px-3 font-bold mb-[37px]`}
        >
          <span className={`${expanded ? "block" : "hidden mb-4"} w-[140px] h-[63px]`}>
          <div className="flex items-center gap-2 mt-5">
          <Grid3X3 className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">FlexiCMS</span>
        </div>
          </span>
          <span className={`${expanded ? "hidden" : "block mb-4"}`}>
          <Grid3X3 className="h-6 w-6 text-primary" />
          
          </span>
        </Link>

        {SideBarListData.map((v, ind) => (
          <div
            key={ind}
            className={`flex items-center px-3 py-1 w-full rounded ${
              finalSegment === v?.hrefLink
                ? "bg-primary text-white"
                : "hover:bg-gray-200  "
            }`}
          >
            <Link
              href={v?.hrefLink || ""}
              className={`flex  w-full gap-2 select-none items-center ${expanded ? 'justify-start':'justify-center py-2'}` }
            >
              {
                v?.icon
              }
              <span className={`font-normal ${expanded ? "block" : "hidden"}`}>
                {v?.name}
              </span>
            </Link>
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
