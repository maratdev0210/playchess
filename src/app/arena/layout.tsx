import { AppSidebar } from "@/components/arena/app-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { SideHeader } from "@/components/arena/side-header";
import Navigation from "../ui/widgets/Navigation";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/session";

export default async function ArenaLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);

  return (
    <div>
      <SidebarProvider className="flex flex-col">
        <SideHeader id={session.userId}>
          <Navigation />
        </SideHeader>
        <div className="flex flex-1">
          <AppSidebar id={session.userId} />
          <SidebarInset>{children}</SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}
