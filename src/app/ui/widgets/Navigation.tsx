import retrieveLinks from "@/app/actions/links";
import Link from "next/link";

export default async function Navigation() {
  const navigationLinks = await retrieveLinks();

  return (
    <>
      <nav className="px-16 py-2">
        <ul className="flex gap-4">
          {Object.entries(navigationLinks).map((link, index) => {
            return (
              <li
                className="text-lg text-neutral-700 font-semibold hover:scale-105 hover:transition hover:duration-300"
                key={index}
              >
                <Link href={link[1]}>{link[0]}</Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
