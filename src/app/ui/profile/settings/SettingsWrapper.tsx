// Client-side component used for bypassing the server-side errors

"use client";

import SidebarWrapper from "./SidebarWrapper";
import { SidebarInset } from "@/components/ui/sidebar";
import { useState } from "react";

interface ISettingsWrapper {
  username: string;
  id: number;
}

export default function SettingsWrapper({ username, id }: ISettingsWrapper) {
  const [settingsInterface, setSettingsInterface] = useState<number>(0);

  return (
    <>
      <SidebarWrapper username={username} setSettingsInterface={setSettingsInterface}/>
      <SidebarInset>
        <div>some data</div>
      </SidebarInset>
    </>
  );
}
