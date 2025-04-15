import Play from "./Play";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/session";

export default async function Page({
  params,
}: {
  params: Promise<{ game: string }>;
}) {
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);

  const { game } = await params;

  return (
    <>
      <Play gameId={game} />
    </>
  );
}
