"use client"

import Image from "next/image";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const menuItems = [
    { title: "Inicio", href: "#" },
    { title: "Fotos", href: "#" },
    { title: "Nosso Ministério", href: "#" },
    { title: "Sobre Nós", href: "#" },
  ];

  return (
    <header className="fixed z-50 flex items-center justify-between w-full px-4 md:px-8 lg:px-36 h-20 lg:h-28 bg-transparent">
        <Link href="/">
          <Image src="/logo.png" width={70} height={70} alt="Logo" className="w-14 h-14 lg:w-[70px] lg:h-[70px]" />
        </Link>

        {/* Menu Desktop */}
        <nav className="hidden md:flex items-center">
            <ul className="flex gap-6 lg:gap-10 text-white text-sm lg:text-base">
              {menuItems.map((item, index) => (
                <motion.li
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link href={item.href} className="hover:font-bold duration-300">
                    {item.title}
                  </Link>
                </motion.li>
              ))}
            </ul>
        </nav>

        {/* Menu Mobile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="text-white">
              <Menu className="h-6 w-6" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-96 mr-4 mt-4 bg-neutral-900 border-none rounded-xl">
            {menuItems.map((item, index) => (
              <DropdownMenuItem
                key={index}
                className="flex items-center justify-center rounded-xl py-4 text-white hover:bg-white/10 cursor-pointer"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link href={item.href}>{item.title}</Link>
                </motion.div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
    </header>
  )
}