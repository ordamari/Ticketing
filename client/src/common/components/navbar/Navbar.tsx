import Link from "next/link";
import { User } from "../../types/user.type";
import useTranslation from "../../hooks/useTranslation";
import { useMemo } from "react";

type PrivateProps = {
  currentUser: User | null;
};

function Navbar({ currentUser }: PrivateProps) {
  const t = useTranslation();

  const links = useMemo(() => {
    return [
      !currentUser && { label: t("auth.signin"), href: "/auth/signin" },
      !currentUser && { label: t("auth.signup"), href: "/auth/signup" },
      currentUser && { label: t("auth.signout"), href: "/auth/signout" },
    ].filter(Boolean);
  }, [t, currentUser]);

  return (
    <nav className="navbar flex justify-space-between bg-primary navbar">
      <Link className="logo" href="/">
        GiTix
      </Link>

      <ul className="flex gap-small">
        {links.map(({ label, href }) => (
          <li key={href}>
            <Link href={href}>{label}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
export default Navbar;
