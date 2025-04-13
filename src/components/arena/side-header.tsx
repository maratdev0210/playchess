"use client";

import { SidebarIcon } from "lucide-react";
import { Separator } from "@radix-ui/react-separator";
import { Button } from "../ui/button";
import { useSidebar } from "../ui/sidebar";
import { ReactNode } from "react";

export function SideHeader({ children }: { children: ReactNode }) {
  const { toggleSidebar } = useSidebar();
  return (
    <header className="flex sticky top-0 z-50 w-full items-center border-b bg-background">
      <div className="flex h-16 w-full items-center gap-2 px-4">
        <Button
          className="h-8 w-8"
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
        >
          <SidebarIcon />
        </Button>
        <Separator orientation="vertical" className="mr-2 h-4" />
        {children}
      </div>
    </header>
  );
}
