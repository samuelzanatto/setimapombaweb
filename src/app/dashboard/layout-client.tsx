'use client'

import "../globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Toaster } from "@/components/ui/toaster";
import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useWebSocket } from "@/hooks/useWebSocket";

export default function DashboardLayoutClient({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, checkAuth, isAuthenticated } = useAuth();
  
  useEffect(() => {
    console.log('[Layout] Iniciando checkAuth...');
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    console.log('[Layout] Status de autenticação:', isAuthenticated);
    console.log('[Layout] Dados do usuário:', user);
  }, [isAuthenticated, user]);

  useWebSocket(user);

  return (
    <SidebarProvider>
      <div className="flex w-screen overflow-hidden">
      <AppSidebar />
      <main className="w-full p-3 space-y-2">
        <SidebarTrigger className="" />
        {children}
      </main>
      <Toaster />
      </div>
    </SidebarProvider>
  );
}