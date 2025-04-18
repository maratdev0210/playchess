import Play from "./Play";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/session";
import Chat from "@/app/ui/chat/Chat";
import getUserData from "@/app/actions/getUserData";
import getGameData from "@/app/actions/getGameData";
import { IMessage } from "@/types/chat";
import { JsonValue } from "@prisma/client/runtime/library";

export default async function Page({
  params,
}: {
  params: Promise<{ game: string }>;
}) {
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);
  const userData = await getUserData(session?.userId);
  const { game } = await params;

  return (
    <>
      <div className="flex justify-center items-center px-8">
        <Chat gameId={game} username={userData.username} />
        <Play gameId={game} userId={session.userId} />
      </div>
    </>
  );
}
