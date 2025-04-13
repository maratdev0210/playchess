// client-side sidebar wrapper used for bypassing the server-side errors

"use client";

import { AppSidebar } from "@/components/settings/app-sidebar";

interface ISidebarWrapper {
  username: string;
  setSettingsInterface: React.Dispatch<React.SetStateAction<number>>;
}

export default function SidebarWrapper({
  username,
  setSettingsInterface,
}: ISidebarWrapper) {
  return (
    <AppSidebar
      username={username}
      setSettingsInterface={setSettingsInterface}
    />
  );
}
