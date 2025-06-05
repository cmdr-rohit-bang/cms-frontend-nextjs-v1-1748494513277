
import TicketMenuBar from "@/components/common/ticket-menu-bar";
import type React from "react";



export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TicketMenuBar />
      {children}
    </>
  );
}
