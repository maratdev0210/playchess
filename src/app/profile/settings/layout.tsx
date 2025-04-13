import { AppSidebar } from "@/components/settings/app-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { SideHeader } from "@/components/arena/side-header";
import Navigation from "@/app/ui/widgets/Navigation";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/session";
import getUserData from "@/app/actions/getUserData";

export default async function SettingsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);

  const userData = await getUserData(session?.userId);

  return (
    <div>
      <SidebarProvider className="flex flex-col">
        <SideHeader>
          <Navigation />
        </SideHeader>
        <div className="flex flex-1">
          <AppSidebar username={userData.username} />
          <SidebarInset>{children}</SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}
