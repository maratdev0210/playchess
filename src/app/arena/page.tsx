import Search from "../ui/widgets/Search";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/session";

export default async function Page() {
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);

  return (
    <>
      <div className="px-16">
        <div className="flex justify-end">
          <Search id={session.userId} />
        </div>
      </div>
    </>
  );
}
