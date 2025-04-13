export default async function Page({
  params,
}: {
  params: Promise<{ user: string }>;
}) {
  const { user } = await params;
  return <div>My Username: {user}</div>;
}
