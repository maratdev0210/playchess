import { Toaster } from "sonner";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="fixed top-1/2 -translate-y-1/2 flex justify-center w-full">
        <div className="h-120 flex justify-center items-center border-1 min-w-60 sm:w-80 lg:w-120 shadow-md rounded-md">
          {children}
        </div>
      </div>
      <Toaster className="bg-green-500 text-white" />
    </>
  );
}
