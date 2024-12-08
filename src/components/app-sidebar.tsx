"use client"

import * as React from "react"
import {
  Globe,
  LifeBuoy,
  Send,
  SquareTerminal,
  LayoutDashboard,
  BookMarked,
  Calendar,
  Music,
  BookOpenText,
  MicVocal,
  MessageCircle,
  Ticket
} from "lucide-react"

import Logo from "../../public/logo.png"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Image from "next/image"
import { useAuth } from "@/hooks/useAuth"

const data = {
  navMain: [
    {
      title: "Ao Vivo",
      url: "/dashboard",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "Cultos",
      url: "/dashboard/cultos",
      icon: Calendar,
      isActive: true,
    },
    {
      title: "Reuniões",
      url: "/dashboard/reunioes",
      icon: MessageCircle,
      isActive: true,
    },
    {
      title: "Ensaios",
      url: "/dashboard/ensaios",
      icon: MicVocal,
      isActive: true,
    },
    {
      title: "Eventos",
      url: "/dashboard/eventos",
      icon: Ticket,
      isActive: true,
    },
    {
      title: "Biblia",
      url: "/dashboard/biblia",
      icon: BookMarked,
      isActive: true,
    },
    {
      title: "Mensagens",
      url: "/dashboard/mensagens",
      icon: BookOpenText,
      isActive: true,
    },
    {
      title: "Hinos",
      url: "/dashboard/hinos",
      icon: Music,
      isActive: true,
    },
    {
      title: "Administrativo",
      url: "/dashboard/administrativo",
      icon: SquareTerminal,
      isActive: true,
    }
  ],
  navSecondary: [
    {
      title: "Site",
      url: "/",
      icon: Globe,
    },
    {
      title: "Suporte",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
  ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth()
  
  const userData = {
    name: user?.name || user?.username || 'Usuário',
    email: user?.email || user?.username || 'default@example.com',
    avatar: '/avatars/default.jpg' // Caminho para avatar padrão
  }

  return (
    <Sidebar variant="inset" {...props} className="border-r-2">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex size-8 items-center justify-center text-sidebar-primary-foreground">
                  <Image src={Logo} width={100} height={100} alt="Logo" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Ministério</span>
                  <span className="truncate text-xs">A Sétima Pomba</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  )
}
