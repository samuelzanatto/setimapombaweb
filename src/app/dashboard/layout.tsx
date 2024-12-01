import type { Metadata } from "next";
import "../globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Dashboard do Sistema",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <div className="flex w-screen overflow-hidden">
      <AppSidebar />
      <main className="w-full p-3 space-y-2">
        <SidebarTrigger className="" />
        {children}
      </main>
      </div>
    </SidebarProvider>
  );
}