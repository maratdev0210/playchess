import { cookies } from "next/headers";
import { decrypt } from "@/lib/session";
import getUserData from "@/app/actions/getUserData";
import SettingsWrapper from "@/app/ui/profile/settings/SettingsWrapper";

export default async function Page() {
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);

  const userData = await getUserData(session?.userId);
  return (
    <>
      <SettingsWrapper username={userData.username} id={userData.id} />
    </>
  );
}
