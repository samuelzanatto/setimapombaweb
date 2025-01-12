import type { Metadata } from "next";
import DashboardLayoutClient from "./layout-client";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Dashboard do Sistema",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <DashboardLayoutClient>{children}</DashboardLayoutClient>;
}