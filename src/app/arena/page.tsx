import Search from "../ui/widgets/Search";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/session";

export default async function Page() {
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);

  return (
    <>
      <Search id={session.userId} />
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <div className="aspect-video rounded-xl bg-muted/50" />
          <div className="aspect-video rounded-xl bg-muted/50" />
          <div className="aspect-video rounded-xl bg-muted/50" />
        </div>
        <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
      </div>
    </>
  );
}
