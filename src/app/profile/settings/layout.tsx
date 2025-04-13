import { SidebarProvider } from "@/components/ui/sidebar";
import { SideHeader } from "@/components/arena/side-header";
import Navigation from "@/app/ui/widgets/Navigation";

export default async function SettingsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <SidebarProvider className="flex flex-col">
        <SideHeader>
          <Navigation />
        </SideHeader>
        <div className="flex flex-1">{children}</div>
      </SidebarProvider>
    </div>
  );
}
